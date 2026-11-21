import type { Prisma, PrismaClient } from "@prisma/client";
import { slugify, type ResearchDraft } from "./schema";

const NOT_AVAILABLE = "Not available (unknown) — added via AI Research Assistant; verify at source.";

export class ModelExistsError extends Error {}
export class MissingCompanyError extends Error {}

export type SaveResult = { slug: string; pricingSaved: number; benchSaved: number; providersSaved: number; warnings: string[] };

/** Writes an approved draft (all four groups) in a single transaction. Call only after explicit Super Admin approval. */
export async function saveDraft(db: PrismaClient, draft: ResearchDraft, updateExisting: boolean): Promise<SaveResult> {
  const m = draft.model;
  if (!m.company.name) throw new MissingCompanyError("A company name is required to save a model (the existing schema links every model to a company). Fill it in or cancel.");
  const existing = await db.aIModel.findUnique({ where: { slug: m.slug } });
  if (existing && !updateExisting) throw new ModelExistsError(`A model with slug "${m.slug}" already exists.`);

  const warnings: string[] = [];
  return db.$transaction(async (tx: Prisma.TransactionClient) => {
    // Group 1 — AI Model (+ company, capabilities from modalities)
    const companySlug = slugify(m.company.name!);
    const company = await tx.company.upsert({
      where: { slug: companySlug }, update: {},
      create: { slug: companySlug, name: m.company.name!, description: m.company.description || NOT_AVAILABLE, website: m.company.website || "" },
    });
    const data = {
      name: m.name, description: m.description || NOT_AVAILABLE, category: m.category || "Unknown",
      modalities: m.modalities, contextWindow: m.contextWindow, inputPrice: m.inputPrice, outputPrice: m.outputPrice,
      releaseDate: m.releaseDate ? new Date(m.releaseDate) : null,
      isSample: false, source: m.sourceUrl, lastUpdated: new Date(), companyId: company.id,
    };
    const model = existing
      ? await tx.aIModel.update({ where: { id: existing.id }, data })
      : await tx.aIModel.create({ data: { slug: m.slug, ...data } });
    for (const cap of new Set(m.modalities.map((x) => x.trim()).filter(Boolean))) {
      await tx.modelCapability.upsert({ where: { modelId_name: { modelId: model.id, name: cap } }, update: {}, create: { modelId: model.id, name: cap } });
    }

    // Group 2 — Providers
    const providerIds = new Map<string, string>();
    for (const p of draft.providers) {
      const slug = slugify(p.name); if (!slug) continue;
      const row = await tx.provider.upsert({
        where: { slug }, update: {},
        create: { slug, name: p.name, description: [p.description, p.modelAvailability].filter(Boolean).join(" — ") || NOT_AVAILABLE, website: p.website || "" },
      });
      providerIds.set(slug, row.id);
    }

    // Group 3 — Pricing
    let pricingSaved = 0;
    for (const pr of draft.pricing) {
      if (pr.inputPrice === null || pr.outputPrice === null) { warnings.push(`Pricing for ${pr.providerName} skipped: input and output price must both be known.`); continue; }
      if ((pr.currency || "USD").toUpperCase() !== "USD") { warnings.push(`Pricing for ${pr.providerName} skipped: only USD is supported by the current schema.`); continue; }
      const slug = slugify(pr.providerName);
      let providerId = providerIds.get(slug);
      if (!providerId) {
        const row = await tx.provider.upsert({ where: { slug }, update: {}, create: { slug, name: pr.providerName, description: NOT_AVAILABLE, website: "" } });
        providerId = row.id; providerIds.set(slug, providerId);
      }
      const vals = { inputPrice: pr.inputPrice, outputPrice: pr.outputPrice, isSample: false, source: pr.sourceUrl, updatedAt: pr.lastUpdated ? new Date(pr.lastUpdated) : new Date() };
      await tx.modelPricing.upsert({ where: { modelId_providerId: { modelId: model.id, providerId } }, update: vals, create: { modelId: model.id, providerId, ...vals } });
      pricingSaved++;
    }

    // Group 4 — Benchmarks
    let benchSaved = 0;
    for (const b of draft.benchmarks) {
      if (b.score === null) { warnings.push(`Benchmark "${b.name}" skipped: score unknown.`); continue; }
      if (!b.sourceUrl) { warnings.push(`Benchmark "${b.name}" skipped: no source URL.`); continue; }
      const slug = slugify(b.name); if (!slug) continue;
      const bench = await tx.benchmark.upsert({
        where: { slug }, update: {},
        create: { slug, name: b.name, category: b.category || "Unknown", description: NOT_AVAILABLE, unit: b.unit || "%", url: b.sourceUrl },
      });
      const vals = { score: b.score, source: new URL(b.sourceUrl).hostname, sourceUrl: b.sourceUrl, measuredAt: b.measurementDate ? new Date(b.measurementDate) : null };
      await tx.benchmarkResult.upsert({ where: { modelId_benchmarkId: { modelId: model.id, benchmarkId: bench.id } }, update: vals, create: { modelId: model.id, benchmarkId: bench.id, ...vals } });
      benchSaved++;
    }
    return { slug: model.slug, pricingSaved, benchSaved, providersSaved: providerIds.size, warnings };
  }, { timeout: 30_000 });
}

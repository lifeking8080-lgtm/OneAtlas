import { z } from "zod";

// "Unknown" is represented as null. Nothing is ever defaulted to a made-up value.
const url = z.string().trim().max(2000).refine((v) => v === "" || /^https?:\/\//i.test(v), "Must be an http(s) URL");
const nullableStr = z.string().trim().max(2000).nullable();
const nullableNum = z.number().finite().nonnegative().nullable();
const nullableDate = z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD").nullable();

export const modelGroup = z.object({
  name: z.string().trim().min(1).max(120),
  slug: z.string().trim().min(1).max(140).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Lowercase letters, numbers and hyphens only"),
  description: nullableStr,
  category: nullableStr,
  modalities: z.array(z.string().trim().min(1).max(40)).max(12),
  contextWindow: z.number().int().positive().nullable(),
  inputPrice: nullableNum,
  outputPrice: nullableNum,
  releaseDate: nullableDate,
  company: z.object({ name: nullableStr, website: nullableStr, description: nullableStr }),
  sourceUrl: url.nullable(),
});

export const providerGroup = z.object({
  name: z.string().trim().min(1).max(120),
  description: nullableStr,
  website: nullableStr,
  modelAvailability: nullableStr,
});

export const pricingGroup = z.object({
  modelName: z.string().trim().min(1).max(120),
  providerName: z.string().trim().min(1).max(120),
  inputPrice: nullableNum,
  outputPrice: nullableNum,
  currency: z.string().trim().max(10).nullable(),
  sourceUrl: url.nullable(),
  lastUpdated: nullableDate,
});

export const benchmarkGroup = z.object({
  name: z.string().trim().min(1).max(120),
  category: nullableStr,
  score: z.number().finite().nullable(),
  unit: nullableStr,
  sourceUrl: url.nullable(),
  measurementDate: nullableDate,
});

export const draftSchema = z.object({
  model: modelGroup,
  providers: z.array(providerGroup).max(30),
  pricing: z.array(pricingGroup).max(60),
  benchmarks: z.array(benchmarkGroup).max(60),
  sources: z.array(z.object({ title: z.string().max(500), url: z.string().max(2000) })).max(40),
  unknowns: z.array(z.string().max(300)).max(60),
});
export type ResearchDraft = z.infer<typeof draftSchema>;

export const approveSchema = z.object({
  draft: draftSchema,
  updateExisting: z.boolean().default(false),
});

export const slugify = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 140);

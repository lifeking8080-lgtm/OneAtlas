import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "./db";

const empty = (v: unknown) => (v === "" || v === null ? undefined : v);
const opt = z.preprocess(empty, z.string().trim().max(100).optional());
export const modelQuery = z.object({
  q: opt, company: opt, provider: opt, capability: opt, category: opt,
  sort: z.preprocess(empty, z.enum(["newest", "name", "price_asc", "price_desc", "context_desc"]).default("newest")),
  page: z.preprocess(empty, z.coerce.number().int().min(1).default(1)),
  pageSize: z.preprocess(empty, z.coerce.number().int().min(1).max(50).default(12)),
});
export type ModelQuery = z.infer<typeof modelQuery>;
const first = (v: unknown) => (Array.isArray(v) ? v[0] : v);
export const parseParams = (o: Record<string, unknown>) =>
  modelQuery.parse(Object.fromEntries(Object.entries(o).map(([k, v]) => [k, first(v)])));

const orders: Record<ModelQuery["sort"], Prisma.AIModelOrderByWithRelationInput> = {
  newest: { releaseDate: { sort: "desc", nulls: "last" } },
  name: { name: "asc" },
  price_asc: { inputPrice: { sort: "asc", nulls: "last" } },
  price_desc: { inputPrice: { sort: "desc", nulls: "last" } },
  context_desc: { contextWindow: { sort: "desc", nulls: "last" } },
};
const card = { company: true, capabilities: true } satisfies Prisma.AIModelInclude;

export async function listModels(q: ModelQuery) {
  const where: Prisma.AIModelWhereInput = {
    ...(q.q && { OR: [{ name: { contains: q.q, mode: "insensitive" } }, { description: { contains: q.q, mode: "insensitive" } }] }),
    ...(q.company && { company: { slug: q.company } }),
    ...(q.provider && { pricing: { some: { provider: { slug: q.provider } } } }),
    ...(q.capability && { capabilities: { some: { name: q.capability } } }),
    ...(q.category && { category: q.category }),
  };
  const [total, items] = await Promise.all([
    prisma.aIModel.count({ where }),
    prisma.aIModel.findMany({ where, orderBy: [orders[q.sort], { name: "asc" }], skip: (q.page - 1) * q.pageSize, take: q.pageSize, include: card }),
  ]);
  return { items, total, page: q.page, pageSize: q.pageSize, pages: Math.max(1, Math.ceil(total / q.pageSize)) };
}
export const getModel = (slug: string) =>
  prisma.aIModel.findUnique({ where: { slug }, include: { company: true, capabilities: true, pricing: { include: { provider: true } }, results: { include: { benchmark: true } } } });
export const compareModels = (slugs: string[]) =>
  prisma.aIModel.findMany({ where: { slug: { in: slugs } }, include: { company: true, capabilities: true, results: { include: { benchmark: true } } } });
export const listProviders = () => prisma.provider.findMany({ orderBy: { name: "asc" }, include: { pricing: { include: { model: { include: { company: true } } } } } });
export const listCompanies = () => prisma.company.findMany({ orderBy: { name: "asc" }, include: { models: { orderBy: { name: "asc" } }, _count: { select: { models: true } } } });
export const listBenchmarks = () => prisma.benchmark.findMany({ orderBy: { name: "asc" }, include: { _count: { select: { results: true } } } });
export async function rankings(benchmark?: string, category?: string) {
  const benchmarks = await prisma.benchmark.findMany({ where: category ? { category } : undefined, orderBy: { name: "asc" } });
  const active = benchmarks.find((b) => b.slug === benchmark) ?? benchmarks[0] ?? null;
  const rows = active ? await prisma.benchmarkResult.findMany({ where: { benchmarkId: active.id }, orderBy: { score: "desc" }, include: { model: { include: { company: true } } } }) : [];
  return { benchmarks, active, rows };
}
export async function search(term: string) {
  const [models, providers, companies] = await Promise.all([
    prisma.aIModel.findMany({ where: { OR: [{ name: { contains: term, mode: "insensitive" } }, { description: { contains: term, mode: "insensitive" } }] }, take: 20, include: card }),
    prisma.provider.findMany({ where: { name: { contains: term, mode: "insensitive" } }, take: 10 }),
    prisma.company.findMany({ where: { name: { contains: term, mode: "insensitive" } }, take: 10 }),
  ]);
  return { models, providers, companies };
}
export async function stats() {
  const [models, companies, providers, benchmarks] = await Promise.all([prisma.aIModel.count(), prisma.company.count(), prisma.provider.count(), prisma.benchmarkResult.count()]);
  return { models, companies, providers, benchmarkResults: benchmarks };
}
export async function filterOptions() {
  const [companies, providers, caps, cats] = await Promise.all([
    prisma.company.findMany({ orderBy: { name: "asc" }, select: { slug: true, name: true } }),
    prisma.provider.findMany({ orderBy: { name: "asc" }, select: { slug: true, name: true } }),
    prisma.modelCapability.findMany({ distinct: ["name"], orderBy: { name: "asc" }, select: { name: true } }),
    prisma.aIModel.findMany({ distinct: ["category"], orderBy: { category: "asc" }, select: { category: true } }),
  ]);
  return { companies, providers, capabilities: caps.map((c) => c.name), categories: cats.map((c) => c.category) };
}
export const money = (n: number | null) => (n == null ? "n/a" : `$${n < 1 ? n.toFixed(2) : n.toFixed(2)}`);
export const ctx = (n: number | null) => (n == null ? "n/a" : n >= 1_000_000 ? `${n / 1_000_000}M` : `${Math.round(n / 1000)}K`);
export const date = (d: Date | null) => (d ? d.toISOString().slice(0, 10) : "n/a");

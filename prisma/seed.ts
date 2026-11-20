// DEMO / SAMPLE DATA. Prices, dates and context windows are illustrative and NOT verified.
// Benchmark scores are intentionally NOT seeded: add real, sourced results via BenchmarkResult.
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
const SRC = "OneAtlas demo seed (unverified)";

const companies = [
  ["openai", "OpenAI", "AI research and deployment company behind the GPT model family.", "https://openai.com"],
  ["google-deepmind", "Google DeepMind", "Google's AI research lab, developer of the Gemini models.", "https://deepmind.google"],
  ["anthropic", "Anthropic", "AI safety company developing the Claude model family.", "https://www.anthropic.com"],
  ["meta-ai", "Meta AI", "Meta's AI research group, publisher of the open-weight Llama models.", "https://ai.meta.com"],
  ["deepseek", "DeepSeek", "Chinese AI lab releasing open-weight reasoning and chat models.", "https://www.deepseek.com"],
  ["mistral-ai", "Mistral AI", "Paris-based AI company building open and commercial models.", "https://mistral.ai"],
  ["xai", "xAI", "AI company developing the Grok models.", "https://x.ai"],
];
const providers = [
  ["openrouter", "OpenRouter", "Unified API that routes requests to many model providers.", "https://openrouter.ai"],
  ["together-ai", "Together AI", "Inference platform for open-source models.", "https://www.together.ai"],
  ["fireworks-ai", "Fireworks AI", "Fast inference platform for open and custom models.", "https://fireworks.ai"],
];
// slug, name, company, category, modalities, context, in, out, release, caps, featured, description
type M = [string, string, string, string, string[], number, number, number, string, string[], boolean, string];
const models: M[] = [
  ["gpt-4o", "GPT-4o", "openai", "Multimodal LLM", ["text", "image", "audio"], 128000, 2.5, 10, "2024-05-13", ["Vision", "Function calling", "JSON mode"], true, "OpenAI's multimodal flagship chat model."],
  ["gpt-4o-mini", "GPT-4o mini", "openai", "Multimodal LLM", ["text", "image"], 128000, 0.15, 0.6, "2024-07-18", ["Vision", "Function calling", "JSON mode"], false, "Smaller, lower-cost GPT-4o variant."],
  ["claude-3-5-sonnet", "Claude 3.5 Sonnet", "anthropic", "Multimodal LLM", ["text", "image"], 200000, 3, 15, "2024-06-20", ["Vision", "Function calling", "Code generation"], true, "Anthropic's balanced model for coding and analysis."],
  ["gemini-1-5-pro", "Gemini 1.5 Pro", "google-deepmind", "Multimodal LLM", ["text", "image", "audio", "video"], 2000000, 1.25, 5, "2024-05-14", ["Vision", "Long context", "Function calling"], true, "Long-context multimodal model from Google DeepMind."],
  ["llama-3-1-405b", "Llama 3.1 405B", "meta-ai", "Open-weight LLM", ["text"], 128000, 3, 3, "2024-07-23", ["Open weights", "Function calling", "Code generation"], false, "Largest open-weight model in the Llama 3.1 family."],
  ["deepseek-v3", "DeepSeek-V3", "deepseek", "Open-weight LLM", ["text"], 64000, 0.27, 1.1, "2024-12-26", ["Open weights", "Code generation"], false, "Mixture-of-experts open-weight chat model."],
  ["mistral-large-2", "Mistral Large 2", "mistral-ai", "LLM", ["text"], 128000, 2, 6, "2024-07-24", ["Function calling", "Code generation", "JSON mode"], false, "Mistral's flagship commercial model."],
  ["grok-2", "Grok-2", "xai", "Multimodal LLM", ["text", "image"], 131072, 2, 10, "2024-08-13", ["Vision", "Function calling"], false, "xAI's second-generation Grok model."],
];
const benchmarks = [
  ["mmlu", "MMLU", "Knowledge", "Multi-task language understanding accuracy.", "%", "https://arxiv.org/abs/2009.03300"],
  ["gpqa", "GPQA", "Reasoning", "Graduate-level science question answering.", "%", "https://arxiv.org/abs/2311.12022"],
  ["humaneval", "HumanEval", "Coding", "Python function-synthesis pass@1.", "%", "https://arxiv.org/abs/2107.03374"],
];

async function main() {
  for (const [slug, name, description, website] of companies)
    await db.company.upsert({ where: { slug }, update: { name, description, website }, create: { slug, name, description, website } });
  for (const [slug, name, description, website] of providers)
    await db.provider.upsert({ where: { slug }, update: { name, description, website }, create: { slug, name, description, website } });
  for (const [slug, name, category, description, unit, url] of benchmarks)
    await db.benchmark.upsert({ where: { slug }, update: { name, category, description, unit, url }, create: { slug, name, category, description, unit, url } });
  for (const [slug, name, co, category, modalities, contextWindow, inputPrice, outputPrice, rd, caps, featured, description] of models) {
    const company = await db.company.findUniqueOrThrow({ where: { slug: co } });
    const data = { name, description, category, modalities, contextWindow, inputPrice, outputPrice, releaseDate: new Date(rd), featured, isSample: true, source: SRC, companyId: company.id };
    const m = await db.aIModel.upsert({ where: { slug }, update: data, create: { slug, ...data } });
    for (const c of caps) await db.modelCapability.upsert({ where: { modelId_name: { modelId: m.id, name: c } }, update: {}, create: { modelId: m.id, name: c } });
    const hosts = ["openrouter", ...(category.startsWith("Open") ? ["together-ai", "fireworks-ai"] : [])];
    for (const h of hosts) {
      const p = await db.provider.findUniqueOrThrow({ where: { slug: h } });
      await db.modelPricing.upsert({ where: { modelId_providerId: { modelId: m.id, providerId: p.id } }, update: { inputPrice, outputPrice }, create: { modelId: m.id, providerId: p.id, inputPrice, outputPrice, isSample: true, source: SRC } });
    }
  }
  console.log("Seeded demo data (unverified).");
}
main().finally(() => db.$disconnect());

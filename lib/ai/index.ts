import { createGroqProvider } from "./groq";
import { AIConfigError, type AIProvider } from "./types";

export * from "./types";

// To switch to a paid provider later: add lib/ai/<name>.ts implementing AIProvider,
// register it here, and set AI_PROVIDER=<name> in the environment. No route/UI changes needed.
const registry: Record<string, () => AIProvider> = {
  groq: createGroqProvider,
};

export function getAIProvider(): AIProvider {
  const id = (process.env.AI_PROVIDER || "groq").toLowerCase();
  const factory = registry[id];
  if (!factory) throw new AIConfigError(`Unknown AI_PROVIDER "${id}". Supported: ${Object.keys(registry).join(", ")}.`);
  return factory();
}

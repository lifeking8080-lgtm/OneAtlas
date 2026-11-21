import { AIConfigError, AIRequestError, type AIJsonRequest, type AIProvider } from "./types";

// Groq exposes an OpenAI-compatible chat completions endpoint (free tier available).
export function createGroqProvider(): AIProvider {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new AIConfigError("GROQ_API_KEY is not configured on the server.");
  const model = process.env.GROQ_MODEL || "openai/gpt-oss-120b";
  return {
    id: "groq",
    model,
    async generateJson({ system, user, maxTokens = 6000 }: AIJsonRequest) {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          temperature: 0.1,
          max_completion_tokens: maxTokens,
          reasoning_effort: "low",
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(90_000),
      });
      const data: any = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 429) throw new AIRequestError("Groq free-tier rate limit reached. Wait a minute and try again.");
        throw new AIRequestError(data?.error?.message || `Groq request failed (${res.status}).`);
      }
      const text = data?.choices?.[0]?.message?.content;
      if (typeof text !== "string" || !text.trim()) throw new AIRequestError("Groq returned an empty response.");
      return text;
    },
  };
}

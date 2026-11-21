// Provider-agnostic AI interface. Swap implementations without touching routes/UI.
export type AIJsonRequest = {
  system: string;
  user: string;
  maxTokens?: number;
};
export interface AIProvider {
  readonly id: string;
  readonly model: string;
  /** Returns the raw JSON text produced by the model. */
  generateJson(req: AIJsonRequest): Promise<string>;
}
export class AIConfigError extends Error {}
export class AIRequestError extends Error {}

export type ModelDeveloper =
  | "HuggingFace"
  | "Google"
  | "Meta"
  | "Mistral"
  | "OpenAI"
  | "Groq"
  | "Anthropic";

export interface ModelInfo {
  id: string;
  developer: ModelDeveloper;
  contextWindow: number | null;
  maxOutputTokens: number | null;
  maxFileSize: string | null;
  modelCardUrl: string;
  isDeprecated?: boolean;
  isPreview?: boolean;
}

export type ModelCategory = "production" | "preview";

export interface ModelCatalog {
  [category: string]: {
    [modelId: string]: ModelInfo;
  };
}

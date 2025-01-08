export type ModelDeveloper =
  | "HuggingFace"
  | "Google"
  | "Meta"
  | "Mistral"
  | "OpenAI"
  | "Groq"
  | "Anthropic"
  | "DeepSeek"
  | "Qwen"
  | "NousResearch"
  | "Microsoft"
  | "OpenChat"
  | "01.AI"
  | "DeepSeek"
  | "Together"
  | "Upstage"
  | "Databricks"
  | "NVIDIA"
  | "xAI";

export interface ModelInfo {
  id: string;
  developer: ModelDeveloper;
  contextWindow: number | null;
  maxOutputTokens: number | null;
  maxFileSize?: string | null;
  modelCardUrl?: string;
  isDeprecated?: boolean;
  isPreview?: boolean;
}

export type ModelCategory = "production" | "preview";

export interface ModelCatalog {
  [category: string]: {
    [modelId: string]: ModelInfo;
  };
}

interface GeminiModelInfo {
  maxInputTokens: number;
  maxOutputTokens: number;
  description: string;
  isExperimental?: boolean;
}

const GEMINI_MODELS: Record<string, GeminiModelInfo> = {
  // Gemini 2.0 Models
  "gemini-2.0-flash-exp": {
    maxInputTokens: 1048576, // 1M tokens
    maxOutputTokens: 8192,
    description:
      "Next-gen features and improved capabilities, including superior speed, native tool use, multimodal generation",
    isExperimental: true,
  },

  // Gemini 1.5 Models
  "gemini-1.5-flash": {
    maxInputTokens: 32768,
    maxOutputTokens: 8192,
    description:
      "Fast and versatile performance across a diverse variety of tasks",
  },
  "gemini-1.5-flash-8b": {
    maxInputTokens: 32768,
    maxOutputTokens: 8192,
    description: "High volume and lower intelligence tasks",
  },
  "gemini-1.5-pro": {
    maxInputTokens: 32768,
    maxOutputTokens: 8192,
    description: "Complex reasoning tasks requiring more intelligence",
  },

  // Text Embedding Models
  "text-embedding-004": {
    maxInputTokens: 2048,
    maxOutputTokens: 768, // Output dimension size
    description: "Measuring the relatedness of text strings",
  },

  // AQA Model
  aqa: {
    maxInputTokens: 7168,
    maxOutputTokens: 1024,
    description: "Providing source-grounded answers to questions",
  },
};

export const DEFAULT_MAX_TOKENS = 32768;

export function isGeminiModel(model: string): boolean {
  return model in GEMINI_MODELS;
}

export function getGeminiModel(model: string): GeminiModelInfo | undefined {
  return GEMINI_MODELS[model];
}

export function getDefaultGeminiModel(): string {
  return "gemini-1.5-flash";
}

// Helper to check if a model is experimental
export function isExperimentalModel(model: string): boolean {
  const modelInfo = GEMINI_MODELS[model];
  return modelInfo?.isExperimental ?? false;
}

// Helper to get max input tokens for a model
export function getMaxInputTokens(model: string): number {
  return GEMINI_MODELS[model]?.maxInputTokens ?? DEFAULT_MAX_TOKENS;
}

// Helper to get max output tokens for a model
export function getMaxOutputTokens(model: string): number {
  return GEMINI_MODELS[model]?.maxOutputTokens ?? DEFAULT_MAX_TOKENS;
}

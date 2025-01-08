interface DeepseekModelInfo {
  maxInputTokens: number;
  maxOutputTokens: number;
  description: string;
  priceConfig: {
    input: {
      cacheHit: number;
      cacheMiss: number;
    };
    output: number;
  };
}

const DEEPSEEK_MODELS: Record<string, DeepseekModelInfo> = {
  "deepseek-chat": {
    maxInputTokens: 64 * 1024, // 64K context window
    maxOutputTokens: 8 * 1024, // 8K max output tokens
    description: "DeepSeek-V3 chat model with 64K context",
    priceConfig: {
      input: {
        cacheHit: 0.014 / 1_000_000, // $0.014 per 1M tokens
        cacheMiss: 0.14 / 1_000_000, // $0.14 per 1M tokens
      },
      output: 0.28 / 1_000_000, // $0.28 per 1M tokens
    },
  },
};

export function isDeepseekModel(model: string): boolean {
  return model in DEEPSEEK_MODELS;
}

export function getDeepseekModel(model: string): DeepseekModelInfo | undefined {
  return DEEPSEEK_MODELS[model];
}

export function getMaxInputTokens(model: string): number {
  return DEEPSEEK_MODELS[model]?.maxInputTokens || 64 * 1024;
}

export function getMaxOutputTokens(model: string): number {
  return DEEPSEEK_MODELS[model]?.maxOutputTokens || 4 * 1024; // Default to 4K if not specified
}

export function getDefaultDeepseekModel(): string {
  return "deepseek-chat";
}

export function getAllDeepseekModels(): string[] {
  return Object.keys(DEEPSEEK_MODELS);
}

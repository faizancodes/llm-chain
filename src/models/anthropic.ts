interface AnthropicModelInfo {
  maxInputTokens: number;
  maxOutputTokens: number;
  description: string;
  isExperimental?: boolean;
}

const ANTHROPIC_MODELS: Record<string, AnthropicModelInfo> = {
  "claude-3-5-sonnet-20241022": {
    maxInputTokens: 200000,
    maxOutputTokens: 8192,
    description: "Latest Sonnet model for balanced performance",
  },
  "claude-3-5-haiku-20241022": {
    maxInputTokens: 200000,
    maxOutputTokens: 8192,
    description: "Latest Haiku model for fast performance",
  },
  "claude-3-opus-20240229": {
    maxInputTokens: 200000,
    maxOutputTokens: 4096,
    description: "Powerful model for highly complex tasks",
  },
  "claude-3-sonnet-20240229": {
    maxInputTokens: 200000,
    maxOutputTokens: 4096,
    description: "Balance of intelligence and speed",
  },
  "claude-3-haiku-20240307": {
    maxInputTokens: 200000,
    maxOutputTokens: 4096,
    description: "Quick and accurate targeted performance",
  },
  "claude-2.1": {
    maxInputTokens: 200000,
    maxOutputTokens: 4096,
    description: "Legacy model with improved accuracy",
  },
};

export function isAnthropicModel(model: string): boolean {
  return model in ANTHROPIC_MODELS;
}

export function getAnthropicModel(
  model: string
): AnthropicModelInfo | undefined {
  return ANTHROPIC_MODELS[model];
}

export function getMaxInputTokens(model: string): number {
  return ANTHROPIC_MODELS[model]?.maxInputTokens || 200000;
}

export function getMaxOutputTokens(model: string): number {
  return ANTHROPIC_MODELS[model]?.maxOutputTokens || 4096;
}

export function isExperimentalModel(model: string): boolean {
  return ANTHROPIC_MODELS[model]?.isExperimental || false;
}

export function getDefaultAnthropicModel(): string {
  return "claude-3-5-sonnet-latest";
}

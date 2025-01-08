import { ModelCatalog } from "./types";

export const togetherModels: ModelCatalog = {
  production: {
    // Mistral Models
    "mistralai/Mixtral-8x7B-Instruct-v0.1": {
      id: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      developer: "Mistral",
      contextWindow: 32768,
      maxOutputTokens: 4096,
    },
    "mistralai/Mistral-7B-Instruct-v0.1": {
      id: "mistralai/Mistral-7B-Instruct-v0.1",
      developer: "Mistral",
      contextWindow: 8192,
      maxOutputTokens: 4096,
    },
    "mistralai/Mistral-7B-Instruct-v0.2": {
      id: "mistralai/Mistral-7B-Instruct-v0.2",
      developer: "Mistral",
      contextWindow: 32768,
      maxOutputTokens: 4096,
    },
    "mistralai/Mistral-7B-Instruct-v0.3": {
      id: "mistralai/Mistral-7B-Instruct-v0.3",
      developer: "Mistral",
      contextWindow: 32768,
      maxOutputTokens: 4096,
    },
    "mistralai/Mixtral-8x22B-Instruct-v0.1": {
      id: "mistralai/Mixtral-8x22B-Instruct-v0.1",
      developer: "Mistral",
      contextWindow: 65536,
      maxOutputTokens: 4096,
    },

    // Meta Models
    "meta-llama/Llama-2-70b-chat-hf": {
      id: "meta-llama/Llama-2-70b-chat-hf",
      developer: "Meta",
      contextWindow: 4096,
      maxOutputTokens: 4096,
    },
    "meta-llama/Llama-2-13b-chat-hf": {
      id: "meta-llama/Llama-2-13b-chat-hf",
      developer: "Meta",
      contextWindow: 4096,
      maxOutputTokens: 4096,
    },
    "meta-llama/Llama-2-7b-chat-hf": {
      id: "meta-llama/Llama-2-7b-chat-hf",
      developer: "Meta",
      contextWindow: 4096,
      maxOutputTokens: 4096,
    },
    "meta-llama/Llama-3.3-70B-Instruct-Turbo": {
      id: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
      developer: "Meta",
      contextWindow: 131072,
      maxOutputTokens: 4096,
    },
    "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo": {
      id: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
      developer: "Meta",
      contextWindow: 131072,
      maxOutputTokens: 4096,
    },
    "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo": {
      id: "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo",
      developer: "Meta",
      contextWindow: 131072,
      maxOutputTokens: 4096,
    },
    "meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo": {
      id: "meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo",
      developer: "Meta",
      contextWindow: 130815,
      maxOutputTokens: 4096,
    },
    "meta-llama/Meta-Llama-3-8B-Instruct-Turbo": {
      id: "meta-llama/Meta-Llama-3-8B-Instruct-Turbo",
      developer: "Meta",
      contextWindow: 8192,
      maxOutputTokens: 4096,
    },
    "meta-llama/Meta-Llama-3-70B-Instruct-Turbo": {
      id: "meta-llama/Meta-Llama-3-70B-Instruct-Turbo",
      developer: "Meta",
      contextWindow: 8192,
      maxOutputTokens: 4096,
    },
    "meta-llama/Llama-3.2-3B-Instruct-Turbo": {
      id: "meta-llama/Llama-3.2-3B-Instruct-Turbo",
      developer: "Meta",
      contextWindow: 131072,
      maxOutputTokens: 4096,
    },
    "meta-llama/Meta-Llama-3-8B-Instruct-Lite": {
      id: "meta-llama/Meta-Llama-3-8B-Instruct-Lite",
      developer: "Meta",
      contextWindow: 8192,
      maxOutputTokens: 4096,
    },
    "meta-llama/Meta-Llama-3-70B-Instruct-Lite": {
      id: "meta-llama/Meta-Llama-3-70B-Instruct-Lite",
      developer: "Meta",
      contextWindow: 8192,
      maxOutputTokens: 4096,
    },
    "meta-llama/Llama-3-8b-chat-hf": {
      id: "meta-llama/Llama-3-8b-chat-hf",
      developer: "Meta",
      contextWindow: 8192,
      maxOutputTokens: 4096,
    },
    "meta-llama/Llama-3-70b-chat-hf": {
      id: "meta-llama/Llama-3-70b-chat-hf",
      developer: "Meta",
      contextWindow: 8192,
      maxOutputTokens: 4096,
    },

    // Google Models
    "google/gemma-2-27b-it": {
      id: "google/gemma-2-27b-it",
      developer: "Google",
      contextWindow: 8192,
      maxOutputTokens: 4096,
    },
    "google/gemma-2-9b-it": {
      id: "google/gemma-2-9b-it",
      developer: "Google",
      contextWindow: 8192,
      maxOutputTokens: 4096,
    },
    "google/gemma-2b-it": {
      id: "google/gemma-2b-it",
      developer: "Google",
      contextWindow: 8192,
      maxOutputTokens: 4096,
    },

    "nvidia/Llama-3.1-Nemotron-70B-Instruct-HF": {
      id: "nvidia/Llama-3.1-Nemotron-70B-Instruct-HF",
      developer: "NVIDIA",
      contextWindow: 32768,
      maxOutputTokens: 4096,
    },
    "Qwen/Qwen2.5-Coder-32B-Instruct": {
      id: "Qwen/Qwen2.5-Coder-32B-Instruct",
      developer: "Qwen",
      contextWindow: 32768,
      maxOutputTokens: 4096,
    },
    "Qwen/QwQ-32B-Preview": {
      id: "Qwen/QwQ-32B-Preview",
      developer: "Qwen",
      contextWindow: 32768,
      maxOutputTokens: 4096,
    },
    "microsoft/WizardLM-2-8x22B": {
      id: "microsoft/WizardLM-2-8x22B",
      developer: "Microsoft",
      contextWindow: 65536,
      maxOutputTokens: 4096,
    },
    "databricks/dbrx-instruct": {
      id: "databricks/dbrx-instruct",
      developer: "Databricks",
      contextWindow: 32768,
      maxOutputTokens: 4096,
    },
    "deepseek-ai/deepseek-llm-67b-chat": {
      id: "deepseek-ai/deepseek-llm-67b-chat",
      developer: "DeepSeek",
      contextWindow: 4096,
      maxOutputTokens: 4096,
    },
    "deepseek-ai/DeepSeek-V3": {
      id: "deepseek-ai/DeepSeek-V3",
      developer: "DeepSeek",
      contextWindow: 131072,
      maxOutputTokens: 4096,
    },
    "Gryphe/MythoMax-L2-13b": {
      id: "Gryphe/MythoMax-L2-13b",
      developer: "HuggingFace",
      contextWindow: 4096,
      maxOutputTokens: 4096,
    },
    "NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO": {
      id: "NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO",
      developer: "NousResearch",
      contextWindow: 32768,
      maxOutputTokens: 4096,
    },
    "Qwen/Qwen2.5-7B-Instruct-Turbo": {
      id: "Qwen/Qwen2.5-7B-Instruct-Turbo",
      developer: "Qwen",
      contextWindow: 32768,
      maxOutputTokens: 4096,
    },
    "Qwen/Qwen2.5-72B-Instruct-Turbo": {
      id: "Qwen/Qwen2.5-72B-Instruct-Turbo",
      developer: "Qwen",
      contextWindow: 32768,
      maxOutputTokens: 4096,
    },
    "Qwen/Qwen2-72B-Instruct": {
      id: "Qwen/Qwen2-72B-Instruct",
      developer: "Qwen",
      contextWindow: 32768,
      maxOutputTokens: 4096,
    },
    "upstage/SOLAR-10.7B-Instruct-v1.0": {
      id: "upstage/SOLAR-10.7B-Instruct-v1.0",
      developer: "Upstage",
      contextWindow: 4096,
      maxOutputTokens: 4096,
    },
  },
  preview: {},
};

export function isTogetherModel(modelId: string): boolean {
  return (
    modelId in togetherModels.production || modelId in togetherModels.preview
  );
}

export function getTogetherModel(modelId: string) {
  if (modelId in togetherModels.production) {
    return togetherModels.production[modelId];
  }
  if (modelId in togetherModels.preview) {
    return togetherModels.preview[modelId];
  }
  throw new Error(`Invalid Together model: ${modelId}`);
}

export function getDefaultTogetherModel(): string {
  return "mistralai/Mixtral-8x7B-Instruct-v0.1";
}

export const getAllTogetherModels = () => {
  return {
    ...togetherModels.production,
    ...togetherModels.preview,
  };
};

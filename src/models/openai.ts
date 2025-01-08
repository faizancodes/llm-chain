import { ModelCatalog } from "./types";

export const openaiModels: ModelCatalog = {
  production: {
    "gpt-4o": {
      id: "gpt-4o",
      developer: "OpenAI",
      contextWindow: 128000,
      maxOutputTokens: 16384,
      maxFileSize: null,
    },
    "gpt-4o-2024-08-06": {
      id: "gpt-4o-2024-08-06",
      developer: "OpenAI",
      contextWindow: 128000,
      maxOutputTokens: 16384,
      maxFileSize: null,
    },
    "gpt-4o-2024-11-20": {
      id: "gpt-4o-2024-11-20",
      developer: "OpenAI",
      contextWindow: 128000,
      maxOutputTokens: 16384,
      maxFileSize: null,
    },
    "gpt-4o-2024-05-13": {
      id: "gpt-4o-2024-05-13",
      developer: "OpenAI",
      contextWindow: 128000,
      maxOutputTokens: 4096,
      maxFileSize: null,
    },
    "gpt-4o-mini": {
      id: "gpt-4o-mini",
      developer: "OpenAI",
      contextWindow: 128000,
      maxOutputTokens: 16384,
      maxFileSize: null,
    },
    "gpt-4o-mini-2024-07-18": {
      id: "gpt-4o-mini-2024-07-18",
      developer: "OpenAI",
      contextWindow: 128000,
      maxOutputTokens: 16384,
      maxFileSize: null,
    },
    o1: {
      id: "o1",
      developer: "OpenAI",
      contextWindow: 200000,
      maxOutputTokens: 100000,
      maxFileSize: null,
    },
    "o1-2024-12-17": {
      id: "o1-2024-12-17",
      developer: "OpenAI",
      contextWindow: 200000,
      maxOutputTokens: 100000,
      maxFileSize: null,
    },
    "o1-mini": {
      id: "o1-mini",
      developer: "OpenAI",
      contextWindow: 128000,
      maxOutputTokens: 65536,
      maxFileSize: null,
    },
    "o1-mini-2024-09-12": {
      id: "o1-mini-2024-09-12",
      developer: "OpenAI",
      contextWindow: 128000,
      maxOutputTokens: 65536,
      maxFileSize: null,
    },
    "gpt-4-turbo": {
      id: "gpt-4-turbo",
      developer: "OpenAI",
      contextWindow: 128000,
      maxOutputTokens: 4096,
      maxFileSize: null,
    },
    "gpt-4-turbo-2024-04-09": {
      id: "gpt-4-turbo-2024-04-09",
      developer: "OpenAI",
      contextWindow: 128000,
      maxOutputTokens: 4096,
      maxFileSize: null,
    },
    "gpt-4": {
      id: "gpt-4",
      developer: "OpenAI",
      contextWindow: 8192,
      maxOutputTokens: 8192,
      maxFileSize: null,
    },
    "gpt-4-0613": {
      id: "gpt-4-0613",
      developer: "OpenAI",
      contextWindow: 8192,
      maxOutputTokens: 8192,
      maxFileSize: null,
    },
    "gpt-4-0314": {
      id: "gpt-4-0314",
      developer: "OpenAI",
      contextWindow: 8192,
      maxOutputTokens: 8192,
      maxFileSize: null,
    },
    "gpt-3.5-turbo": {
      id: "gpt-3.5-turbo",
      developer: "OpenAI",
      contextWindow: 16385,
      maxOutputTokens: 4096,
      maxFileSize: null,
    },
    "gpt-3.5-turbo-0125": {
      id: "gpt-3.5-turbo-0125",
      developer: "OpenAI",
      contextWindow: 16385,
      maxOutputTokens: 4096,
      maxFileSize: null,
    },
    "gpt-3.5-turbo-1106": {
      id: "gpt-3.5-turbo-1106",
      developer: "OpenAI",
      contextWindow: 16385,
      maxOutputTokens: 4096,
      maxFileSize: null,
    },
    "gpt-3.5-turbo-instruct": {
      id: "gpt-3.5-turbo-instruct",
      developer: "OpenAI",
      contextWindow: 4096,
      maxOutputTokens: 4096,
      maxFileSize: null,
    },
  },
  preview: {
    "o1-preview": {
      id: "o1-preview",
      developer: "OpenAI",
      contextWindow: 128000,
      maxOutputTokens: 32768,
      maxFileSize: null,
      isPreview: true,
    },
    "o1-preview-2024-09-12": {
      id: "o1-preview-2024-09-12",
      developer: "OpenAI",
      contextWindow: 128000,
      maxOutputTokens: 32768,
      maxFileSize: null,
      isPreview: true,
    },
    "gpt-4o-realtime-preview": {
      id: "gpt-4o-realtime-preview",
      developer: "OpenAI",
      contextWindow: 128000,
      maxOutputTokens: 4096,
      maxFileSize: null,
      isPreview: true,
    },
    "gpt-4o-realtime-preview-2024-12-17": {
      id: "gpt-4o-realtime-preview-2024-12-17",
      developer: "OpenAI",
      contextWindow: 128000,
      maxOutputTokens: 4096,
      maxFileSize: null,
      isPreview: true,
    },
    "gpt-4o-realtime-preview-2024-10-01": {
      id: "gpt-4o-realtime-preview-2024-10-01",
      developer: "OpenAI",
      contextWindow: 128000,
      maxOutputTokens: 4096,
      maxFileSize: null,
      isPreview: true,
    },
    "gpt-4o-mini-realtime-preview": {
      id: "gpt-4o-mini-realtime-preview",
      developer: "OpenAI",
      contextWindow: 128000,
      maxOutputTokens: 4096,
      maxFileSize: null,
      isPreview: true,
    },
    "gpt-4o-mini-realtime-preview-2024-12-17": {
      id: "gpt-4o-mini-realtime-preview-2024-12-17",
      developer: "OpenAI",
      contextWindow: 128000,
      maxOutputTokens: 4096,
      maxFileSize: null,
      isPreview: true,
    },
    "gpt-4o-audio-preview": {
      id: "gpt-4o-audio-preview",
      developer: "OpenAI",
      contextWindow: 128000,
      maxOutputTokens: 16384,
      maxFileSize: null,
      isPreview: true,
    },
    "gpt-4o-audio-preview-2024-12-17": {
      id: "gpt-4o-audio-preview-2024-12-17",
      developer: "OpenAI",
      contextWindow: 128000,
      maxOutputTokens: 16384,
      maxFileSize: null,
      isPreview: true,
    },
    "gpt-4o-audio-preview-2024-10-01": {
      id: "gpt-4o-audio-preview-2024-10-01",
      developer: "OpenAI",
      contextWindow: 128000,
      maxOutputTokens: 16384,
      maxFileSize: null,
      isPreview: true,
    },
    "gpt-4-turbo-preview": {
      id: "gpt-4-turbo-preview",
      developer: "OpenAI",
      contextWindow: 128000,
      maxOutputTokens: 4096,
      maxFileSize: null,
      isPreview: true,
    },
    "gpt-4-0125-preview": {
      id: "gpt-4-0125-preview",
      developer: "OpenAI",
      contextWindow: 128000,
      maxOutputTokens: 4096,
      maxFileSize: null,
      isPreview: true,
    },
    "gpt-4-1106-preview": {
      id: "gpt-4-1106-preview",
      developer: "OpenAI",
      contextWindow: 128000,
      maxOutputTokens: 4096,
      maxFileSize: null,
      isPreview: true,
    },
  },
};

export function isOpenAIModel(modelId: string): boolean {
  return modelId in openaiModels.production || modelId in openaiModels.preview;
}

export function getOpenAIModel(modelId: string) {
  return openaiModels.production[modelId] || openaiModels.preview[modelId];
}

export function getDefaultOpenAIModel(): string {
  return "gpt-4o";
}

export const getAllOpenAIModels = () => {
  return { ...openaiModels.production, ...openaiModels.preview };
};

export const DEFAULT_MAX_TOKENS = 4096;

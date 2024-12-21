import { ModelCatalog } from "./types";

export const groqModels: ModelCatalog = {
  production: {
    "distil-whisper-large-v3-en": {
      id: "distil-whisper-large-v3-en",
      developer: "HuggingFace",
      contextWindow: null,
      maxOutputTokens: null,
      maxFileSize: "25MB",
      modelCardUrl: "https://huggingface.co/distil-whisper-large-v3",
    },
    "gemma2-9b-it": {
      id: "gemma2-9b-it",
      developer: "Google",
      contextWindow: 8192,
      maxOutputTokens: null,
      maxFileSize: null,
      modelCardUrl: "https://huggingface.co/google/gemma-2b",
    },
    "llama-3.3-70b-versatile": {
      id: "llama-3.3-70b-versatile",
      developer: "Meta",
      contextWindow: 128000,
      maxOutputTokens: 32768,
      maxFileSize: null,
      modelCardUrl: "https://huggingface.co/meta-llama/Llama-3",
    },
    "llama-3.1-8b-instant": {
      id: "llama-3.1-8b-instant",
      developer: "Meta",
      contextWindow: 128000,
      maxOutputTokens: 8192,
      maxFileSize: null,
      modelCardUrl: "https://huggingface.co/meta-llama/Llama-3",
    },
    "llama-guard-3-8b": {
      id: "llama-guard-3-8b",
      developer: "Meta",
      contextWindow: 8192,
      maxOutputTokens: null,
      maxFileSize: null,
      modelCardUrl: "https://huggingface.co/meta-llama/Llama-Guard-3",
    },
    "llama3-70b-8192": {
      id: "llama3-70b-8192",
      developer: "Meta",
      contextWindow: 8192,
      maxOutputTokens: null,
      maxFileSize: null,
      modelCardUrl: "https://huggingface.co/meta-llama/Llama-3",
    },
    "llama3-8b-8192": {
      id: "llama3-8b-8192",
      developer: "Meta",
      contextWindow: 8192,
      maxOutputTokens: null,
      maxFileSize: null,
      modelCardUrl: "https://huggingface.co/meta-llama/Llama-3",
    },
    "mixtral-8x7b-32768": {
      id: "mixtral-8x7b-32768",
      developer: "Mistral",
      contextWindow: 32768,
      maxOutputTokens: null,
      maxFileSize: null,
      modelCardUrl: "https://huggingface.co/mistralai/Mixtral-8x7B-v0.1",
    },
    "whisper-large-v3": {
      id: "whisper-large-v3",
      developer: "OpenAI",
      contextWindow: null,
      maxOutputTokens: null,
      maxFileSize: "25MB",
      modelCardUrl: "https://platform.openai.com/docs/models/whisper",
    },
    "whisper-large-v3-turbo": {
      id: "whisper-large-v3-turbo",
      developer: "OpenAI",
      contextWindow: null,
      maxOutputTokens: null,
      maxFileSize: "25MB",
      modelCardUrl: "https://platform.openai.com/docs/models/whisper",
    },
  },
  preview: {
    "llama3-groq-70b-8192-tool-use-preview": {
      id: "llama3-groq-70b-8192-tool-use-preview",
      developer: "Groq",
      contextWindow: 8192,
      maxOutputTokens: null,
      maxFileSize: null,
      modelCardUrl: "https://huggingface.co/meta-llama/Llama-3",
      isPreview: true,
    },
    "llama3-groq-8b-8192-tool-use-preview": {
      id: "llama3-groq-8b-8192-tool-use-preview",
      developer: "Groq",
      contextWindow: 8192,
      maxOutputTokens: null,
      maxFileSize: null,
      modelCardUrl: "https://huggingface.co/meta-llama/Llama-3",
      isPreview: true,
    },
    "llama-3.3-70b-specdec": {
      id: "llama-3.3-70b-specdec",
      developer: "Meta",
      contextWindow: 8192,
      maxOutputTokens: null,
      maxFileSize: null,
      modelCardUrl: "https://huggingface.co/meta-llama/Llama-3",
      isPreview: true,
    },
    "llama-3.1-70b-specdec": {
      id: "llama-3.1-70b-specdec",
      developer: "Meta",
      contextWindow: null,
      maxOutputTokens: 8192,
      maxFileSize: null,
      modelCardUrl: "https://huggingface.co/meta-llama/Llama-3",
      isPreview: true,
    },
    "llama-3.2-1b-preview": {
      id: "llama-3.2-1b-preview",
      developer: "Meta",
      contextWindow: 128000,
      maxOutputTokens: 8192,
      maxFileSize: null,
      modelCardUrl: "https://huggingface.co/meta-llama/Llama-3",
      isPreview: true,
    },
    "llama-3.2-3b-preview": {
      id: "llama-3.2-3b-preview",
      developer: "Meta",
      contextWindow: 128000,
      maxOutputTokens: 8192,
      maxFileSize: null,
      modelCardUrl: "https://huggingface.co/meta-llama/Llama-3",
      isPreview: true,
    },
    "llama-3.2-11b-vision-preview": {
      id: "llama-3.2-11b-vision-preview",
      developer: "Meta",
      contextWindow: 128000,
      maxOutputTokens: 8192,
      maxFileSize: null,
      modelCardUrl: "https://huggingface.co/meta-llama/Llama-3",
      isPreview: true,
    },
    "llama-3.2-90b-vision-preview": {
      id: "llama-3.2-90b-vision-preview",
      developer: "Meta",
      contextWindow: 128000,
      maxOutputTokens: 8192,
      maxFileSize: null,
      modelCardUrl: "https://huggingface.co/meta-llama/Llama-3",
      isPreview: true,
    },
  },
};

export function isGroqModel(modelId: string): boolean {
  return modelId in groqModels.production || modelId in groqModels.preview;
}

export function getGroqModel(modelId: string) {
  return groqModels.production[modelId] || groqModels.preview[modelId];
}

export function getDefaultGroqModel(): string {
  return "llama-3.1-8b-instant";
}

export const DEFAULT_MAX_TOKENS = 4096;

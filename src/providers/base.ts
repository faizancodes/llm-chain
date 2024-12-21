import axios, { AxiosInstance } from "axios";
import {
  ChatCompletionOptions,
  ChatCompletionResponse,
  LLMProvider,
} from "../types";

export abstract class BaseLLMProvider implements LLMProvider {
  protected client: AxiosInstance;
  protected apiKey: string;

  constructor(apiKey: string, baseURL: string) {
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    });
  }

  abstract chatCompletion(
    options: ChatCompletionOptions
  ): Promise<ChatCompletionResponse>;

  abstract streamChatCompletion(
    options: ChatCompletionOptions,
    onMessage: (message: string) => void
  ): Promise<void>;

  protected handleError(error: unknown): never {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `API request failed: ${error.response?.data?.error?.message || error.message}`
      );
    }
    throw error;
  }
}

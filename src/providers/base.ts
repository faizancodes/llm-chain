import axios, { AxiosInstance } from "axios";
import {
  ChatCompletionOptions,
  ChatCompletionResponse,
  LLMProvider,
  TimingInfo,
} from "../types";
import { measureResponseTime, StreamingMetrics } from "../utils/timing";

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
  ): Promise<ChatCompletionResponse & { timing?: TimingInfo }>;

  abstract streamChatCompletion(
    options: ChatCompletionOptions,
    onMessage: (message: string) => void,
    onTiming?: (timing: TimingInfo & { streaming?: StreamingMetrics }) => void
  ): Promise<void>;

  protected async measureApiCall<T>(
    apiCall: () => Promise<T>
  ): Promise<T & { timing?: TimingInfo }> {
    const { timing, result } = await measureResponseTime(apiCall);
    return { ...result, timing };
  }

  protected handleError(error: unknown): never {
    if (axios.isAxiosError(error)) {
      const timingError = error as Error & { timing?: TimingInfo };
      const errorObj = new Error(
        `API request failed: ${error.response?.data?.error?.message || error.message}`
      );
      Object.assign(errorObj, { timing: timingError.timing });
      throw errorObj;
    }
    throw error;
  }
}

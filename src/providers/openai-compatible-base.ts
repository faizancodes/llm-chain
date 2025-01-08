import { BaseLLMProvider } from "./base";
import {
  ChatCompletionOptions,
  ChatCompletionResponse,
  Message,
  TimingInfo,
} from "../types";
import {
  measureResponseTime,
  createStreamMetricsCollector,
  StreamingMetrics,
} from "../utils/timing";

export interface ProviderConfig {
  baseURL: string;
  validateModel: (model: string) => void;
  validateMaxTokens?: (model: string, maxTokens?: number) => number;
  validateTemperature?: (temperature?: number) => number;
  validateMessages?: (
    messages: Message[],
    options: ChatCompletionOptions
  ) => void;
  validateOptions?: (options: ChatCompletionOptions) => void;
  formatResponse?: (data: any) => Partial<ChatCompletionResponse>;
}

interface OpenAICompatibleMessage {
  role: string;
  content: string;
}

interface OpenAICompatibleResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: OpenAICompatibleMessage;
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export abstract class OpenAICompatibleProvider extends BaseLLMProvider {
  protected config: ProviderConfig;

  constructor(apiKey: string, config: ProviderConfig) {
    super(apiKey, config.baseURL);
    this.config = config;
  }

  async chatCompletion(
    options: ChatCompletionOptions
  ): Promise<ChatCompletionResponse & { timing?: TimingInfo }> {
    try {
      this.config.validateModel(options.model);
      this.config.validateMessages?.(options.messages, options);
      this.config.validateOptions?.(options);

      const maxTokens = this.config.validateMaxTokens?.(
        options.model,
        options.maxTokens
      );
      const temperature = this.config.validateTemperature?.(
        options.temperature
      );

      return await this.measureApiCall(async () => {
        const response = await this.client.post<OpenAICompatibleResponse>(
          "/chat/completions",
          {
            model: options.model,
            messages: options.messages,
            temperature: temperature ?? options.temperature,
            max_tokens: maxTokens ?? options.maxTokens,
            stop: options.stop,
            stream: false,
          }
        );

        const { data } = response;
        const message = data.choices[0].message;

        const baseResponse = {
          id: data.id,
          model: data.model,
          message: {
            role: message.role as Message["role"],
            content: message.content,
          },
          usage: {
            promptTokens: data.usage.prompt_tokens,
            completionTokens: data.usage.completion_tokens,
            totalTokens: data.usage.total_tokens,
          },
        };

        return {
          ...baseResponse,
          ...this.config.formatResponse?.(data),
        };
      });
    } catch (error) {
      return this.handleError(error);
    }
  }

  async streamChatCompletion(
    options: ChatCompletionOptions,
    onMessage: (message: string) => void,
    onTiming?: (timing: TimingInfo & { streaming?: StreamingMetrics }) => void
  ): Promise<void> {
    const metricsCollector = createStreamMetricsCollector();

    try {
      this.config.validateModel(options.model);
      this.config.validateMessages?.(options.messages, options);
      this.config.validateOptions?.(options);

      const maxTokens = this.config.validateMaxTokens?.(
        options.model,
        options.maxTokens
      );
      const temperature = this.config.validateTemperature?.(
        options.temperature
      );

      const { timing, result: stream } = await measureResponseTime(async () => {
        const response = await this.client.post(
          "/chat/completions",
          {
            model: options.model,
            messages: options.messages,
            temperature: temperature ?? options.temperature,
            max_tokens: maxTokens ?? options.maxTokens,
            stop: options.stop,
            stream: true,
          },
          {
            responseType: "stream",
          }
        );
        return response.data;
      });

      let buffer = "";
      let isFirstToken = true;

      return new Promise((resolve, reject) => {
        stream.on("data", (chunk: Buffer) => {
          const lines = chunk
            .toString()
            .split("\n")
            .filter((line: string) => line.trim() !== "");

          for (const line of lines) {
            if (line.includes("[DONE]")) return;

            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));
                const content = data.choices[0]?.delta?.content;
                if (content) {
                  if (isFirstToken) {
                    metricsCollector.markFirstToken();
                    isFirstToken = false;
                  }
                  buffer += content;
                  metricsCollector.addTokens(1);
                  onMessage(content);
                }
              } catch (e) {
                // Ignore parse errors for incomplete chunks
              }
            }
          }
        });

        stream.on("end", () => {
          if (onTiming) {
            onTiming({
              ...timing,
              streaming: metricsCollector.getMetrics(),
            });
          }
          resolve();
        });

        stream.on("error", (error: Error) => {
          if (onTiming) {
            onTiming({
              ...timing,
              streaming: metricsCollector.getMetrics(),
            });
          }
          reject(error);
        });
      });
    } catch (error) {
      // Ensure metrics are returned even on early failures
      if (onTiming) {
        onTiming({
          startTime: performance.now(),
          endTime: performance.now(),
          duration: 0,
          streaming: metricsCollector.getMetrics(),
        });
      }
      this.handleError(error);
    }
  }
}

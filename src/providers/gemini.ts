import { BaseLLMProvider } from "./base";
import {
  ChatCompletionOptions,
  ChatCompletionResponse,
  Message,
  TimingInfo,
} from "../types";
import {
  getGeminiModel,
  isGeminiModel,
  isExperimentalModel,
  getMaxInputTokens,
  getMaxOutputTokens,
} from "../models/gemini";
import {
  estimateTokensForMessages,
  formatTokenCount,
} from "../utils/token-counter";
import {
  measureResponseTime,
  createStreamMetricsCollector,
  StreamingMetrics,
} from "../utils/timing";

interface GeminiMessage {
  role: string;
  content: string;
}

interface GeminiResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: GeminiMessage;
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class GeminiProvider extends BaseLLMProvider {
  constructor(apiKey: string) {
    super(apiKey, "https://generativelanguage.googleapis.com/v1beta/openai");
  }

  private validateModel(model: string): void {
    if (!isGeminiModel(model)) {
      throw new Error(
        `Invalid Gemini model: ${model}. Available models: ${Object.keys(
          getGeminiModel(model) || {}
        ).join(", ")}`
      );
    }

    if (isExperimentalModel(model)) {
      console.warn(
        `Warning: ${model} is an experimental model and may be unstable or change without notice.`
      );
    }
  }

  private validateMaxTokens(model: string, maxTokens?: number): number {
    const limit = getMaxOutputTokens(model);
    if (maxTokens && maxTokens > limit) {
      throw new Error(
        `Max tokens ${maxTokens} exceeds model output limit of ${limit} for ${model}`
      );
    }

    return maxTokens || limit;
  }

  private validateInputTokens(model: string, messages: Message[]): void {
    const estimatedTokens = estimateTokensForMessages(messages, {
      countSystemMessage: true,
      countRoles: true,
    });
    const limit = getMaxInputTokens(model);

    if (estimatedTokens > limit) {
      throw new Error(
        `Estimated input size of ${formatTokenCount(estimatedTokens)} exceeds ` +
          `model limit of ${formatTokenCount(limit)} for ${model}`
      );
    }
  }

  private validateTemperature(temperature?: number): number {
    if (temperature === undefined) return 1;
    if (temperature < 0 || temperature > 2) {
      throw new Error("Temperature must be between 0 and 2");
    }
    return temperature;
  }

  async chatCompletion(
    options: ChatCompletionOptions
  ): Promise<ChatCompletionResponse & { timing?: TimingInfo }> {
    try {
      this.validateModel(options.model);
      this.validateInputTokens(options.model, options.messages);
      const maxTokens = this.validateMaxTokens(
        options.model,
        options.maxTokens
      );
      const temperature = this.validateTemperature(options.temperature);

      return await this.measureApiCall(async () => {
        const response = await this.client.post<GeminiResponse>(
          "/chat/completions",
          {
            model: options.model,
            messages: options.messages,
            temperature,
            max_tokens: maxTokens,
            stop: options.stop,
            stream: false,
          }
        );

        const { data } = response;
        const message = data.choices[0].message;

        return {
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
      this.validateModel(options.model);
      this.validateInputTokens(options.model, options.messages);
      const maxTokens = this.validateMaxTokens(
        options.model,
        options.maxTokens
      );
      const temperature = this.validateTemperature(options.temperature);

      const { timing, result: stream } = await measureResponseTime(async () => {
        const response = await this.client.post(
          "/chat/completions",
          {
            model: options.model,
            messages: options.messages,
            temperature,
            max_tokens: maxTokens,
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

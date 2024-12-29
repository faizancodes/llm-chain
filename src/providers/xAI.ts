import { BaseLLMProvider } from "./base";
import {
  ChatCompletionOptions,
  ChatCompletionResponse,
  Message,
  TimingInfo,
} from "../types";
import {
  XAIResponse,
  XAIModelType,
  validateModel,
  validateModelCapability,
} from "../models/xAI";
import {
  measureResponseTime,
  createStreamMetricsCollector,
  StreamingMetrics,
} from "../utils/timing";

export class XAIProvider extends BaseLLMProvider {
  constructor(apiKey: string) {
    super(apiKey, "https://api.x.ai/v1");
  }

  async chatCompletion(
    options: ChatCompletionOptions
  ): Promise<ChatCompletionResponse & { timing?: TimingInfo }> {
    try {
      // Validate model and capabilities
      validateModel(options.model);
      validateModelCapability(options.model, XAIModelType.TEXT);

      return await this.measureApiCall(async () => {
        const response = await this.client.post<XAIResponse>(
          "/chat/completions",
          {
            model: options.model,
            messages: options.messages,
            temperature: options.temperature,
            max_tokens: options.maxTokens,
            stop: options.stop,
            stream: options.stream,
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
      // Validate model and capabilities
      validateModel(options.model);
      validateModelCapability(options.model, XAIModelType.TEXT);

      const { timing, result: stream } = await measureResponseTime(async () => {
        const response = await this.client.post(
          "/chat/completions",
          {
            model: options.model,
            messages: options.messages,
            temperature: options.temperature,
            max_tokens: options.maxTokens,
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

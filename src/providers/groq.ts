import { BaseLLMProvider } from "./base";
import {
  ChatCompletionOptions,
  ChatCompletionResponse,
  Message,
} from "../types";
import { getGroqModel, isGroqModel, DEFAULT_MAX_TOKENS } from "../models/groq";

interface GroqMessage {
  role: string;
  content: string;
}

interface GroqResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  system_fingerprint: string;
  choices: Array<{
    index: number;
    message: GroqMessage;
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    prompt_time: number;
    completion_time: number;
    total_time: number;
  };
}

export class GroqProvider extends BaseLLMProvider {
  constructor(apiKey: string) {
    super(apiKey, "https://api.groq.com/openai/v1");
  }

  private validateModel(model: string): void {
    if (!isGroqModel(model)) {
      throw new Error(
        `Invalid Groq model: ${model}. Available models: ${Object.keys(
          getGroqModel(model) || {}
        ).join(", ")}`
      );
    }
  }

  private validateMaxTokens(model: string, maxTokens?: number): number {
    const modelInfo = getGroqModel(model);
    if (!modelInfo) {
      return DEFAULT_MAX_TOKENS;
    }

    const limit = modelInfo.maxOutputTokens || DEFAULT_MAX_TOKENS;
    if (maxTokens && maxTokens > limit) {
      throw new Error(
        `Max tokens ${maxTokens} exceeds model limit of ${limit} for ${model}`
      );
    }

    return maxTokens || limit;
  }

  private validateTemperature(temperature?: number): number {
    if (temperature === undefined) return 1;
    if (temperature < 0 || temperature > 2) {
      throw new Error("Temperature must be between 0 and 2");
    }
    // Convert 0 to smallest positive float32 as per Groq docs
    return temperature === 0 ? 1e-8 : temperature;
  }

  private validateMessages(messages: Message[]): void {
    for (const message of messages) {
      if ("name" in message) {
        throw new Error("Message name field is not supported by Groq");
      }
    }
  }

  private validateOptions(options: ChatCompletionOptions): void {
    if (options.logprobs || options.logit_bias || options.top_logprobs) {
      throw new Error(
        "logprobs, logit_bias, and top_logprobs are not supported by Groq"
      );
    }
  }

  async chatCompletion(
    options: ChatCompletionOptions
  ): Promise<ChatCompletionResponse> {
    try {
      this.validateModel(options.model);
      this.validateMessages(options.messages);
      this.validateOptions(options);
      const maxTokens = this.validateMaxTokens(
        options.model,
        options.maxTokens
      );
      const temperature = this.validateTemperature(options.temperature);

      const response = await this.client.post<GroqResponse>(
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
    } catch (error) {
      return this.handleError(error);
    }
  }

  async streamChatCompletion(
    options: ChatCompletionOptions,
    onMessage: (message: string) => void
  ): Promise<void> {
    try {
      this.validateModel(options.model);
      this.validateMessages(options.messages);
      this.validateOptions(options);
      const maxTokens = this.validateMaxTokens(
        options.model,
        options.maxTokens
      );
      const temperature = this.validateTemperature(options.temperature);

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

      const stream = response.data;
      let buffer = "";

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
                buffer += content;
                onMessage(content);
              }
            } catch (e) {
              // Ignore parse errors for incomplete chunks
            }
          }
        }
      });

      return new Promise((resolve, reject) => {
        stream.on("end", () => resolve());
        stream.on("error", (error: Error) => reject(error));
      });
    } catch (error) {
      this.handleError(error);
    }
  }
}

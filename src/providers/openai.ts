import { BaseLLMProvider } from "./base";
import {
  ChatCompletionOptions,
  ChatCompletionResponse,
  Message,
} from "../types";

interface OpenAIMessage {
  role: string;
  content: string;
}

interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: OpenAIMessage;
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class OpenAIProvider extends BaseLLMProvider {
  constructor(apiKey: string) {
    super(apiKey, "https://api.openai.com/v1");
  }

  async chatCompletion(
    options: ChatCompletionOptions
  ): Promise<ChatCompletionResponse> {
    try {
      const response = await this.client.post<OpenAIResponse>(
        "/chat/completions",
        {
          model: options.model,
          messages: options.messages,
          temperature: options.temperature,
          max_tokens: options.maxTokens,
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

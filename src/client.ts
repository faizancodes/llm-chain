import {
  ChatCompletionOptions,
  ChatCompletionResponse,
  LLMProvider,
  TimingInfo,
} from "./types";
import { OpenAIProvider } from "./providers/openai";
import { GroqProvider } from "./providers/groq";
import { GeminiProvider } from "./providers/gemini";
import { AnthropicProvider } from "./providers/anthropic";
import { getDefaultGroqModel } from "./models/groq";
import { getDefaultGeminiModel } from "./models/gemini";
import { getDefaultAnthropicModel } from "./models/anthropic";
import { DeepSeekProvider } from "./providers/deepseek";
import { XAIProvider } from "./providers/xAI";
import { measureResponseTime, StreamingMetrics } from "./utils/timing";

export class LLMClient {
  private provider: LLMProvider;
  private defaultModel: string;

  constructor(provider: LLMProvider, defaultModel: string) {
    this.provider = provider;
    this.defaultModel = defaultModel;
  }

  static createOpenAI(apiKey: string): LLMClient {
    return new LLMClient(new OpenAIProvider(apiKey), "gpt-4o-mini");
  }

  static createGroq(apiKey: string): LLMClient {
    return new LLMClient(new GroqProvider(apiKey), getDefaultGroqModel());
  }

  static createGemini(apiKey: string): LLMClient {
    return new LLMClient(new GeminiProvider(apiKey), getDefaultGeminiModel());
  }

  static createAnthropic(apiKey: string): LLMClient {
    return new LLMClient(
      new AnthropicProvider(apiKey),
      getDefaultAnthropicModel()
    );
  }

  static createDeepSeek(apiKey: string): LLMClient {
    return new LLMClient(new DeepSeekProvider(apiKey), "deepseek-chat");
  }

  static createXAI(apiKey: string): LLMClient {
    return new LLMClient(new XAIProvider(apiKey), "grok-2-latest");
  }

  async chatCompletion(
    options: ChatCompletionOptions
  ): Promise<ChatCompletionResponse> {
    return this.provider.chatCompletion(options);
  }

  async streamChatCompletion(
    options: ChatCompletionOptions,
    onMessage: (message: string) => void,
    onTiming?: (timing: TimingInfo & { streaming?: StreamingMetrics }) => void
  ): Promise<void> {
    return this.provider.streamChatCompletion(options, onMessage, onTiming);
  }

  // Helper method for simple completions
  async complete(
    prompt: string,
    model?: string
  ): Promise<{ content: string; timing: TimingInfo }> {
    const { timing, result } = await measureResponseTime(async () => {
      return this.chatCompletion({
        model: model || this.defaultModel,
        messages: [{ role: "user", content: prompt }],
        temperature: 1,
        stream: false,
      });
    });

    return {
      content: result.message.content,
      timing,
    };
  }
}

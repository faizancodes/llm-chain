import {
  OpenAICompatibleProvider,
  ProviderConfig,
} from "./openai-compatible-base";
import { Message, ChatCompletionOptions } from "../types";
import { getGroqModel, isGroqModel, DEFAULT_MAX_TOKENS } from "../models/groq";

export class GroqProvider extends OpenAICompatibleProvider {
  constructor(apiKey: string) {
    const config: ProviderConfig = {
      baseURL: "https://api.groq.com/openai/v1",
      validateModel: (model: string) => {
        if (!isGroqModel(model)) {
          throw new Error(
            `Invalid Groq model: ${model}\n\nAvailable models:\n${Object.keys(
              getGroqModel(model) || {}
            )
              .map(m => `- ${m}`)
              .join("\n")}`
          );
        }
      },
      validateMaxTokens: (model: string, maxTokens?: number): number => {
        const modelInfo = getGroqModel(model);
        if (!modelInfo) {
          return DEFAULT_MAX_TOKENS;
        }

        const modelLimit = modelInfo.maxOutputTokens || DEFAULT_MAX_TOKENS;

        if (!maxTokens) {
          return Math.min(DEFAULT_MAX_TOKENS, modelLimit);
        }

        if (maxTokens > modelLimit) {
          throw new Error(
            `Max tokens ${maxTokens} exceeds model limit of ${modelLimit} for ${model}`
          );
        }

        return maxTokens;
      },
      validateTemperature: (temperature?: number): number => {
        if (temperature === undefined) return 1;
        if (temperature < 0 || temperature > 2) {
          throw new Error("Temperature must be between 0 and 2");
        }
        // Convert 0 to smallest positive float32 as per Groq docs
        return temperature === 0 ? 1e-8 : temperature;
      },
      validateMessages: (messages: Message[]): void => {
        for (const message of messages) {
          if ("name" in message) {
            throw new Error("Message name field is not supported by Groq");
          }
        }
      },
      validateOptions: (options: ChatCompletionOptions): void => {
        if (options.logprobs || options.logit_bias || options.top_logprobs) {
          throw new Error(
            "logprobs, logit_bias, and top_logprobs are not supported by Groq"
          );
        }
      },
    };
    super(apiKey, config);
  }
}

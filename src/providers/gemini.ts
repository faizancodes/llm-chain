import {
  OpenAICompatibleProvider,
  ProviderConfig,
} from "./openai-compatible-base";
import { Message, ChatCompletionOptions } from "../types";
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

export class GeminiProvider extends OpenAICompatibleProvider {
  constructor(apiKey: string) {
    const config: ProviderConfig = {
      baseURL: "https://generativelanguage.googleapis.com/v1beta/openai",
      validateModel: (model: string) => {
        if (!isGeminiModel(model)) {
          throw new Error(
            `Invalid Gemini model: ${model}\n\nAvailable models:\n${Object.keys(
              getGeminiModel(model) || {}
            )
              .map(m => `- ${m}`)
              .join("\n")}`
          );
        }

        if (isExperimentalModel(model)) {
          console.warn(
            `Warning: ${model} is an experimental model and may be unstable or change without notice.`
          );
        }
      },
      validateMaxTokens: (model: string, maxTokens?: number): number => {
        const limit = getMaxOutputTokens(model);
        if (maxTokens && maxTokens > limit) {
          throw new Error(
            `Max tokens ${maxTokens} exceeds model output limit of ${limit} for ${model}`
          );
        }

        return maxTokens || limit;
      },
      validateMessages: (
        messages: Message[],
        options: ChatCompletionOptions
      ): void => {
        const estimatedTokens = estimateTokensForMessages(messages, {
          countSystemMessage: true,
          countRoles: true,
        });
        const limit = getMaxInputTokens(options.model);

        if (estimatedTokens > limit) {
          throw new Error(
            `Estimated input size of ${formatTokenCount(estimatedTokens)} exceeds ` +
              `model limit of ${formatTokenCount(limit)} for ${options.model}`
          );
        }
      },
      validateTemperature: (temperature?: number): number => {
        if (temperature === undefined) return 1;
        if (temperature < 0 || temperature > 2) {
          throw new Error("Temperature must be between 0 and 2");
        }
        return temperature;
      },
    };
    super(apiKey, config);
  }
}

import {
  OpenAICompatibleProvider,
  ProviderConfig,
} from "./openai-compatible-base";
import { ChatCompletionOptions } from "../types";
import { isOpenAIModel, getAllOpenAIModels } from "../models/openai";

export class OpenAIProvider extends OpenAICompatibleProvider {
  constructor(apiKey: string) {
    const config: ProviderConfig = {
      baseURL: "https://api.openai.com/v1",
      validateModel: (model: string) => {
        if (!isOpenAIModel(model)) {
          throw new Error(
            `Invalid OpenAI model: ${model}\n\nValid models:\n${Object.keys(
              getAllOpenAIModels()
            )
              .map(m => `- ${m}`)
              .join("\n")}`
          );
        }
      },
    };
    super(apiKey, config);
  }
}

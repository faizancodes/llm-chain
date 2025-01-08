import {
  OpenAICompatibleProvider,
  ProviderConfig,
} from "./openai-compatible-base";
import { isDeepseekModel, getAllDeepseekModels } from "../models/deepseek";

export class DeepSeekProvider extends OpenAICompatibleProvider {
  constructor(apiKey: string) {
    const config: ProviderConfig = {
      baseURL: "https://api.deepseek.com",
      validateModel: (model: string) => {
        if (!isDeepseekModel(model)) {
          throw new Error(
            `Invalid DeepSeek model: ${model}\n\nValid models:\n${Object.keys(
              getAllDeepseekModels()
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

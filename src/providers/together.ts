import {
  OpenAICompatibleProvider,
  ProviderConfig,
} from "./openai-compatible-base";
import { isTogetherModel, getAllTogetherModels } from "../models/together";

export class TogetherAIProvider extends OpenAICompatibleProvider {
  constructor(apiKey: string) {
    const config: ProviderConfig = {
      baseURL: "https://api.together.xyz/v1",
      validateModel: (model: string) => {
        if (!isTogetherModel(model)) {
          throw new Error(
            `Invalid Together model: ${model}\n\nValid models:\n${Object.keys(
              getAllTogetherModels()
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

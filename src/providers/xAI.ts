import {
  OpenAICompatibleProvider,
  ProviderConfig,
} from "./openai-compatible-base";
import {
  validateModel,
  validateModelCapability,
  XAIModelType,
} from "../models/xAI";

export class XAIProvider extends OpenAICompatibleProvider {
  constructor(apiKey: string) {
    const config: ProviderConfig = {
      baseURL: "https://api.x.ai/v1",
      validateModel: (model: string) => {
        validateModel(model);
        validateModelCapability(model, XAIModelType.TEXT);
      },
    };
    super(apiKey, config);
  }
}

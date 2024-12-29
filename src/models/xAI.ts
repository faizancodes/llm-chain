export class XAIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "XAIError";
  }
}

export class XAIModelError extends XAIError {
  constructor(model: string) {
    super(
      `Unsupported model: ${model}. Available models: ${Object.values(XAIModel).join(", ")}`
    );
    this.name = "XAIModelError";
  }
}

export class XAICapabilityError extends XAIError {
  constructor(model: string, capability: string) {
    super(`Model ${model} does not support ${capability}`);
    this.name = "XAICapabilityError";
  }
}

export enum XAIModelType {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
}

export enum XAIModel {
  GROK_BETA = "grok-beta",
  GROK_VISION_BETA = "grok-vision-beta",
  GROK_2_VISION_1212 = "grok-2-vision-1212",
  GROK_2_1212 = "grok-2-1212",
  GROK_2 = "grok-2",
  GROK_2_LATEST = "grok-2-latest",
}

export interface XAIModelCapabilities {
  input: XAIModelType[];
  output: XAIModelType;
  context: number;
  textPrice: number;
  imagePrice: number | null;
  completionPrice: number;
  rps: number;
  rph: number;
}

export const XAI_MODEL_CAPABILITIES: Record<XAIModel, XAIModelCapabilities> = {
  [XAIModel.GROK_BETA]: {
    input: [XAIModelType.TEXT],
    output: XAIModelType.TEXT,
    context: 131072,
    textPrice: 5.0,
    imagePrice: null,
    completionPrice: 15.0,
    rps: 1,
    rph: 1200,
  },
  [XAIModel.GROK_VISION_BETA]: {
    input: [XAIModelType.TEXT, XAIModelType.IMAGE],
    output: XAIModelType.TEXT,
    context: 8192,
    textPrice: 5.0,
    imagePrice: 5.0,
    completionPrice: 15.0,
    rps: 1,
    rph: 60,
  },
  [XAIModel.GROK_2_VISION_1212]: {
    input: [XAIModelType.TEXT, XAIModelType.IMAGE],
    output: XAIModelType.TEXT,
    context: 32768,
    textPrice: 2.0,
    imagePrice: 2.0,
    completionPrice: 10.0,
    rps: 1,
    rph: 60,
  },
  [XAIModel.GROK_2_1212]: {
    input: [XAIModelType.TEXT],
    output: XAIModelType.TEXT,
    context: 131072,
    textPrice: 2.0,
    imagePrice: null,
    completionPrice: 10.0,
    rps: 1,
    rph: 1200,
  },
  [XAIModel.GROK_2]: {
    input: [XAIModelType.TEXT],
    output: XAIModelType.TEXT,
    context: 131072,
    textPrice: 2.0,
    imagePrice: null,
    completionPrice: 10.0,
    rps: 1,
    rph: 1200,
  },
  [XAIModel.GROK_2_LATEST]: {
    input: [XAIModelType.TEXT],
    output: XAIModelType.TEXT,
    context: 131072,
    textPrice: 2.0,
    imagePrice: null,
    completionPrice: 10.0,
    rps: 1,
    rph: 1200,
  },
};

export function validateModel(model: string): asserts model is XAIModel {
  if (!isModelSupported(model)) {
    throw new XAIModelError(model);
  }
}

export function validateModelCapability(
  model: string,
  capability: XAIModelType
): void {
  validateModel(model);
  const modelCapabilities = XAI_MODEL_CAPABILITIES[model as XAIModel];

  if (!modelCapabilities.input.includes(capability)) {
    throw new XAICapabilityError(model, capability);
  }
}

export function getModelContext(model: string): number {
  validateModel(model);
  return XAI_MODEL_CAPABILITIES[model as XAIModel].context;
}

export function isModelSupported(model: string): model is XAIModel {
  return Object.values(XAIModel).includes(model as XAIModel);
}

export interface XAIMessage {
  role: string;
  content: string;
}

export interface XAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: XAIMessage;
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

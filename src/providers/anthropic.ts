import Anthropic from "@anthropic-ai/sdk";
import AnthropicBedrock from "@anthropic-ai/bedrock-sdk";
import { AnthropicVertex } from "@anthropic-ai/vertex-sdk";
import { BaseLLMProvider } from "./base";
import {
  ChatCompletionOptions,
  ChatCompletionResponse,
  Message,
} from "../types";
import {
  getAnthropicModel,
  isAnthropicModel,
  isExperimentalModel,
  getMaxInputTokens,
  getMaxOutputTokens,
} from "../models/anthropic";
import {
  estimateTokensForMessages,
  formatTokenCount,
} from "../utils/token-counter";

// Define provider types
type ProviderType = "direct" | "bedrock" | "vertex";

// Define types based on API docs
type AnthropicRole = "user" | "assistant";

interface ContentBlock {
  type: "text";
  text: string;
}

interface AnthropicMessageRequest {
  role: AnthropicRole;
  content: ContentBlock[];
}

interface BedrockConfig {
  aws_access_key?: string;
  aws_secret_key?: string;
  aws_session_token?: string;
  aws_region?: string;
}

interface VertexConfig {
  project_id?: string;
  region?: string;
}

// Add new interfaces for streaming events
interface StreamMessage {
  type: "message_start" | "message_stop" | "message_delta" | "message";
  message?: {
    id: string;
    type: "message";
    role: AnthropicRole;
    content: ContentBlock[];
    model: string;
    stop_reason: string | null;
    stop_sequence: string | null;
    usage?: {
      input_tokens: number;
      output_tokens: number;
    };
  };
  delta?: {
    stop_reason?: string;
    stop_sequence?: string | null;
  };
  usage?: {
    output_tokens: number;
  };
}

export class AnthropicProvider extends BaseLLMProvider {
  private anthropic: Anthropic | AnthropicBedrock | AnthropicVertex;
  private providerType: ProviderType;

  constructor(
    apiKey: string,
    providerType: ProviderType = "direct",
    bedrockConfig?: BedrockConfig,
    vertexConfig?: VertexConfig
  ) {
    super(apiKey, ""); // Base URL not needed since we're using SDK
    this.providerType = providerType;

    switch (providerType) {
      case "bedrock":
        if (!bedrockConfig)
          throw new Error("Bedrock config required for Bedrock provider");
        this.anthropic = new AnthropicBedrock({
          awsAccessKey: bedrockConfig.aws_access_key,
          awsSecretKey: bedrockConfig.aws_secret_key,
          awsSessionToken: bedrockConfig.aws_session_token,
          awsRegion: bedrockConfig.aws_region || "us-east-1",
        });
        break;
      case "vertex":
        if (!vertexConfig)
          throw new Error("Vertex config required for Vertex provider");
        this.anthropic = new AnthropicVertex({
          projectId: vertexConfig.project_id,
          region: vertexConfig.region || "us-central1",
        });
        break;
      default:
        this.anthropic = new Anthropic({ apiKey });
    }
  }

  private validateModel(model: string): void {
    // Each provider has its own model naming convention
    const modelPrefix =
      this.providerType === "bedrock"
        ? "anthropic."
        : this.providerType === "vertex"
          ? ""
          : "";

    const modelSuffix =
      this.providerType === "bedrock"
        ? "-v2:0"
        : this.providerType === "vertex"
          ? ""
          : "";

    const fullModelName = modelPrefix + model + modelSuffix;

    if (!isAnthropicModel(model)) {
      throw new Error(
        `Invalid Anthropic model for ${this.providerType}: ${fullModelName}. Available models: ${Object.keys(
          getAnthropicModel(model) || {}
        ).join(", ")}`
      );
    }

    if (isExperimentalModel(fullModelName)) {
      console.warn(
        `Warning: ${fullModelName} is an experimental model and may be unstable or change without notice.`
      );
    }
  }

  private validateMaxTokens(model: string, maxTokens?: number): number {
    // Get provider-specific token limits
    const limit =
      this.providerType === "bedrock"
        ? getMaxOutputTokens(model) * 0.9 // Bedrock has slightly lower limits
        : getMaxOutputTokens(model);

    if (!maxTokens || maxTokens < 1) {
      throw new Error("max_tokens must be greater than 1");
    }
    if (maxTokens > limit) {
      throw new Error(
        `Max tokens ${maxTokens} exceeds model output limit of ${limit} for ${model} on ${this.providerType}`
      );
    }

    return maxTokens;
  }

  private validateInputTokens(model: string, messages: Message[]): void {
    const estimatedTokens = estimateTokensForMessages(messages, {
      countSystemMessage: true,
      countRoles: true,
    });

    // Get provider-specific input limits
    const limit =
      this.providerType === "bedrock"
        ? getMaxInputTokens(model) * 0.9 // Bedrock has slightly lower limits
        : getMaxInputTokens(model);

    if (estimatedTokens > limit) {
      throw new Error(
        `Estimated input size of ${formatTokenCount(estimatedTokens)} exceeds ` +
          `model limit of ${formatTokenCount(limit)} for ${model} on ${this.providerType}`
      );
    }

    // Log token usage for debugging
    console.debug(
      `Token usage for ${model} on ${this.providerType}: ${formatTokenCount(estimatedTokens)} / ${formatTokenCount(limit)}`
    );
  }

  private validateTemperature(temperature?: number): number {
    if (temperature === undefined) return 1;
    if (temperature <= 0 || temperature >= 1) {
      throw new Error("Temperature must be between 0 and 1 (exclusive)");
    }
    return temperature;
  }

  private formatMessages(messages: Message[]): {
    messages: AnthropicMessageRequest[];
  } {
    // Format messages for Anthropic API, handling provider-specific requirements
    const formattedMessages: AnthropicMessageRequest[] = messages.map(
      message => {
        if (message.role === "system" && this.providerType !== "vertex") {
          throw new Error(
            "System messages should be passed via the system parameter for direct and Bedrock providers"
          );
        }
        return {
          role: message.role === "assistant" ? "assistant" : "user",
          content: [{ type: "text", text: message.content }],
        };
      }
    );

    return { messages: formattedMessages };
  }

  async chatCompletion(
    options: ChatCompletionOptions
  ): Promise<ChatCompletionResponse> {
    try {
      this.validateModel(options.model);
      this.validateInputTokens(options.model, options.messages);
      const maxTokens = this.validateMaxTokens(
        options.model,
        options.maxTokens
      );
      const temperature = this.validateTemperature(options.temperature);

      const { messages } = this.formatMessages(options.messages);

      // Handle provider-specific API calls
      let response;
      if (this.providerType === "bedrock") {
        response = await (this.anthropic as AnthropicBedrock).messages.create({
          model: `anthropic.${options.model}`,
          messages,
          system: options.system,
          max_tokens: maxTokens,
          temperature,
          stop_sequences: options.stop ? [options.stop].flat() : undefined,
        });
      } else if (this.providerType === "vertex") {
        response = await (this.anthropic as AnthropicVertex).messages.create({
          model: options.model,
          messages,
          system: options.system,
          max_tokens: maxTokens,
          temperature,
          stop_sequences: options.stop ? [options.stop].flat() : undefined,
        });
      } else {
        response = await (this.anthropic as Anthropic).messages.create({
          model: options.model,
          messages,
          system: options.system,
          max_tokens: maxTokens,
          temperature,
          stop_sequences: options.stop ? [options.stop].flat() : undefined,
        });
      }

      // Convert provider-specific response to ChatCompletionResponse format
      const textContent = response.content.find(c => c.type === "text");

      return {
        id: response.id,
        model: response.model,
        message: {
          role: "assistant",
          content: textContent?.text || "",
        },
        usage: {
          promptTokens: response.usage?.input_tokens || 0,
          completionTokens: response.usage?.output_tokens || 0,
          totalTokens:
            (response.usage?.input_tokens || 0) +
            (response.usage?.output_tokens || 0),
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
      this.validateInputTokens(options.model, options.messages);
      const maxTokens = this.validateMaxTokens(
        options.model,
        options.maxTokens
      );
      const temperature = this.validateTemperature(options.temperature);

      const { messages } = this.formatMessages(options.messages);

      // Handle provider-specific streaming
      let stream;
      if (this.providerType === "bedrock") {
        stream = await (this.anthropic as AnthropicBedrock).messages.stream({
          model: `anthropic.${options.model}`,
          messages,
          system: options.system,
          max_tokens: maxTokens,
          temperature,
          stop_sequences: options.stop ? [options.stop].flat() : undefined,
        });
      } else if (this.providerType === "vertex") {
        stream = await (this.anthropic as AnthropicVertex).messages.stream({
          model: options.model,
          messages,
          system: options.system,
          max_tokens: maxTokens,
          temperature,
          stop_sequences: options.stop ? [options.stop].flat() : undefined,
        });
      } else {
        stream = await (this.anthropic as Anthropic).messages.stream({
          model: options.model,
          messages,
          system: options.system,
          max_tokens: maxTokens,
          temperature,
          stop_sequences: options.stop ? [options.stop].flat() : undefined,
        });
      }

      let accumulatedText = "";

      return new Promise((resolve, reject) => {
        stream.on("text", (text: string) => {
          accumulatedText += text;
          onMessage(text);
        });

        stream.on("message", (message: StreamMessage) => {
          // Handle final message if needed
          if (message.message) {
            console.debug("Stream completed:", {
              id: message.message.id,
              model: message.message.model,
              stopReason: message.message.stop_reason,
              usage: message.message.usage,
            });
          }
        });

        stream.on("error", (error: Error) => {
          reject(error);
        });

        stream.on("end", () => {
          resolve();
        });
      });
    } catch (error) {
      this.handleError(error);
      throw error; // Re-throw to ensure the promise rejects
    }
  }
}

import { encoding_for_model, get_encoding, TiktokenModel } from "tiktoken";
import { z } from "zod";

// Common tokenizer names used by various models
const TokenizerNameSchema = z.enum(["cl100k_base", "p50k_base", "r50k_base"]);
type TokenizerName = z.infer<typeof TokenizerNameSchema>;

// Model or tokenizer type
const ModelOrTokenizerSchema = z.union([
  z.string().refine((val): val is TiktokenModel => val.startsWith("gpt-")),
  TokenizerNameSchema,
]);
type ModelOrTokenizer = z.infer<typeof ModelOrTokenizerSchema>;

// Cache encoders to avoid recreating them
const encoderCache = new Map<string, any>();

// Message role schema with common roles
const MessageRoleSchema = z.enum([
  "system",
  "user",
  "assistant",
  "function",
  "tool",
]);

// Validation schema for message
const MessageSchema = z.object({
  role: MessageRoleSchema,
  content: z.string(),
  name: z.string().optional(),
});

// Validation schema for token count options
const TokenCountOptionsSchema = z
  .object({
    model: ModelOrTokenizerSchema.optional(),
    countSystemMessage: z.boolean().default(false),
    countRoles: z.boolean().default(false),
  })
  .default({
    countSystemMessage: false,
    countRoles: false,
  });

type TokenCountOptions = z.infer<typeof TokenCountOptionsSchema>;
type Message = z.infer<typeof MessageSchema>;

// Token overhead constants
const TOKEN_OVERHEAD = {
  PER_MESSAGE: 4,
  SYSTEM_MESSAGE: 2,
  NAME_FIELD: 1,
  REPLY_PREFIX: 2,
} as const;

// Memoized encoder getter
function getEncoder(modelOrTokenizer?: ModelOrTokenizer) {
  try {
    // Default to cl100k_base (used by gpt-4, gpt-3.5-turbo, Claude, etc)
    const key = modelOrTokenizer || "cl100k_base";

    if (!encoderCache.has(key)) {
      // If it's a known OpenAI model, use encoding_for_model
      // Otherwise use the tokenizer name directly
      const encoder = key.startsWith("gpt-")
        ? encoding_for_model(key as TiktokenModel)
        : get_encoding(key as TokenizerName);
      encoderCache.set(key, encoder);
    }

    return encoderCache.get(key)!;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get encoder: ${error.message}`);
    }
    throw error;
  }
}

// Calculate message overhead tokens
function calculateMessageOverhead(
  message: Message,
  countRoles: boolean
): number {
  let overhead = 0;

  if (countRoles) {
    overhead += TOKEN_OVERHEAD.PER_MESSAGE;
    if (message.role === "system") {
      overhead += TOKEN_OVERHEAD.SYSTEM_MESSAGE;
    }
    if (message.name) {
      overhead += TOKEN_OVERHEAD.NAME_FIELD;
    }
  }

  return overhead;
}

// Count tokens for a single message
export function estimateTokensForMessage(
  message: Message | { role: string; content: string },
  options: TokenCountOptions = TokenCountOptionsSchema.parse({})
): number {
  try {
    // Validate message and options
    const validatedMessage = MessageSchema.parse(message);
    const validatedOptions = TokenCountOptionsSchema.parse(options);

    // Skip system messages if specified
    if (
      validatedMessage.role === "system" &&
      !validatedOptions.countSystemMessage
    ) {
      return 0;
    }

    const encoder = getEncoder(validatedOptions.model);
    let tokens = encoder.encode(validatedMessage.content).length;

    // Add role and other overhead if specified
    if (validatedOptions.countRoles) {
      tokens += calculateMessageOverhead(validatedMessage, true);
    }

    return tokens;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(
        `Validation error: ${error.errors.map(e => e.message).join(", ")}`
      );
    }
    if (error instanceof Error) {
      throw new Error(`Token estimation error: ${error.message}`);
    }
    throw error;
  }
}

// Count tokens for an array of messages
export function estimateTokensForMessages(
  messages: Array<Message | { role: string; content: string }>,
  options: TokenCountOptions = TokenCountOptionsSchema.parse({})
): number {
  try {
    // Validate messages array
    if (!Array.isArray(messages)) {
      throw new Error("Messages must be an array");
    }

    const validatedOptions = TokenCountOptionsSchema.parse(options);
    let totalTokens = 0;

    // Add reply prefix tokens for chat completion format
    if (validatedOptions.countRoles) {
      totalTokens += TOKEN_OVERHEAD.REPLY_PREFIX;
    }

    // Process messages in chunks for better performance
    const chunkSize = 100;
    for (let i = 0; i < messages.length; i += chunkSize) {
      const chunk = messages.slice(i, i + chunkSize);
      totalTokens += chunk.reduce(
        (sum, message) =>
          sum + estimateTokensForMessage(message, validatedOptions),
        0
      );
    }

    return totalTokens;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Token estimation error for messages: ${error.message}`);
    }
    throw error;
  }
}

// Format size to human readable with proper rounding
export function formatTokenCount(count: number): string {
  try {
    if (!Number.isFinite(count) || count < 0) {
      throw new Error("Invalid token count");
    }

    if (count < 1000) return `${Math.round(count)} tokens`;
    if (count < 1000000) return `${(count / 1000).toFixed(1)}K tokens`;
    return `${(count / 1000000).toFixed(1)}M tokens`;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Token formatting error: ${error.message}`);
    }
    throw error;
  }
}

// Cleanup function to free encoders when they're no longer needed
export function cleanupEncoders(): void {
  try {
    for (const encoder of encoderCache.values()) {
      encoder.free();
    }
    encoderCache.clear();
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Failed to cleanup encoders: ${error.message}`);
    }
    // Don't throw here as this is cleanup code
  }
}

// Export types for external use
export type { Message, TokenCountOptions, ModelOrTokenizer };

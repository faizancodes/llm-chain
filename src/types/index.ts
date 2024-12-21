import { z } from "zod";

export const MessageRoleSchema = z.enum(["system", "user", "assistant"]);
export type MessageRole = z.infer<typeof MessageRoleSchema>;

export const MessageSchema = z.object({
  role: MessageRoleSchema,
  content: z.string(),
});
export type Message = z.infer<typeof MessageSchema>;

export const ChatCompletionOptionsSchema = z.object({
  model: z.string(),
  messages: z.array(MessageSchema),
  system: z.string().optional(),
  temperature: z.number().min(0).max(2).optional().default(1),
  maxTokens: z.number().positive().optional(),
  stop: z.union([z.string(), z.array(z.string())]).optional(),
  stream: z.boolean().optional().default(false),
  logprobs: z.any().optional(),
  logit_bias: z.any().optional(),
  top_logprobs: z.any().optional(),
});
export type ChatCompletionOptions = z.infer<typeof ChatCompletionOptionsSchema>;

export const ChatCompletionResponseSchema = z.object({
  id: z.string(),
  model: z.string(),
  message: MessageSchema,
  usage: z.object({
    promptTokens: z.number(),
    completionTokens: z.number(),
    totalTokens: z.number(),
  }),
});
export type ChatCompletionResponse = z.infer<
  typeof ChatCompletionResponseSchema
>;

export interface LLMProvider {
  chatCompletion(
    options: ChatCompletionOptions
  ): Promise<ChatCompletionResponse>;
  streamChatCompletion(
    options: ChatCompletionOptions,
    onMessage: (message: string) => void
  ): Promise<void>;
}

# llm-chain

A TypeScript library for easily interacting with various Large Language Model providers through a unified interface.

## Installation

```bash
npm install llm-chain
```

## Features

- Unified interface for multiple LLM providers:
  - OpenAI
  - Groq
  - Gemini (Google)
  - Anthropic
- Type-safe API with TypeScript
- Support for streaming responses
- Built-in validation using Zod
- Easy to extend for new providers
- Automatic model validation and token limits
- Provider-specific optimizations
- Support for multiple deployment options (Direct API, AWS Bedrock, Google Vertex)


## Usage

### OpenAI

```typescript
import { LLMClient } from "llm-chain";

// Create a client with OpenAI
const client = LLMClient.createOpenAI("your-openai-api-key");

// Simple completion
const response = await client.complete("What is the capital of France?");
console.log(response);

// Chat completion with more options
const chatResponse = await client.chatCompletion({
  model: "gpt-4o-mini",
  messages: [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: "What is the capital of France?" },
  ],
  temperature: 0.7,
});

console.log(chatResponse.message.content);
```

### Groq

```typescript
import { LLMClient } from "llm-chain";

// Create a client with Groq
const client = LLMClient.createGroq("your-groq-api-key");

// Chat completion with Mixtral
const chatResponse = await client.chatCompletion({
  model: "mixtral-8x7b-32768",
  messages: [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: "What is the capital of France?" },
  ],
  temperature: 0.7,
});

console.log(chatResponse.message.content);
```

### Gemini

```typescript
import { LLMClient } from "llm-chain";

// Create a client with Gemini
const client = LLMClient.createGemini("your-gemini-api-key");

// Chat completion with Gemini Pro
const chatResponse = await client.chatCompletion({
  model: "gemini-2.0-flash",
  messages: [{ role: "user", content: "What is the capital of France?" }],
  temperature: 0.7,
});

console.log(chatResponse.message.content);
```

### Anthropic

```typescript
import { LLMClient } from "llm-chain";

// Create a client with Anthropic
const client = LLMClient.createAnthropic("your-anthropic-api-key");

// Chat completion with Claude
const chatResponse = await client.chatCompletion({
  model: "claude-3.5-sonnet-latest",
  messages: [{ role: "user", content: "What is the capital of France?" }],
  temperature: 0.7,
});

console.log(chatResponse.message.content);
```

### Streaming Responses

```typescript
await client.streamChatCompletion(
  {
    model: "mixtral-8x7b-32768", // or any other supported model
    messages: [{ role: "user", content: "Write a story about a cat." }],
  },
  chunk => {
    process.stdout.write(chunk);
  }
);
```

## Supported Models

### OpenAI Models

- Default model: gpt-4o-mini
- Supports all OpenAI chat models

### Groq Models

#### Production Models

- `mixtral-8x7b-32768` (Mistral, 32k context)
- `llama-3.3-70b-versatile` (Meta, 128k context)
- `llama-3.1-8b-instant` (Meta, 128k context)
- Various Whisper models for audio processing

#### Preview Models

- `llama3-groq-70b-8192-tool-use-preview` (Groq)
- `llama3-groq-8b-8192-tool-use-preview` (Groq)
- Various LLaMA-3 preview models

### Gemini Models

#### Gemini 2.0

- `gemini-2.0-flash-exp` (Experimental, 1M input tokens)

#### Gemini 1.5

- `gemini-1.5-flash` (32k context, versatile)
- `gemini-1.5-flash-8b` (32k context, high volume)
- `gemini-1.5-pro` (32k context, complex reasoning)

#### Utility Models

- `text-embedding-004` (Embeddings)
- `aqa` (Question answering)

### Anthropic Models

#### Claude 3 Models

- `claude-3-5-sonnet-20241022` (Latest Sonnet)
- `claude-3-5-haiku-20241022` (Latest Haiku)
- `claude-3-opus-20240229` (Most powerful)
- `claude-3-sonnet-20240229` (Balanced)
- `claude-3-haiku-20240307` (Fast)
- `claude-2.1` (Legacy)

## Advanced Features

### Custom Provider

```typescript
import { LLMProvider, LLMClient } from "llm-chain";

class CustomProvider implements LLMProvider {
  // Implement the LLMProvider interface
  // ...
}

const client = new LLMClient(new CustomProvider(), "your-model-name");
```

### Anthropic Deployment Options

```typescript
// Direct API
const client = LLMClient.createAnthropic("your-api-key");

// AWS Bedrock
const client = LLMClient.createAnthropic("your-api-key", "bedrock", {
  aws_access_key: "your-access-key",
  aws_secret_key: "your-secret-key",
  aws_region: "us-east-1",
});

// Google Vertex
const client = LLMClient.createAnthropic("your-api-key", "vertex", {
  project_id: "your-project-id",
  region: "us-central1",
});
```

## Error Handling

The library provides built-in error handling and validation:

- Model availability checks
- Token limit validation
- Context window size validation
- Streaming capability checks
- Provider-specific error handling

## License

MIT

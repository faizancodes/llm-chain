import { LLMClient } from "./src/index";
import dotenv from "dotenv";
import { TimingInfo } from "./src/types";
import { StreamingMetrics } from "./src/utils/timing";

dotenv.config();

function formatMetrics(
  provider: string,
  timing: TimingInfo & { streaming?: StreamingMetrics }
) {
  const { duration, streaming } = timing;
  console.log(`\n[${provider} Metrics]`);
  console.log(`Total Duration: ${duration.toFixed(2)}ms`);

  if (streaming) {
    console.log(
      `Time to First Token: ${streaming.timeToFirstToken.toFixed(2)}ms`
    );
    console.log(`Tokens per Second: ${streaming.tokensPerSecond.toFixed(2)}`);
    console.log(
      `Total Response Time: ${streaming.totalResponseTime.toFixed(2)}ms`
    );
    console.log(`Total Tokens: ${streaming.totalTokens}`);
  }
}

async function main() {
  const openaiClient = LLMClient.createOpenAI(process.env.OPENAI_API_KEY!);
  const groqClient = LLMClient.createGroq(process.env.GROQ_API_KEY!);
  const geminiClient = LLMClient.createGemini(process.env.GOOGLE_API_KEY!);
  const togetherClient = LLMClient.createTogether(process.env.TOGETHER_API_KEY!);

  console.log("\nTesting OpenAI streaming...");
  await openaiClient.streamChatCompletion(
    {
      model: "gpt-4",
      messages: [{ role: "user", content: "What is the capital of France?" }],
      temperature: 1,
      stream: true,
    },
    message => process.stdout.write(message),
    timing => formatMetrics("OpenAI", timing)
  );

  console.log("\n\nTesting Groq streaming...");
  await groqClient.streamChatCompletion(
    {
      model: "llama3-8b-8192",
      messages: [{ role: "user", content: "What is the capital of France?" }],
      temperature: 1,
      stream: true,
    },
    message => process.stdout.write(message),
    timing => formatMetrics("Groq", timing)
  );

  console.log("\n\nTesting Gemini streaming...");
  await geminiClient.streamChatCompletion(
    {
      model: "gemini-1.5-flash",
      messages: [{ role: "user", content: "What is the capital of France?" }],
      temperature: 1,
      stream: true,
    },
    message => process.stdout.write(message),
    timing => formatMetrics("Gemini", timing)
  );


  console.log("\n\nTesting Together streaming...");
  await togetherClient.streamChatCompletion(
    {
      model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
      messages: [{ role: "user", content: "What is the capital of France?" }],
      temperature: 1,
      stream: true,
    },
    message => process.stdout.write(message),
    timing => formatMetrics("Together", timing)
  );
}

main().catch(console.error);

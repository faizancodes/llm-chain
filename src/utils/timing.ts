/**
 * Interface for timing measurement results
 */
interface TimingResult {
  startTime: number;
  endTime: number;
  duration: number;
}

/**
 * Measures the execution time of an async function
 * @param fn Async function to measure
 * @returns Promise with timing result and function result
 */
export async function measureResponseTime<T>(
  fn: () => Promise<T>
): Promise<{ timing: TimingResult; result: T }> {
  const startTime = performance.now();

  try {
    const result = await fn();
    const endTime = performance.now();

    return {
      timing: {
        startTime,
        endTime,
        duration: endTime - startTime,
      },
      result,
    };
  } catch (error) {
    const endTime = performance.now();
    // Attach timing info to error before rethrowing
    const timingError = error as Error & { timing?: TimingResult };
    timingError.timing = {
      startTime,
      endTime,
      duration: endTime - startTime,
    };
    throw timingError;
  }
}

export interface StreamingMetrics {
  timeToFirstToken: number; // Time from start to first token (ms)
  tokensPerSecond: number; // Average tokens per second
  totalResponseTime: number; // Total time from start to end (ms)
  totalTokens: number; // Total number of tokens received
}

/**
 * Creates a metrics collector for streaming responses
 * @returns Object with methods to track streaming metrics
 */
export function createStreamMetricsCollector() {
  const startTime = performance.now();
  let firstTokenTime: number | null = null;
  let tokenCount = 0;

  return {
    // Mark when first token is received
    markFirstToken: () => {
      if (firstTokenTime === null) {
        firstTokenTime = performance.now();
      }
    },

    // Increment token count
    addTokens: (count: number) => {
      tokenCount += count;
    },

    // Calculate final metrics
    getMetrics: (): StreamingMetrics => {
      const endTime = performance.now();
      const totalResponseTime = endTime - startTime;

      // Calculate time to first token
      const timeToFirstToken = firstTokenTime
        ? firstTokenTime - startTime
        : totalResponseTime;

      // Calculate tokens per second (avoid division by zero)
      const durationInSeconds = totalResponseTime / 1000;
      const tokensPerSecond =
        durationInSeconds > 0 ? tokenCount / durationInSeconds : 0;

      return {
        timeToFirstToken,
        tokensPerSecond,
        totalResponseTime,
        totalTokens: tokenCount,
      };
    },
  };
}

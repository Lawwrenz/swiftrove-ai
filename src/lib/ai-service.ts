// ============================================================================
// AI Service — Unified client for calling Supabase Edge Functions
// ============================================================================

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export interface AIRequestOptions {
  signal?: AbortSignal;
  stream?: boolean;
}

export interface AIResponse {
  response: string;
  error?: string;
}

// --- Cache helper ---
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function getFromCache(key: string): any | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

export function setCache(key: string, data: any): void {
  cache.set(key, { data, timestamp: Date.now() });
}

export function getCacheKey(prefix: string, ...args: (string | number)[]): string {
  return `${prefix}:${args.join(":")}`;
}

// --- Generic Edge Function caller ---
async function callEdgeFunction(
  functionName: string,
  body: Record<string, any>,
  options?: AIRequestOptions,
): Promise<AIResponse> {
  const url = `${SUPABASE_URL}/functions/v1/${functionName}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ ...body, stream: options?.stream ?? false }),
    signal: options?.signal,
  });

  if (!response.ok) {
    const err = await response.text();
    return { response: "", error: `API error: ${err}` };
  }

  if (options?.stream) {
    return { response: "", error: undefined };
  }

  const data = await response.json();
  if (data.error) {
    return { response: "", error: data.error };
  }

  return { response: data.response || data.summary || data.workflowDescription || data.cashFlowSummary || data.message || data.aiSummary || JSON.stringify(data), error: undefined };
}

// --- Swift Assistant ---
export async function askSwift(
  query: string,
  context?: string,
  options?: AIRequestOptions,
): Promise<AIResponse> {
  return callEdgeFunction("swift-assistant", { query, context }, options);
}

// --- Workflow Engine ---
export async function generateWorkflow(
  action: string,
  data?: string,
  options?: AIRequestOptions,
): Promise<AIResponse> {
  const cacheKey = getCacheKey("workflow", action, data || "");
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  const result = await callEdgeFunction("workflow-engine", { action, data }, options);
  if (!result.error && result.response) {
    setCache(cacheKey, result);
  }
  return result;
}

// --- Customer Intelligence ---
export async function analyzeCustomer(
  customerId: string,
  customerName: string,
  customerData: string,
  options?: AIRequestOptions,
): Promise<AIResponse> {
  const cacheKey = getCacheKey("customer-intelligence", customerId);
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  const result = await callEdgeFunction("customer-intelligence", {
    customerId,
    customerName,
    data: customerData,
  }, options);

  if (!result.error && result.response) {
    setCache(cacheKey, result);
  }
  return result;
}

// --- Finance Agent ---
export async function askFinanceAgent(
  query: string,
  data?: string,
  options?: AIRequestOptions,
): Promise<AIResponse> {
  const cacheKey = getCacheKey("finance", query, data || "");
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  const result = await callEdgeFunction("finance-agent", { query, data }, options);
  if (!result.error && result.response) {
    setCache(cacheKey, result);
  }
  return result;
}

// --- Customer Success Agent ---
export async function generateCustomerMessage(
  action: string,
  customerName: string,
  context: string,
  options?: AIRequestOptions,
  style?: string,
): Promise<AIResponse> {
  return callEdgeFunction("customer-success-agent", {
    action,
    customerName,
    context,
    style: style || "professional",
  }, options);
}

// --- Automation Studio ---
export async function generateWorkflowDescription(
  description: string,
  options?: AIRequestOptions,
): Promise<AIResponse> {
  return callEdgeFunction("automation-studio", { description }, options);
}

// --- Stream parser helper ---
export function parseStreamEvent(event: string): string | null {
  try {
    const parsed = JSON.parse(event);
    // Handle different streaming event types
    if (parsed.type === "response.output_text.delta") {
      return parsed.delta;
    }
    if (parsed.delta) {
      return parsed.delta;
    }
    return null;
  } catch {
    // Try to handle raw SSE data
    if (event.startsWith("data: ")) {
      const data = event.slice(6);
      if (data === "[DONE]") return null;
      try {
        const parsed = JSON.parse(data);
        return parsed.delta || parsed.choices?.[0]?.delta?.content || null;
      } catch {
        return null;
      }
    }
    return null;
  }
}

// --- Error handler helper ---
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.includes("rate limit")) {
      return "Swift is thinking a little too fast — give it a moment and try again.";
    }
    if (error.message.includes("timeout") || error.message.includes("timed out")) {
      return "This request is taking longer than expected. Please try again.";
    }
    if (error.message.includes("401") || error.message.includes("unauthorized")) {
      return "There was an authentication issue. Please check your settings.";
    }
    return error.message;
  }
  return "Something unexpected happened. Please try again.";
}

// --- Input sanitization ---
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "") // Remove control characters
    .slice(0, 2000); // Limit length
}
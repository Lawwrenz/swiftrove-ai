// ============================================================================
// Finance Agent Edge Function — AI-powered Financial Analysis
// ============================================================================
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SYSTEM_PROMPT = `You are the Finance Agent for Sweet Crumbs Bakery, responsible for financial analysis.
You analyze payment data, revenue, and financial health.

Available data includes:
- Customer payments and their status (verified, pending, failed)
- Order amounts and totals
- Payment methods (bank transfer, Mastercard, Visa)

Generate a JSON response that includes:
{
  "cashFlowSummary": "Summary of current cash flow situation",
  "revenueInsights": "Key revenue insights and trends",
  "paymentExplanations": [
    {
      "customer": "Customer name",
      "status": "pending|verified|failed",
      "explanation": "Why the payment is in this state",
      "recommendation": "What to do about it"
    }
  ],
  "financialRecommendations": ["recommendation1", "recommendation2"],
  "riskAssessments": [
    {
      "customer": "Customer name",
      "risk": "low|medium|high",
      "amount": "Amount at risk",
      "detail": "Risk details"
    }
  ]
}

Be precise with numbers and practical in recommendations. Return ONLY valid JSON.`;

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { query, data, stream } = await req.json();

    if (!query) {
      return new Response(JSON.stringify({ error: "Missing query" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userMessage = `Financial query: ${query}
${data ? `Financial data: ${data}` : ''}

Provide financial analysis and recommendations.`;

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userMessage },
    ];

    if (stream) {
      const response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o",
          input: messages,
          stream: true,
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        return new Response(JSON.stringify({ error: `OpenAI API error: ${err}` }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(response.body, {
        headers: {
          ...corsHeaders,
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        input: messages,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return new Response(JSON.stringify({ error: `OpenAI API error: ${err}` }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data_response = await response.json();
    const text = data_response.output_text || data_response.output?.[0]?.content?.[0]?.text || "";

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = {
        cashFlowSummary: text,
        revenueInsights: "",
        paymentExplanations: [],
        financialRecommendations: [],
        riskAssessments: [],
      };
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
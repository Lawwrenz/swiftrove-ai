// ============================================================================
// Customer Intelligence Edge Function — AI-powered Customer Analysis
// ============================================================================
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SYSTEM_PROMPT = `You are the Customer Intelligence AI for Sweet Crumbs Bakery.
You analyze customer data to generate insights, predictions, and recommendations.

For each customer, generate a JSON response that includes:
{
  "aiSummary": "1-2 sentence summary of the customer",
  "behaviourAnalysis": "Analysis of buying patterns and behaviour",
  "purchasePrediction": "Prediction of next purchase likelihood and timing",
  "nextBestActions": [
    {
      "title": "Action title",
      "explanation": "Why this action",
      "impact": "Expected impact",
      "priority": "high|medium|low"
    }
  ],
  "upsellRecommendations": [
    {
      "title": "Recommendation title",
      "reason": "Why this upsell fits"
    }
  ],
  "relationshipInsights": "Key insights about the customer relationship"
}

Be data-driven and practical. Return ONLY valid JSON.`;

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

    const { customerId, customerName, data, stream } = await req.json();

    if (!customerId || !customerName) {
      return new Response(JSON.stringify({ error: "Missing customerId or customerName" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userMessage = `Analyze customer ${customerName} (ID: ${customerId}).
Customer Data: ${data || 'No additional data provided'}

Generate comprehensive customer intelligence including summary, behaviour analysis, predictions, and recommendations.`;

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
        aiSummary: text,
        behaviourAnalysis: "",
        purchasePrediction: "",
        nextBestActions: [],
        upsellRecommendations: [],
        relationshipInsights: "",
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
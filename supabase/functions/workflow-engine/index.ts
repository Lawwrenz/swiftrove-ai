// ============================================================================
// Workflow Engine Edge Function — AI-powered Workflow Generation
// ============================================================================
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SYSTEM_PROMPT = `You are the Workflow Engine for Sweet Crumbs Bakery, responsible for orchestrating AI agents.
You analyze business workflows and determine which agents should handle which tasks.

Available agents:
- Sales Agent (TrendingUp icon): Lead generation, quotations, product recommendations, order creation
- Finance Agent (DollarSign icon): Payment verification, invoice generation, expense tracking, anomaly detection
- Customer Success Agent (Handshake icon): Support tickets, order confirmations, follow-ups, feedback collection

For each workflow, provide a JSON response with these fields:
{
  "summary": "Clear workflow summary",
  "agents": [
    {
      "name": "Agent Name",
      "reason": "Why this agent was selected",
      "task": "What they will do"
    }
  ],
  "recommendations": ["recommendation1", "recommendation2"],
  "executionSummary": "Overall execution summary"
}

Be concise and practical. Focus on the bakery's operations. Return ONLY valid JSON.`;

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

    const { action, data, stream } = await req.json();

    if (!action) {
      return new Response(JSON.stringify({ error: "Missing action" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userMessage = `Generate a workflow ${action}.
${data ? `Additional context: ${data}` : ''}`;

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

    // Try to parse as JSON
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = { summary: text, agents: [], recommendations: [], executionSummary: text };
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
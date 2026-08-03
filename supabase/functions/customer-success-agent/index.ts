// ============================================================================
// Customer Success Agent Edge Function — AI-powered Customer Communications
// ============================================================================
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SYSTEM_PROMPT = `You are the Customer Success Agent for Sweet Crumbs Bakery.
You handle customer communications, support, and retention.

For each customer interaction, generate a JSON response that includes:
{
  "message": "The drafted message text",
  "messageType": "reply|confirmation|follow-up|review-request|retention",
  "subject": "Brief subject line",
  "tone": "warm|professional|urgent",
  "recommendations": [
    {
      "title": "Recommendation title",
      "detail": "Why this is recommended"
    }
  ],
  "summary": "Brief communication summary"
}

Write in a warm, professional tone. Personalize each message. Return ONLY valid JSON.`;

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

    const { action, customerName, context, stream, style } = await req.json();

    if (!action || !customerName) {
      return new Response(JSON.stringify({ error: "Missing action or customerName" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const tone = style || "professional";
    const toneInstruction = {
      professional: "Write in a professional, polished business tone. Be courteous and precise.",
      friendly: "Write in a warm, friendly tone. Be approachable and conversational.",
      concise: "Write in a brief, direct tone. Get straight to the point with no fluff.",
      empathetic: "Write in a caring, empathetic tone. Acknowledge feelings and be reassuring.",
    }[tone] || "Write in a professional, polished business tone. Be courteous and precise.";

    const userMessage = `Action needed: ${action}
Customer: ${customerName}
Context: ${context || 'No additional context'}

${toneInstruction}

Generate the appropriate customer communication or recommendation.`;

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
        message: text,
        messageType: "reply",
        subject: "",
        tone: "warm",
        recommendations: [],
        summary: text,
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
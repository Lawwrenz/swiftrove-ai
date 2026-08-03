// ============================================================================
// Swift Assistant Edge Function — Real AI-powered Executive Assistant
// ============================================================================
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY")!;

Deno.serve(async (req: Request) => {
  try {
    // Verify JWT
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { query, context, stream } = await req.json();

    if (!query) {
      return new Response(JSON.stringify({ error: "Missing query" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // System prompt
    const systemPrompt = `You are Swift, an intelligent executive assistant for Sweet Crumbs Bakery.
You have access to the following business data:

CUSTOMERS: Grace Eze (VIP, N1.2M lifetime value, active, 24 orders), Amaka Bello (corporate client, N320K, active, 18 orders), Chinedu Okafor (VIP, N890K, active, 42 orders), Adaobi Nwosu (lead, wedding inquiry, 1 order), Tolu Adebayo (cancelled subscription, N215K), Kofi Asante (new lead, 0 orders), Ama Boateng (dormant, N95K), Kwame Mensah (VIP, N620K, 31 orders, loyal), Amina Wanjiku (churned, N55K), Brian Otieno (corporate, N175K, 9 orders), Faith Njeri (trial, N28K, referred by Chinedu), Thabo Mokoena (multi-product, N285K, 11 orders, payment declined), Naledi Dlamini (regular, N310K, 14 orders), David Mensah (high-value catering, N420K, 22 orders), Zainab Ibrahim (new lead, wedding inquiry)

ORDERS: ORD-1048 (Grace Eze, Custom Celebration Cake, N185K, processing), ORD-1047 (Amaka Bello, Corporate Dessert, N95K, new), ORD-1046 (Adaobi Nwosu, Wedding Cake, N450K, processing), ORD-1045 (Brian Otieno, Corporate Dessert, N150K, shipped), ORD-1044 (Naledi Dlamini, Celebration Cake, N145K, delivered), ORD-1043 (Kwame Mensah, Birthday Cake, N85K, delivered), ORD-1042 (Thabo Mokoena, Wedding Cake, N450K, pending - bank declined), ORD-1041 (Tolu Adebayo, Subscription, N25K, cancelled), ORD-1040 (Kofi Asante, Pastry Box, N35K, new)

PAYMENTS: PAY-001 (Grace Eze, N185K, pending bank transfer), PAY-002 (Amaka Bello, N95K, verified), PAY-003 (Adaobi Nwosu, N450K, pending), PAY-004 (Tolu Adebayo, N25K, failed), PAY-005 (Kofi Asante, N35K, pending), PAY-006 (Naledi Dlamini, N145K, verified), PAY-007 (Thabo Mokoena, N450K, bank declined), PAY-008 (Brian Otieno, N150K, verified)

AGENTS: Sales Agent (online, creating quotation for Amaka Bello), Finance Agent (working, reviewing payment for Grace Eze), Customer Success Agent (working, preparing confirmation for Grace Eze)

Respond concisely and helpfully. Use the business data above to answer questions about customers, orders, payments, and recommendations. Be proactive and suggest actions when appropriate.`;

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: context ? `Context: ${context}\n\nQuestion: ${query}` : query },
    ];

    if (stream) {
      // Streaming response
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
          headers: { "Content-Type": "application/json" },
        });
      }

      // Stream the response back to the client
      return new Response(response.body, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      });
    } else {
      // Non-streaming response
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
          headers: { "Content-Type": "application/json" },
        });
      }

      const data = await response.json();
      return new Response(JSON.stringify({ response: data.output_text || data.output?.[0]?.content?.[0]?.text || "" }), {
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
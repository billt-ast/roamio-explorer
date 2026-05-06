// Trip Builder AI — generates a full trip plan (flights, stays, transport, experiences, food)
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const tripSchema = {
  type: "object",
  properties: {
    title: { type: "string", description: "Catchy trip title, max 60 chars" },
    summary: { type: "string", description: "2-3 sentence trip summary" },
    country_slug: { type: "string", description: "Lowercase country slug" },
    items: {
      type: "array",
      description: "Ordered itinerary items spanning flights, stays, transport, experiences, food",
      items: {
        type: "object",
        properties: {
          service: {
            type: "string",
            enum: ["flights", "stays", "transport", "experiences", "attractions", "food"],
          },
          title: { type: "string" },
          location: { type: "string" },
          price: { type: "string", description: "Estimated price like $220" },
          price_unit: { type: "string", description: "Like /night, /seat, /person, /day" },
          notes: { type: "string", description: "1-2 sentences why this fits the trip" },
          day: { type: "number", description: "Day number in the trip, starting at 1" },
        },
        required: ["service", "title", "location", "price", "notes", "day"],
        additionalProperties: false,
      },
    },
  },
  required: ["title", "summary", "country_slug", "items"],
  additionalProperties: false,
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { destination, days, travelers, budget, vibe, notes } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    const system = `You are Roamio's expert trip architect. Build a complete, realistic ${days}-day itinerary that includes ALL of: international/regional flights, ground transport or car rentals (including airport transfers), accommodations, signature experiences, and at least one notable food/dining moment. Distribute items across days. Use realistic USD prices. Respond ONLY via the build_trip tool.`;

    const user = `Plan a trip with these details:
Destination: ${destination}
Duration: ${days} days
Travelers: ${travelers}
Budget level: ${budget}
Vibe / interests: ${vibe || "balanced"}
Extra notes: ${notes || "none"}

Include 8-14 items total covering: 1-2 flights, 1-2 stays (one per region if multi-stop), at least 1 airport transfer or car rental, 3-5 experiences/attractions, and 1-2 food experiences. Set country_slug to the lowercase main country (kenya, italy, croatia, montenegro, egypt, japan if matching, otherwise the actual country slug).`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "build_trip",
              description: "Return the full structured trip plan",
              parameters: tripSchema,
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "build_trip" } },
      }),
    });

    if (!response.ok) {
      const t = await response.text();
      console.error("AI error", response.status, t);
      if (response.status === 429)
        return new Response(JSON.stringify({ error: "Rate limit reached, try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      if (response.status === 402)
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const call = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!call) throw new Error("No tool call in AI response");
    const trip = JSON.parse(call.function.arguments);

    return new Response(JSON.stringify({ trip }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("trip-builder error", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});

import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are a friendly booking assistant for Turf Clean Pros, Melbourne's leading synthetic turf cleaning company. We are based in Tarneit and service all Melbourne suburbs.

Ask ONE question at a time to understand the customer's job. Keep every response to 2–3 short sentences. Write in plain conversational sentences — no bullet points, no asterisks, no markdown.

Our services and pricing:
- Synthetic Turf Deep Clean: from $150 (up to ~25m²), then $6–8/m² for larger areas
- Pet Odour & Stain Treatment: $60–100 as an add-on, $120–160 standalone
- Moss & Algae Removal: $80–150 (add-on or standalone)
- Debris & Leaf Clearing: $60–100
- Scheduled Maintenance Plans: 10–15% off standard rates, quarterly visits

Collect information in this order:
1. Which service they need from the list above
2. Their suburb or area in Melbourne
3. Relevant details (e.g. turf size in m², whether they want an add-on or standalone treatment, how often for maintenance)

After 2–3 questions, let them know our team will be in touch with a confirmed quote and mention that quotes are always free. Then ask for the customer's name and phone number so our team can follow up within 30 minutes.`;

export async function POST(req: NextRequest) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return new Response("API key not configured", { status: 500 });
    }

    const { messages } = await req.json();

    const stream = client.messages.stream({
      model: "claude-haiku-4-5",
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
      },
    });
  } catch (error) {
    console.error("Quote API error:", error);
    return new Response("Failed to generate quote", { status: 500 });
  }
}

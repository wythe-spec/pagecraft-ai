import { deepseek } from "@/lib/deepseek";
import { SYSTEM_PROMPT } from "@/lib/system-prompt";
import { streamText } from "ai";

export const runtime = "edge";

export async function POST(req: Request) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "DEEPSEEK_API_KEY is not configured. Please set it in .env.local" },
      { status: 500 }
    );
  }

  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: "No messages provided" }, { status: 400 });
    }

    const result = streamText({
      model: deepseek("deepseek-chat"),
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role as "user" | "assistant" | "system",
          content: m.content,
        })),
      ],
      temperature: 0.7,
      maxTokens: 4096,
    });

    return result.toDataStreamResponse();
  } catch (err) {
    console.error("Chat API error:", err);
    return Response.json(
      { error: "Failed to generate response. Please try again." },
      { status: 500 }
    );
  }
}

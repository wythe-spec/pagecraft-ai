import { SYSTEM_PROMPT } from "@/lib/system-prompt";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { streamText } from "ai";

export const runtime = "edge";

const deepseek = createOpenAICompatible({
  name: "deepseek",
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY ?? "",
});

export async function POST(req: Request) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "DEEPSEEK_API_KEY is not configured." }, { status: 500 });
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
      maxTokens: 16000,
    });

    return result.toDataStreamResponse({
      getErrorMessage: (error) => {
        if (error instanceof Error) {
          const detail = (error as any).data ? JSON.stringify((error as any).data) : "";
          return `${error.message}${detail ? " | " + detail : ""}`;
        }
        return String(error);
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Chat API error:", message);
    return Response.json({ error: `Generation failed: ${message}` }, { status: 500 });
  }
}

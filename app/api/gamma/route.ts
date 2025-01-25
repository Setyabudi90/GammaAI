import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const apiKey = process.env.GROQ_API_KEY;

const groq = new Groq({
  apiKey,
  dangerouslyAllowBrowser: false,
});

const MAX_HISTORY: number = 7;
const ALLOWED_ORIGINS: string[] = ["https://gammac.vercel.app"];

let conversationHistory: {
  role: "system" | "user" | "assistant";
  content: string;
  name?: string;
}[] = [
  {
    role: "system",
    content:
      "You are Gamma, a useful AI assistant created by Inggrit Setya Budi, a talented vocational school student who has a strong interest in AI and programming. Inggrit Setya Budi is passionate about exploring the world of artificial intelligence and coding, and is committed to developing skills in this field to create innovative solutions.",
  },
];

function addMessageToHistory(
  role: "system" | "user" | "assistant",
  content: string
) {
  conversationHistory.push({ role, content });
  if (conversationHistory.length > MAX_HISTORY) {
    conversationHistory.shift();
  }
}

export async function POST(req: NextRequest) {
  const referer = req.headers.get("Referer");
  const origin = req.headers.get("Origin");

  if (
    referer &&
    !ALLOWED_ORIGINS.some((origin) => referer.startsWith(origin))
  ) {
    return NextResponse.json({ error: "Unauthorized origin" }, { status: 403 });
  }
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return NextResponse.json({ error: "Unauthorized origin" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    addMessageToHistory("user", messages[0].content);

    const completion = await groq.chat.completions.create({
      messages: conversationHistory,
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
    });

    const aiResponse =
      completion.choices[0]?.message?.content ||
      "Sorry, I could not generate a response.";

    addMessageToHistory("assistant", aiResponse);

    return NextResponse.json({ response: aiResponse }, { status: 200 });
  } catch (error) {
    console.error("Error generating response:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  resetHistory();
  return NextResponse.json(
    { message: "Memori Percakapan berhasil dihapus" },
    { status: 200 }
  );
}

function resetHistory() {
  conversationHistory = [
    {
      role: "system",
      content:
        "You are Gamma, a useful AI assistant created by Inggrit Setya Budi, a talented vocational school student who has a strong interest in AI and programming. Inggrit Setya Budi is passionate about exploring the world of artificial intelligence and coding, and is committed to developing skills in this field to create innovative solutions.",
    },
  ];
}

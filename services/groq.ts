import Groq from "groq-sdk";
import { toast } from "react-toastify";

const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;

const groq = new Groq({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true,
});

const MAX_HISTORY: number = 7;

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
  if (conversationHistory.length >= MAX_HISTORY) {
    conversationHistory.shift();
  }
}

export async function generateResponse(prompt: string): Promise<string> {
  addMessageToHistory("user", prompt);

  try {
    const completion = await groq.chat.completions.create({
      messages: conversationHistory,
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
      stream: false,
    });

    const aiResponse =
      completion.choices[0]?.message?.content ||
      "Sorry, I could not generate a response.";

    addMessageToHistory("assistant", aiResponse);

    return aiResponse;
  } catch (error) {
    console.error("Error generating response:", error);
    throw new Error("Failed to generate response");
  }
}

export function resetHistory(): void {
  conversationHistory = [
    {
      role: "system",
      content:
        "You are Gamma, a useful AI assistant created by Inggrit Setya Budi, a talented vocational school student who has a strong interest in AI and programming. Inggrit Setya Budi is passionate about exploring the world of artificial intelligence and coding, and is committed to developing skills in this field to create innovative solutions.",
    },
  ];
  toast.success<string>("Berhasil! History telah direset");
}

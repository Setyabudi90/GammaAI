export async function generateResponse(prompt: string): Promise<string> {
  try {
    const response = await fetch("/api/gamma", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const errorMessage = `HTTP Error: ${response.status} - ${response.statusText}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    const data = await response.json();

    if (!data || !data.response) {
      throw new Error("Invalid response structure from API");
    }

    return data.response;
  } catch (error: any) {
    console.error("Error generating response:", error.message || error);
    throw new Error("Failed to generate response. Please try again later.");
  }
}

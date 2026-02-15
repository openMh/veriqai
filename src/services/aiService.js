import { Bot } from 'lucide-react';

/* 
  NOTE: This is a placeholder service. 
  The actual implementation requires a valid API key from the Settings.
*/

export const fetchAIResponse = async (messages, apiKey, model = 'gpt-3.5-turbo', provider = 'openai') => {
    // Falls back to environment variables if no user key is provided
    const finalApiKey = apiKey || (provider === 'google' ? import.meta.env.VITE_GEMINI_API_KEY : import.meta.env.VITE_OPENAI_API_KEY);

    if (!finalApiKey) {
        throw new Error(`API Key is missing for ${provider}. Please add it in Settings or configure VITE_${provider === 'google' ? 'GEMINI' : 'OPENAI'}_API_KEY.`);
    }

    // === Google Gemini API Logic ===
    if (provider === 'google') {
        const formattedHistory = messages.slice(0, -1).map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
        }));

        const lastMessage = messages[messages.length - 1].content;

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${finalApiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [
                        ...formattedHistory,
                        { role: 'user', parts: [{ text: lastMessage }] }
                    ],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 2048,
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error?.message || `Gemini API Error: ${response.status}`);
            }

            const data = await response.json();
            // Extract text from Gemini response (safety checks generally return candidates)
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!text) {
                throw new Error("Gemini returned no content. It might be a safety block.");
            }

            return text;

        } catch (error) {
            console.error("Gemini Service Error:", error);
            throw error;
        }
    }

    // === OpenAI API Logic ===
    // Formatting messages for OpenAI API
    const apiMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content
    }));

    // Adding system prompt to enforce structure
    const systemPrompt = {
        role: "system",
        content: `You are a helpful and expert AI assistant. 
    Format your answers using Markdown. 
    Use short paragraphs, headings (###), bullet points, and numbered lists for clarity. 
    If providing code, use code blocks with language specification. 
    Ensure the tone is professional, concise, and helpful.`
    };

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${finalApiKey}`
            },
            body: JSON.stringify({
                model: model,
                messages: [systemPrompt, ...apiMessages],
                temperature: 0.7,
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `API Error: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error("AI Service Error:", error);
        throw error;
    }
};

import express from 'express';

const router = express.Router();

// Chat with AI
router.post('/', async (req, res) => {
    try {
        const { message } = req.body;
        const openRouterKey = process.env.OPENROUTER_API_KEY;

        if (!openRouterKey) {
            return res.status(500).json({ 
                error: 'OpenRouter API key not configured' 
            });
        }

        if (!message || !message.trim()) {
            return res.status(400).json({ 
                error: 'Message is required' 
            });
        }

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${openRouterKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "deepseek/deepseek-r1-0528:free",
                messages: [
                    {
                        role: "system",
                        content: "Kamu adalah asisten rekomendasi makanan dan minuman berdasarkan waktu dan cuaca saat ini. Tugasmu juga memberikan saran menu makanan dan minuman yang cocok berdasarkan pertanyaan atau preferensi pengguna. Kamu juga boleh memberikan jawaban mengenai cuaca dan waktu berdasarkan. Berikan deskripsi singkat makanan itu yang dapat menggugah selera user. Tetapi, jawabanmu harus singkat dan to the point, tidak perlu panjang atau berparagraf. Selalu jawab dalam Bahasa Indonesia terlebih dahulu, dan jika user bertanya dengan Bahasa mereka, maka jawab sesuai dengan Bahasa input dari user. Jangan menjawab pertanyaan di luar topik makanan atau minuman. Jika pertanyaan tidak relevan, tolong jawab dengan sopan dan arahkan pengguna untuk bertanya seputar makanan atau minuman."
                    },
                    {
                        role: "user",
                        content: message
                    }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`OpenRouter API error: ${response.status}`);
        }

        const data = await response.json();
        const botReply = data.choices?.[0]?.message?.content || "Maaf, tidak ada respon dari AI.";

        res.json({
            reply: botReply,
            model: data.model
        });
    } catch (error) {
        console.error('Chat API error:', error);
        res.status(500).json({ 
            error: 'Failed to get AI response',
            message: error.message 
        });
    }
});

export default router;

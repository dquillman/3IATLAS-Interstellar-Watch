import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const app = express();
const PORT = 3001;

// Initialize OpenAI with API key from environment
const openai = new OpenAI({
    apiKey: process.env.VITE_API_KEY
});

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: '3I/ATLAS Backend API Running' });
});

// Mission briefing endpoint
app.post('/api/mission-briefing', async (req, res) => {
    try {
        const { realData, prompt, responseSchema } = req.body;

        if (!prompt || !responseSchema) {
            return res.status(400).json({
                error: 'Missing required fields: prompt and responseSchema'
            });
        }

        // Call OpenAI API
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'You are a precise scientific data analyst for space missions. You strictly adhere to factual data and never fabricate information.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            response_format: {
                type: 'json_schema',
                json_schema: {
                    name: 'mission_briefing',
                    strict: true,
                    schema: responseSchema
                }
            },
            temperature: 0.3,
        });

        const content = response.choices[0]?.message?.content;
        if (!content) {
            return res.status(500).json({
                error: 'No response content from OpenAI'
            });
        }

        const parsedResponse = JSON.parse(content);
        res.json(parsedResponse);

    } catch (error) {
        console.error('OpenAI API error:', error);

        // Handle specific OpenAI API errors
        if (error instanceof OpenAI.APIError) {
            if (error.status === 401) {
                return res.status(401).json({
                    error: 'Invalid API key. Please check your VITE_API_KEY in .env.local'
                });
            } else if (error.status === 429) {
                return res.status(429).json({
                    error: 'Rate limit exceeded. Please try again in a few moments.'
                });
            } else if (error.status === 500 || error.status === 503) {
                return res.status(503).json({
                    error: 'OpenAI service temporarily unavailable. Please try again later.'
                });
            } else if (error.status === 400) {
                return res.status(400).json({
                    error: 'Invalid request to OpenAI API.'
                });
            }
        }

        // Generic error response
        res.status(500).json({
            error: `Failed to generate mission briefing: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 3I/ATLAS Backend API running on http://localhost:${PORT}`);
    console.log(`✓ Health check: http://localhost:${PORT}/api/health`);
    console.log(`✓ Mission briefing: POST http://localhost:${PORT}/api/mission-briefing`);
});

import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module dirname workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize OpenAI with API key from environment
const openai = new OpenAI({
    apiKey: process.env.VITE_API_KEY
});

// Simple in-memory cache for API responses
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

function getCachedData(key) {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        console.log(`[Cache] HIT for ${key}`);
        return cached.data;
    }
    console.log(`[Cache] MISS for ${key}`);
    return null;
}

function setCachedData(key, data) {
    cache.set(key, {
        data,
        timestamp: Date.now()
    });
    console.log(`[Cache] SET ${key}`);
}

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from dist folder (for production)
app.use(express.static(path.join(__dirname, 'dist')));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: '3I/ATLAS Backend API Running' });
});

// JPL Horizons API endpoint - Fetch live ephemeris data
app.get('/api/jpl-horizons/:objectId', async (req, res) => {
    try {
        const { objectId } = req.params;
        const { startTime, stopTime, stepSize = '1d' } = req.query;

        const cacheKey = `jpl-${objectId}-${startTime}-${stopTime}-${stepSize}`;

        // Check cache first
        const cachedData = getCachedData(cacheKey);
        if (cachedData) {
            return res.json({
                ...cachedData,
                cached: true
            });
        }

        // Build JPL Horizons API query
        // Note: 3I/ATLAS is fictional/future object, so we'll use C/2019 Q4 (Borisov - actual 2I) as reference
        // In production, this would query the actual object once it's in the database
        const actualObjectId = objectId === '3I' ? 'C/2019 Q4' : objectId; // Use 2I/Borisov as proxy for now

        const params = new URLSearchParams({
            format: 'text', // JPL Horizons returns text format by default
            COMMAND: `'${actualObjectId}'`,
            OBJ_DATA: 'YES',
            MAKE_EPHEM: 'YES',
            EPHEM_TYPE: 'OBSERVER',
            CENTER: '500@399', // Earth geocenter
            START_TIME: startTime || new Date().toISOString().split('T')[0],
            STOP_TIME: stopTime || new Date(Date.now() + 7*24*60*60*1000).toISOString().split('T')[0],
            STEP_SIZE: stepSize,
            QUANTITIES: '1,9,20', // Astrometric RA/DEC, range, delta
            CSV_FORMAT: 'YES'
        });

        const horizonsUrl = `https://ssd.jpl.nasa.gov/api/horizons.api?${params.toString()}`;

        console.log(`[JPL Horizons] Fetching data for ${objectId} (using ${actualObjectId})...`);
        console.log(`[JPL Horizons] URL: ${horizonsUrl}`);
        const response = await fetch(horizonsUrl);

        if (!response.ok) {
            throw new Error(`JPL Horizons API returned ${response.status}: ${response.statusText}`);
        }

        const data = await response.text(); // JPL returns text, not JSON
        const result = {
            source: 'NASA JPL Horizons',
            timestamp: new Date().toISOString(),
            objectId,
            actualObjectUsed: actualObjectId,
            data,
            cached: false
        };

        // Cache the result
        setCachedData(cacheKey, result);

        res.json(result);

    } catch (error) {
        console.error('[JPL Horizons] Error:', error);
        res.status(500).json({
            error: `Failed to fetch JPL Horizons data: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
    }
});

// JPL Horizons API - Get heliocentric positions for solar system map
app.get('/api/solar-system-positions', async (req, res) => {
    try {
        const cacheKey = 'solar-system-positions';

        // Check cache first
        const cachedData = getCachedData(cacheKey);
        if (cachedData) {
            return res.json({
                ...cachedData,
                cached: true
            });
        }

        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];

        // Fetch positions for Earth, Mars, and 3I/ATLAS
        const objects = [
            { id: 'Earth', code: '399' },
            { id: 'Mars', code: '499' },
            { id: '3I/ATLAS', code: 'C/2025 N1' }
        ];

        const positions = {};

        for (const obj of objects) {
            const params = new URLSearchParams({
                format: 'text',
                COMMAND: obj.code,
                OBJ_DATA: 'NO',
                MAKE_EPHEM: 'YES',
                EPHEM_TYPE: 'VECTORS',
                CENTER: '500@10', // Sun center
                START_TIME: dateStr,
                STOP_TIME: dateStr,
                STEP_SIZE: '1d',
                VEC_TABLE: '2', // Position and velocity
                OUT_UNITS: 'AU-D', // AU and days
                CSV_FORMAT: 'YES',
                VEC_LABELS: 'YES'
            });

            const url = `https://ssd.jpl.nasa.gov/api/horizons.api?${params.toString()}`;
            console.log(`[Solar System] Fetching ${obj.id} position...`);

            const response = await fetch(url);
            if (response.ok) {
                const data = await response.text();

                // Parse the vector data (X, Y, Z coordinates)
                const lines = data.split('\n');
                const dataLine = lines.find(line => line.trim().startsWith(dateStr.replace(/-/g, '-')));

                if (dataLine) {
                    const parts = dataLine.split(',').map(s => s.trim());
                    if (parts.length >= 6) {
                        positions[obj.id] = {
                            x: parseFloat(parts[2]),
                            y: parseFloat(parts[3]),
                            z: parseFloat(parts[4]),
                            date: dateStr
                        };
                    }
                }
            }
        }

        const result = {
            source: 'NASA JPL Horizons',
            timestamp: now.toISOString(),
            positions,
            cached: false
        };

        // Cache the result
        setCachedData(cacheKey, result);

        res.json(result);

    } catch (error) {
        console.error('[Solar System] Error:', error);
        res.status(500).json({
            error: `Failed to fetch solar system positions: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
    }
});

// Minor Planet Center API endpoint - Fetch live observations
app.get('/api/mpc-observations/:designation', async (req, res) => {
    try {
        const { designation } = req.params;

        const cacheKey = `mpc-${designation}`;

        // Check cache first
        const cachedData = getCachedData(cacheKey);
        if (cachedData) {
            return res.json({
                ...cachedData,
                cached: true
            });
        }

        console.log(`[MPC] Fetching observations for ${designation}...`);
        const response = await fetch('https://data.minorplanetcenter.net/api/get-obs', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                desigs: [designation],
                output_format: ['JSON']
            })
        });

        if (!response.ok) {
            throw new Error(`MPC API returned ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        const result = {
            source: 'Minor Planet Center',
            timestamp: new Date().toISOString(),
            designation,
            data,
            cached: false
        };

        // Cache the result
        setCachedData(cacheKey, result);

        res.json(result);

    } catch (error) {
        console.error('[MPC] Error:', error);
        res.status(500).json({
            error: `Failed to fetch MPC observations: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
    }
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

// Catch-all route to serve index.html for client-side routing
// Use middleware instead of wildcard route
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 3I/ATLAS Backend API running on http://0.0.0.0:${PORT}`);
    console.log(`✓ Health check: http://0.0.0.0:${PORT}/api/health`);
    console.log(`✓ Mission briefing: POST http://0.0.0.0:${PORT}/api/mission-briefing`);
    console.log(`✓ Frontend: http://0.0.0.0:${PORT}`);
});

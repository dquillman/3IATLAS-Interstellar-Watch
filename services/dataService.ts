import OpenAI from 'openai';
import { SummaryData, Observation, Anomaly, ConfidenceLevel, AnomalyStatus, FutureObservation, FutureStatus } from '../types';

/**
 * 3I/ATLAS DATA SERVICE
 *
 * This service provides VERIFIED REAL DATA about the interstellar object 3I/ATLAS
 * from official astronomical sources.
 *
 * PRIMARY DATA SOURCES:
 * 1. ESA (European Space Agency) Planetary Defence Office
 *    - Official announcement: July 3, 2025
 *    - URL: https://www.esa.int/Space_Safety/Planetary_Defence
 *
 * 2. NASA JPL Horizons System
 *    - API: https://ssd.jpl.nasa.gov/api/horizons.api
 *    - Provides orbital elements and ephemeris data
 *
 * 3. ATLAS Survey (Asteroid Terrestrial-impact Last Alert System)
 *    - Discovery site: Río Hurtado, Chile
 *    - Discovery date: July 1, 2025
 *
 * 4. Minor Planet Center (MPC)
 *    - Aggregates observation data from worldwide network
 *
 * CONFIRMED FACTS ABOUT 3I/ATLAS:
 * - Third confirmed interstellar object (after 1I/'Oumuamua and 2I/Borisov)
 * - Discovered: July 1, 2025
 * - Classification: Active comet (capable of sublimation)
 * - Size: Up to 20 kilometers in diameter
 * - Velocity: ~60 km/s relative to the Sun
 * - Closest approach: Late October 2025 (inside Mars's orbit)
 * - Distance at closest approach: 240 million km from Earth (1.5+ AU)
 * - Solar conjunction: Hidden behind Sun at closest approach
 * - Reappearance: Expected early December 2025
 *
 * This service attempts to fetch live data from JPL Horizons API and combines it
 * with verified ESA observations to provide accurate, real-time mission briefings.
 */

// Real data about 3I/ATLAS from official sources ONLY
// ALL data below is sourced from NASA, ESA, Hubble, MPC official statements
const REAL_3I_ATLAS_DATA = {
    "object": {
        "shortname": "3I/ATLAS",
        "fullname": "3I/ATLAS (C/2025 N1)",
        "discovery_source": "ATLAS Survey (Río Hurtado, Chile)",
        "discovery_date": "2025-07-01",
        "orbit_class": {
            "name": "Hyperbolic (Interstellar)",
            "code": "I",
            "eccentricity": "6.14",
            "inclination_degrees": "175.1"
        },
        "classification": "Active comet",
    },
    "physical_characteristics": {
        "diameter_upper_limit_km": "5.6",
        "diameter_lower_limit_km": "0.44",
        "source": "Hubble Space Telescope observations Aug 20, 2025",
        "velocity_mph": "130000",
        "velocity_kph": "209000",
        "notes": "Highest velocity ever recorded for a solar system visitor"
    },
    "orbit": {
        "perihelion_date": "2025-10-29",
        "perihelion_distance_au": "1.36",
        "perihelion_distance_million_km": "203",
        "closest_to_earth_date": "2025-12-19",
        "closest_to_earth_distance_million_km": "270",
        "closest_to_earth_distance_au": "1.8",
        "distance_from_sun_july_3_million_km": "670",
        "notes": "Hidden behind Sun during perihelion, reappearing early December 2025"
    },
    "threat_assessment": {
        "threat_to_earth": "No threat",
        "minimum_distance_au": "1.6",
        "minimum_distance_million_km": "240",
        "source": "NASA Planetary Defense official statement"
    },
    "natural_origin": {
        "confirmed_natural": true,
        "statement": "Active comet and newly identified interstellar object from outside our Solar System",
        "source": "ESA official statement"
    },
    "observation_network": {
        "coordinated_by": "ESA Planetary Defence Office",
        "telescopes": ["Hawaii", "Chile", "Australia"],
        "activities": "Pre-discovery observations back to June 14, 2025"
    },
    "data_sources": [
        "ESA Planetary Defence Office",
        "ATLAS Survey",
        "NASA JPL Horizons",
        "Minor Planet Center",
        "Hubble Space Telescope",
        "James Webb Space Telescope"
    ]
};

// NOTE: JPL Horizons API cannot be called directly from browser due to CORS restrictions
// For production, this would require a backend proxy server
// Currently using verified ESA observational data which is sufficient for mission briefings

// Backend API configuration
const USE_BACKEND = import.meta.env.VITE_USE_BACKEND === 'true';
// Use environment variable if set, otherwise use window.location.origin in browser, fallback to localhost
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001');

console.log('[DataService] Configuration:', {
    USE_BACKEND,
    BACKEND_URL,
    hasApiKey: !!import.meta.env.VITE_API_KEY,
    rawUseBackend: import.meta.env.VITE_USE_BACKEND
});

// Initialize OpenAI (only if not using backend)
const openai = USE_BACKEND ? null : new OpenAI({
    apiKey: import.meta.env.VITE_API_KEY, // Vite requires VITE_ prefix for env vars
    dangerouslyAllowBrowser: true // Required for client-side usage in Vite
});

// Define the JSON schema for OpenAI's response to ensure structured output
const responseSchema = {
    type: "object",
    properties: {
        summaryData: {
            type: "object",
            properties: {
                lastUpdateTimestamp: { type: "string" },
                currentPhase: { type: "string" },
                isNatural: {
                    type: "object",
                    properties: {
                        status: { type: "boolean" },
                        note: { type: "string" },
                    },
                    required: ["status", "note"],
                    additionalProperties: false
                },
                maneuverEvidence: {
                    type: "object",
                    properties: {
                        status: { type: "boolean" },
                        note: { type: "string" },
                    },
                    required: ["status", "note"],
                    additionalProperties: false
                },
                threatLevel: { type: "string" },
                threatLevelReason: { type: "string" },
                assessment: { type: "string" },
            },
            required: ['lastUpdateTimestamp', 'currentPhase', 'isNatural', 'maneuverEvidence', 'threatLevel', 'threatLevelReason', 'assessment'],
            additionalProperties: false
        },
        observationData: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    id: { type: "number" },
                    dateObserved: { type: "string" },
                    observatory: { type: "string" },
                    observationType: { type: "string" },
                    keyFinding: { type: "string" },
                    confidence: { type: "string", enum: Object.values(ConfidenceLevel) },
                },
                required: ['id', 'dateObserved', 'observatory', 'observationType', 'keyFinding', 'confidence'],
                additionalProperties: false
            }
        },
        anomalyData: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    id: { type: "number" },
                    name: { type: "string" },
                    description: { type: "string" },
                    status: { type: "string", enum: Object.values(AnomalyStatus) },
                },
                required: ['id', 'name', 'description', 'status'],
                additionalProperties: false
            }
        },
        futureObservationData: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    id: { type: "number" },
                    mission: { type: "string" },
                    objective: { type: "string" },
                    windowStart: { type: "string" },
                    windowEnd: { type: "string" },
                    status: { type: "string", enum: Object.values(FutureStatus) },
                },
                required: ['id', 'mission', 'objective', 'windowStart', 'windowEnd', 'status'],
                additionalProperties: false
            }
        }
    },
    required: ['summaryData', 'observationData', 'anomalyData', 'futureObservationData'],
    additionalProperties: false
};

export const fetchData = async (): Promise<{ summaryData: SummaryData; observationData: Observation[]; anomalyData: Anomaly[]; futureObservationData: FutureObservation[] }> => {
    // Fetch LIVE data from astronomical sources
    let liveData = { ...REAL_3I_ATLAS_DATA };
    let jplData = null;
    let mpcData = null;

    if (USE_BACKEND) {
        try {
            // Fetch live JPL Horizons data for 3I/ATLAS
            console.log('[DataService] Fetching live JPL Horizons data...');
            const jplResponse = await fetch(`${BACKEND_URL}/api/jpl-horizons/3I`, {
                method: 'GET',
            }).catch(err => {
                console.warn('[DataService] JPL Horizons fetch failed, using baseline data:', err);
                return null;
            });

            if (jplResponse && jplResponse.ok) {
                jplData = await jplResponse.json();
                console.log('[DataService] Successfully fetched live JPL data');
            }

            // Fetch live MPC observations for 3I/ATLAS
            console.log('[DataService] Fetching live MPC observations...');
            const mpcResponse = await fetch(`${BACKEND_URL}/api/mpc-observations/3I`, {
                method: 'GET',
            }).catch(err => {
                console.warn('[DataService] MPC fetch failed, using baseline data:', err);
                return null;
            });

            if (mpcResponse && mpcResponse.ok) {
                mpcData = await mpcResponse.json();
                console.log('[DataService] Successfully fetched live MPC data');
            }

            // Merge live data with baseline data
            if (jplData || mpcData) {
                liveData = {
                    ...liveData,
                    live_data_sources: {
                        jpl_horizons: jplData ? {
                            timestamp: jplData.timestamp,
                            available: true,
                            data: jplData.data
                        } : { available: false },
                        mpc_observations: mpcData ? {
                            timestamp: mpcData.timestamp,
                            available: true,
                            data: mpcData.data
                        } : { available: false }
                    }
                };
            }

            // Call AI briefing with live + baseline data
            const prompt = buildPrompt(liveData);

            const response = await fetch(`${BACKEND_URL}/api/mission-briefing`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    realData: liveData,
                    prompt,
                    responseSchema
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error calling backend API:", error);
            throw new Error(
                `Failed to fetch telemetry: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
        }
    }

    // Original client-side OpenAI call (fallback)
    const prompt = buildPrompt(liveData);
    return await callOpenAI(prompt);
};

function buildPrompt(realData: any): string {
    const hasLiveData = realData.live_data_sources?.jpl_horizons?.available || realData.live_data_sources?.mpc_observations?.available;

    return `
        You are the primary analysis AI for the 'Interstellar Watch' program. Your task is to provide a real-time analysis and mission briefing for the interstellar object 3I/ATLAS based STRICTLY on verified real-world data from official sources.

        CRITICAL INSTRUCTIONS:
        - Use ONLY the factual data provided below from ESA, NASA, and ATLAS Survey
        - DO NOT invent or fabricate any observations, dates, or measurements
        - If specific technical data is not available, acknowledge the limitation
        - All dates, measurements, and observations must match the verified sources
        ${hasLiveData ? '- LIVE DATA IS AVAILABLE: Prioritize live JPL Horizons and MPC data over baseline data where applicable' : '- Using baseline reference data (live feeds currently unavailable)'}

        Current Date for reference: ${new Date().toISOString()}

        VERIFIED REAL DATA FROM OFFICIAL SOURCES:
        ${JSON.stringify(realData, null, 2)}

        Instructions for generating the briefing:

        1.  **summaryData**:
            *   'lastUpdateTimestamp': Use the current ISO date.
            *   'currentPhase': Determine based on current date vs perihelion_date (2025-10-29): Use 'Pre-Perihelion' if before, 'Perihelion' if within 48 hours, 'Post-Perihelion' if after.
            *   'isNatural.status': true
            *   'isNatural.note': Use EXACT quote from data: "Active comet and newly identified interstellar object from outside our Solar System" (Source: ESA official statement)
            *   'maneuverEvidence.status': false
            *   'maneuverEvidence.note': 'Confirmed hyperbolic trajectory with eccentricity 6.14 and inclination 175.1° consistent with natural interstellar origin. No propulsion detected.'
            *   'threatLevel': Use official assessment ONLY:
                - 'Nominal' - Object poses no threat to Earth per NASA Planetary Defense
                - Closest approach: 240 million km (1.6 AU) - far beyond danger threshold
            *   'threatLevelReason': Use EXACT official statement: "Comet 3I/ATLAS poses no threat to Earth. Will remain at distance of at least 1.6 AU (240 million km). Perihelion Oct 29, 2025 at 1.36 AU inside Mars orbit. Closest to Earth Dec 19, 2025 at 270 million km." (Source: NASA official statement)
            *   'assessment': Use ONLY these verified facts: "Discovered July 1, 2025 by ATLAS Survey Chile. Third confirmed interstellar object (after 1I/'Oumuamua and 2I/Borisov). Diameter: 0.44-5.6 km per Hubble Aug 20, 2025 observations. Velocity: 209,000 kph (highest ever recorded). Hyperbolic orbit (e=6.14) confirms interstellar origin. Perihelion Oct 29, 2025. No threat to Earth."

        2.  **observationData**:
            *   Include ONLY these officially documented observations with exact dates and sources:
            *   '2025-06-14' - 'Zwicky Transient Facility' - 'Astrometry' - 'Pre-discovery observations (earliest detection)' - Confidence: 'Confirmed'
            *   '2025-07-01' - 'ATLAS Survey (Río Hurtado, Chile)' - 'Discovery' - 'Official discovery and first report to Minor Planet Center' - Confidence: 'Confirmed'
            *   '2025-07-02' - 'Nordic Optical Telescope' - 'Visual Imaging' - 'Confirmed active coma and diffuse appearance (Jewitt & Luu)' - Confidence: 'Confirmed'
            *   '2025-07-03' - 'ESA Ground Network' - 'Tracking' - '670 million km from Sun. ESA begins coordinated observations (Hawaii, Chile, Australia)' - Confidence: 'Confirmed'
            *   '2025-07-21' - 'Hubble Space Telescope' - 'Imaging' - 'Captured teardrop dust cocoon at 277 million miles from Earth' - Confidence: 'Confirmed'
            *   '2025-08-06' - 'James Webb Space Telescope' - 'NIR Spectroscopy' - 'Detected CO₂ dominated coma with sunward outgassing' - Confidence: 'Confirmed'
            *   '2025-08-20' - 'Hubble Space Telescope' - 'Size Analysis' - 'Diameter estimate: 0.44-5.6 km' - Confidence: 'Confirmed'
            *   '2025-10-03' - 'ESA Mars Express & ExoMars TGO' - 'Remote Observation' - 'Observed from Mars orbit at 30 million km distance' - Confidence: 'Confirmed'
            *   '2025-10-29' - 'Perihelion' - 'Trajectory Milestone' - 'Closest approach to Sun: 203 million km (1.36 AU)' - Confidence: 'Confirmed'
            *   Give each a unique ID starting from 1
            *   Sort chronologically by dateObserved

        3.  **anomalyData**:
            *   Based ONLY on verified observations from NASA, ESA, Hubble, JWST, and MPC, include these REAL anomalies:
            *   'Hyperbolic Trajectory' with status 'Confirmed' - Highly eccentric hyperbolic orbit (e ~ 6.0) confirmed by Minor Planet Center. Definitively interstellar origin
            *   'Unusual Tail Geometry' with status 'Confirmed' - Hubble and JWST observations show dust plume in sunward direction (anti-solar), inconsistent with typical radiation pressure tail. JWST reveals CO₂ dominated coma with enhanced sunward outgassing
            *   'Teardrop Dust Cocoon' with status 'Confirmed' - Hubble captured teardrop-shaped cocoon of dust coming off nucleus on July 21, 2025
            *   'Size Uncertainty' with status 'Watch' - Hubble estimates upper limit 5.6 km diameter, could be as small as 320 meters. Nucleus currently obscured by coma
            *   'Ancient Origin' with status 'Under Investigation' - ESA trajectory analysis suggests possibly 3 billion years older than Solar System itself
            *   DO NOT invent additional anomalies beyond these verified observations from official sources
            *   Give each a unique ID starting from 1

        4.  **futureObservationData**:
            *   ONLY include officially announced observations from NASA/ESA sources:
            *   ESA Juice mission: November 2025 observations with cameras, spectrometers, and particle sensor. Data expected February 2026. Status: 'Scheduled'
            *   NASA states multiple assets (Hubble, Webb, TESS, Swift, SPHEREx, Mars rovers, etc.) are "planning to gather observations" but NO specific dates have been officially published. DO NOT invent observation windows.
            *   If no specific observation schedule is officially published, return EMPTY array or use generic "Ongoing Monitoring" with status 'Planned' and note "Specific observation schedules not yet published by NASA/ESA"
            *   Give each a unique ID starting from 1
            *   CRITICAL: DO NOT fabricate observation windows or dates. Only use officially announced information.

        Remember: This is REAL data about a REAL interstellar object. Accuracy and factual integrity are paramount.
    `;
}

async function callOpenAI(prompt: string): Promise<{ summaryData: SummaryData; observationData: Observation[]; anomalyData: Anomaly[]; futureObservationData: FutureObservation[] }> {
    if (!openai) {
        throw new Error("OpenAI client not initialized. Backend mode is enabled.");
    }

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini', // Fast and cost-effective, or use 'gpt-4o' for better quality
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
            temperature: 0.3, // Lower temperature for more factual, consistent outputs
        });

        const content = response.choices[0]?.message?.content;
        if (!content) {
            throw new Error("No response content from OpenAI");
        }

        const parsedResponse = JSON.parse(content);
        return parsedResponse;
    } catch (error) {
        console.error("Error calling OpenAI API:", error);

        // Handle specific OpenAI API errors
        if (error instanceof OpenAI.APIError) {
            if (error.status === 401) {
                throw new Error("Invalid API key. Please check your VITE_API_KEY in .env.local");
            } else if (error.status === 429) {
                throw new Error("Rate limit exceeded. Please try again in a few moments.");
            } else if (error.status === 500 || error.status === 503) {
                throw new Error("OpenAI service temporarily unavailable. Please try again later.");
            } else if (error.status === 400) {
                throw new Error("Invalid request to OpenAI API. Please contact support.");
            }
        }

        // Handle network errors
        if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new Error("Network error. Please check your internet connection.");
        }

        // Generic error fallback
        throw new Error(
            `Failed to generate mission briefing: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
    }
}
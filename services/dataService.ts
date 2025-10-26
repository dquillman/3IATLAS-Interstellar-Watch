import { GoogleGenAI, Type } from "@google/genai";
import { SummaryData, Observation, Anomaly, ConfidenceLevel, AnomalyStatus, FutureObservation, FutureStatus } from '../types';

// A static data packet representing the latest telemetry for the 3I/ATLAS mission.
// This data is processed by the Gemini API to generate the live mission briefing.
const atlasMissionData = {
    "object": {
        "shortname": "3I/ATLAS",
        "fullname": "3I/2025 A1 (ATLAS)",
        "discovery_source": "ATLAS Survey",
        "orbit_class": {
            "name": "Hyperbolic",
            "code": "I"
        },
        "first_obs": "2025-03-15",
        "n_obs_used": 42,
    },
    "orbit": {
        "elements": [{
            "name": "e",
            "label": "Eccentricity",
            "value": "1.85" // Strongly hyperbolic, confirming interstellar origin
        }, {
            "name": "q",
            "label": "Perihelion Distance",
            "units": "AU",
            "value": "1.1"
        }, {
            "name": "i",
            "label": "Inclination",
            "units": "deg",
            "value": "95.2"
        }, {
            "name": "tp_cal",
            "label": "Time of Perihelion Passage",
            "value": "2026-08-21"
        }],
        "equinox": "J2000",
        "conjunction_periods": {
            "entry_date": "2026-06-20",
            "exit_date": "2026-10-25"
        }
    },
    "phys_par": [{
        "name": "H",
        "value": "20.5",
        "units": "mag",
        "notes": "Absolute magnitude suggests a relatively small body."
    },{
        "name": "other",
        "notes": "No coma detected at current distance. Spectroscopic analysis pending."
    },{
        "name": "other",
        "notes": "Minor, periodic fluctuations in light curve observed. Cause under investigation."
    }],
    "signature": {
        "version": "1.0",
        "source": "Interstellar Watch Program Telemetry Packet"
    }
};

let currentObservationCount = atlasMissionData.object.n_obs_used;

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Define the JSON schema for Gemini's response to ensure structured output
const responseSchema = {
    type: Type.OBJECT,
    properties: {
        summaryData: {
            type: Type.OBJECT,
            properties: {
                lastUpdateTimestamp: { type: Type.STRING },
                currentPhase: { type: Type.STRING },
                isNatural: { 
                    type: Type.OBJECT,
                    properties: {
                        status: { type: Type.BOOLEAN },
                        note: { type: Type.STRING },
                    }
                },
                maneuverEvidence: {
                    type: Type.OBJECT,
                    properties: {
                        status: { type: Type.BOOLEAN },
                        note: { type: Type.STRING },
                    }
                },
                threatLevel: { type: Type.STRING },
                assessment: { type: Type.STRING },
            },
            required: ['lastUpdateTimestamp', 'currentPhase', 'isNatural', 'maneuverEvidence', 'threatLevel', 'assessment']
        },
        observationData: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.NUMBER },
                    dateObserved: { type: Type.STRING },
                    observatory: { type: Type.STRING },
                    observationType: { type: Type.STRING },
                    keyFinding: { type: Type.STRING },
                    confidence: { type: Type.STRING, enum: Object.values(ConfidenceLevel) },
                },
                required: ['id', 'dateObserved', 'observatory', 'observationType', 'keyFinding', 'confidence']
            }
        },
        anomalyData: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.NUMBER },
                    name: { type: Type.STRING },
                    description: { type: Type.STRING },
                    status: { type: Type.STRING, enum: Object.values(AnomalyStatus) },
                },
                required: ['id', 'name', 'description', 'status']
            }
        },
        futureObservationData: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.NUMBER },
                    mission: { type: Type.STRING },
                    objective: { type: Type.STRING },
                    windowStart: { type: Type.STRING },
                    windowEnd: { type: Type.STRING },
                    status: { type: Type.STRING, enum: Object.values(FutureStatus) },
                },
                required: ['id', 'mission', 'objective', 'windowStart', 'windowEnd', 'status']
            }
        }
    },
    required: ['summaryData', 'observationData', 'anomalyData', 'futureObservationData']
};

export const fetchData = async (): Promise<{ summaryData: SummaryData; observationData: Observation[]; anomalyData: Anomaly[]; futureObservationData: FutureObservation[] }> => {
    // Simulate receiving a new telemetry packet by incrementing the observation count
    currentObservationCount += Math.floor(Math.random() * 3) + 1;
    const updatedData = JSON.parse(JSON.stringify(atlasMissionData));
    updatedData.object.n_obs_used = currentObservationCount;


    const prompt = `
        You are the primary analysis AI for the 'Interstellar Watch' program. Your task is to provide a real-time analysis and mission briefing for the interstellar object 3I/ATLAS. Your analysis must be based *only* on the latest telemetry packet provided below. Return ONLY the JSON object defined in the schema.

        Current Date for reference: ${new Date().toISOString()}

        Latest Telemetry Packet:
        ${JSON.stringify(updatedData, null, 2)}

        Instructions:
        1.  **summaryData**:
            *   'lastUpdateTimestamp': Use the current ISO date.
            *   'currentPhase': Based on the reference date and the perihelion date ('tp_cal'), determine the current phase. It is currently 'Pre-Perihelion'.
            *   'isNatural.status': true. 'isNatural.note': 'Current data is consistent with a natural object. Monitoring key indicators.'
            *   'maneuverEvidence.status': false. 'maneuverEvidence.note': 'No non-gravitational acceleration detected beyond expected outgassing limits.'
            *   'threatLevel': 'Elevated'. This is the standing threat level for any high-velocity interstellar object on a close approach.
            *   'assessment': Write a concise, professional assessment. Start with "3I/ATLAS's trajectory remains consistent with a natural interstellar object." Mention monitoring for deviations is ongoing.

        2.  **observationData**:
            *   Create 5 key timeline events based on the telemetry.
            *   One entry must be its discovery on '2025-03-15' by 'ATLAS Survey'.
            *   Another entry should be for 'Trajectory Confirmation', confirming its interstellar origin. Use date '2025-04-01' and source 'ESA Gaia'.
            *   A third entry should be for 'Light Curve Analysis', noting the minor fluctuations. Use a recent plausible date and 'Hubble Space Telescope'.
            *   Create an entry for the start of the solar conjunction. Use the 'entry_date' from the 'conjunction_periods' object. The source should be 'Trajectory Analysis' and the finding 'Solar Conjunction Start: Object unobservable'.
            *   Create an entry for the end of the solar conjunction. Use the 'exit_date' from the 'conjunction_periods' object. The source should be 'Trajectory Analysis' and the finding 'Solar Conjunction End: Object returns to observability'.
            *   Set 'confidence' to 'High' or 'Confirmed'.
            *   Give each a unique ID starting from 1.
            *   Sort the final observationData array by 'dateObserved' chronologically.

        3.  **anomalyData**:
            *   List anomalies being monitored.
            *   Include: 'Light Curve Variations' with status 'Watch', describing it as minor but periodic, cause TBD.
            *   Include: 'Radio Silence' with status 'Normal', describing active listening with no emission detections.
            *   Include: 'High-Inclination Orbit' with status 'Watch', noting its unusual path relative to the solar plane.
            *   Give each a unique ID starting from 1.
        
        4.  **futureObservationData**:
            *   Create 2-3 scheduled mission directives.
            *   One must be 'James Webb Space Telescope' for 'Spectroscopic Analysis of Coma' to search for complex molecules, with a window of '2026-01-15' to '2026-02-15' and status 'Scheduled'.
            *   Another should be 'Vera C. Rubin Observatory' for 'Post-Perihelion Monitoring' to track its outbound trajectory, with a window of '2027-03-01' to '2027-09-01' and status 'Planned'.
            *   Give each a unique ID starting from 1.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: responseSchema,
            },
        });

        const parsedResponse = JSON.parse(response.text);
        return parsedResponse;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to generate mission briefing with AI.");
    }
};
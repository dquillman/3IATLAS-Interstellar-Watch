# 3I/ATLAS Data Sources - Verification Guide

This document lists all official sources for 3I/ATLAS data used in this application.

## Real Data Sources

**THIS APP USES REAL API CALLS** to official astronomical data sources:

✅ **NASA JPL Horizons API** - Live API calls for orbital elements and ephemeris data
✅ **Minor Planet Center (MPC) API** - Live API calls for observation data
✅ **Real Orbital Mechanics Calculations** - Positions calculated using verified orbital parameters when API data unavailable
✅ **Backend Server** - Proxies API calls to avoid CORS restrictions

The app makes **REAL API calls** on every data refresh. If the APIs are unavailable or 3I/ATLAS is not yet in the databases, the app uses calculated positions based on verified orbital parameters using real orbital mechanics formulas.

---

## Official Data Sources

### 1. ESA (European Space Agency) - PRIMARY SOURCE

**Official Announcement:** Published July 3, 2025

**URL:** https://www.esa.int/Space_Safety/Planetary_Defence/ESA_tracks_rare_interstellar_comet

**Verified Information:**
- Discovery Date: July 1, 2025
- Discovery Location: ATLAS telescope, Río Hurtado, Chile
- Classification: Third confirmed interstellar object
- Type: Active comet (capable of sublimation)
- Size: Up to 20 kilometers diameter
- Velocity: ~60 km/s relative to the Sun
- Distance (July 3, 2025): 670 million km from Sun
- Closest Approach: Late October 2025
- Closest Distance: 240 million km from Earth (1.5+ AU)
- Path: Inside Mars's orbit
- Solar Conjunction: Hidden behind Sun during closest approach
- Reappearance: Expected early December 2025
- Observation Network: Telescopes in Hawaii, Chile, and Australia
- Coordinating Agency: ESA Planetary Defence Office

### 2. NASA JPL Horizons System

**URL:** https://ssd.jpl.nasa.gov/horizons/

**API Endpoint:** https://ssd.jpl.nasa.gov/api/horizons.api

**API Documentation:** https://ssd-api.jpl.nasa.gov/doc/horizons.html

**Direct Query URLs (Real API Calls):**
- Base API: `https://ssd.jpl.nasa.gov/api/horizons.api`
- Example query for 3I/ATLAS: `https://ssd.jpl.nasa.gov/api/horizons.api?format=text&COMMAND='DES=3I;'&OBJ_DATA=YES&MAKE_EPHEM=YES`
- Web Interface: https://ssd.jpl.nasa.gov/horizons/app.html

**What We Query:**
- Orbital elements (eccentricity, inclination, perihelion distance)
- Ephemeris data (position over time)
- Velocity vectors

**Implementation:** The app makes **REAL API CALLS** to JPL Horizons on each update via the backend server. The app tries multiple designation variations (3I, 3I/ATLAS, C/2025 N1, etc.) to find the most recent data. If the API is unavailable or 3I/ATLAS is not yet cataloged, it calculates positions using real orbital mechanics based on verified parameters.

### 3. ATLAS Survey (Asteroid Terrestrial-impact Last Alert System)

**Discovery Telescope:** Río Hurtado, Chile

**Discovery Date:** July 1, 2025

**About ATLAS:** Sky survey system designed to detect near-Earth objects and now credited with discovering the third interstellar visitor.

### 4. Minor Planet Center (MPC)

**URL:** https://www.minorplanetcenter.net/

**API Endpoint:** https://data.minorplanetcenter.net/api/get-obs

**Direct Query URLs (Real API Calls):**
- API Base: `https://data.minorplanetcenter.net/api/get-obs`
- Database Search: https://www.minorplanetcenter.net/db_search
- Observation Data: https://www.minorplanetcenter.net/iau/mpc.html

**Purpose:** Aggregates observation data from the worldwide astronomical community

**Database:** Central repository for all small body observations

**Implementation:** The app makes **REAL API CALLS** to MPC on each update, trying multiple designation variations to find the most recent observation data for 3I/ATLAS.

---

## Data Integrity Guarantee

### What This App Does:

✅ Makes **REAL API CALLS** to NASA JPL Horizons API (via backend server)

✅ Makes **REAL API CALLS** to Minor Planet Center API (via backend server)

✅ Uses **REAL orbital mechanics calculations** when API data unavailable

✅ Uses OpenAI (GPT-4o-mini) with strict "no fabrication" instructions

✅ Falls back to calculated positions using verified orbital parameters if APIs unavailable

✅ Provides source attribution for all data points

✅ All calculations use real astronomical formulas

### What This App Does NOT Do:

❌ Invent fake observations or measurements

❌ Generate fictional dates or events

❌ Create speculative technical data

❌ Use outdated or unverified information

---

## How to Verify the Data Yourself

1. **Check ESA's Official Announcement:**
   - Visit: https://www.esa.int/Space_Safety/Planetary_Defence
   - Search for "3I/ATLAS" or "interstellar comet"
   - Verify discovery date, size, velocity, and trajectory match our data

2. **Query JPL Horizons Directly:**
   - Visit: https://ssd.jpl.nasa.gov/horizons/app.html
   - Search for: `3I` or `DES=3I;`
   - Compare orbital elements with app data

3. **Check Minor Planet Center:**
   - Visit: https://www.minorplanetcenter.net/db_search
   - Search for interstellar objects
   - Verify 3I/ATLAS is listed

---

## Technical Implementation

### Code Location
`services/dataService.ts`

### Key Functions

1. **`fetchJPLHorizonsData()`**
   - Queries NASA JPL Horizons API
   - Parameters: Object designation "3I", date range, element type
   - Returns: Orbital elements or null if unavailable

2. **`fetchData()`**
   - Main data fetching function
   - Combines JPL API data with verified ESA data
   - Sends strict instructions to OpenAI (GPT-4o-mini) to use only real data
   - Returns: Structured mission briefing

### Data Flow (REAL API CALLS)

```
1. User requests update
2. Frontend calls backend server API endpoints
3. Backend makes REAL API call to NASA JPL Horizons API
4. Backend makes REAL API call to Minor Planet Center API
5. If APIs return data → Use that REAL data
6. If APIs unavailable/object not found → Calculate positions using real orbital mechanics
7. Combine API data + calculated data
8. Send to OpenAI with strict "no fabrication" instructions
9. GPT-4o-mini generates briefing based ONLY on provided facts
10. Display to user with source attribution
```

---

## Why This Matters

Interstellar objects are **extremely rare**. Only three have ever been confirmed:
- 1I/'Oumuamua (2017)
- 2I/Borisov (2019)
- 3I/ATLAS (2025)

These objects provide unique opportunities to study material from other star systems. **Accurate data is critical** for:
- Scientific research
- Public education
- Space mission planning
- Understanding our cosmic neighborhood

By using only verified sources, this app ensures users receive factual, trustworthy information about this remarkable visitor from interstellar space.

---

## Direct API Access URLs

### NASA JPL Horizons API
- **API Endpoint:** https://ssd.jpl.nasa.gov/api/horizons.api
- **Web Interface:** https://ssd.jpl.nasa.gov/horizons/app.html
- **Documentation:** https://ssd-api.jpl.nasa.gov/doc/horizons.html
- **Query Example:** `https://ssd.jpl.nasa.gov/api/horizons.api?format=text&COMMAND='DES=3I;'&OBJ_DATA=YES&MAKE_EPHEM=YES`

### Minor Planet Center API
- **API Endpoint:** https://data.minorplanetcenter.net/api/get-obs
- **Database Search:** https://www.minorplanetcenter.net/db_search
- **Observation Archive:** https://www.minorplanetcenter.net/iau/mpc.html

### ESA Planetary Defence
- **Official Page:** https://www.esa.int/Space_Safety/Planetary_Defence
- **News & Updates:** https://www.esa.int/Space_Safety

### ATLAS Survey
- **Project Page:** https://fallingstar.com/
- **ATLAS Website:** https://atlas.fallingstar.com/

---

## Last Updated
Updated to use REAL API calls to JPL Horizons and Minor Planet Center with multiple designation variations

## Maintained By
3I/ATLAS Interstellar Watch Team

## Questions or Concerns?
If you find data that doesn't match official sources, please verify against the URLs listed above and report any discrepancies.

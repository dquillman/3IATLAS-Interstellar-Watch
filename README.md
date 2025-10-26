<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 3I/ATLAS Interstellar Watch

Real-time threat analysis and mission status tracking for the interstellar object 3I/ATLAS, discovered July 1, 2025.

**Version:** 1.1.0

View your app in AI Studio: https://ai.studio/apps/drive/1Oi-cw6PC9m1X9xiycL-nOXpXiLaAfqjl

## Features

- **Real-time Mission Briefings**: AI-generated analysis using OpenAI GPT-4o-mini
- **Verified Data Sources**: Integration with ESA, NASA JPL, ATLAS Survey, and Minor Planet Center
- **Auto-refresh**: 60-minute automatic updates with countdown timer
- **Interstellar Comparison**: Side-by-side comparison with 1I/'Oumuamua and 2I/Borisov
- **PDF Export**: Download complete mission briefings
- **Mobile Responsive**: Optimized for all screen sizes

## Run Locally

**Prerequisites:** Node.js 18+ and npm

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**

   Create a `.env.local` file in the root directory:
   ```env
   VITE_API_KEY=your_openai_api_key_here
   ```

   Get your OpenAI API key from: https://platform.openai.com/api-keys

3. **Run the development server:**
   ```bash
   npm run dev
   ```

   The app will be available at http://localhost:3000

4. **Build for production:**
   ```bash
   npm run build
   npm run preview
   ```

## Security Notice

### ⚠️ IMPORTANT: API Key Security

**Current Limitation:** This application currently exposes the OpenAI API key in client-side code. This is **NOT RECOMMENDED** for production use.

**Why this is insecure:**
- API keys are visible in browser DevTools and network requests
- Anyone can extract and abuse your API key
- No rate limiting or cost controls
- Potential for unauthorized usage and charges

**For Development Only:**
- ✅ Use for local development and testing
- ✅ Keep `.env.local` out of version control (already in `.gitignore`)
- ❌ DO NOT deploy this to production as-is
- ❌ DO NOT commit API keys to Git

**Production Recommendation:**

Implement a backend proxy server to protect your API key:

```javascript
// backend/server.js (example using Express)
import express from 'express';
import OpenAI from 'openai';

const app = express();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/api/mission-briefing', async (req, res) => {
  // Validate request, implement rate limiting, etc.
  const response = await openai.chat.completions.create({...});
  res.json(response);
});

app.listen(3001);
```

Then update the frontend to call your backend instead of OpenAI directly.

## Data Sources

This application uses REAL verified data from:

- **ESA Planetary Defence Office**: Discovery announcement and orbital parameters
- **NASA JPL Horizons**: Ephemeris data and trajectory calculations
- **ATLAS Survey (Río Hurtado, Chile)**: Initial discovery on July 1, 2025
- **Minor Planet Center**: Coordinated observation data from global telescope networks
- **Hubble Space Telescope**: Spectroscopy and light curve analysis
- **James Webb Space Telescope**: Infrared imaging and molecular composition

For detailed source documentation, see [DATA_SOURCES.md](DATA_SOURCES.md)

## Tech Stack

- **React 19.2.0** - UI framework
- **TypeScript 5.8.2** - Type safety
- **Vite 6.2.0** - Build tool and dev server
- **OpenAI API** - GPT-4o-mini for AI analysis
- **jsPDF** - PDF export functionality
- **Tailwind CSS** - Styling

## Project Structure

```
3iatlas/
├── components/          # React components
│   ├── Header.tsx
│   ├── StatusDashboard.tsx
│   ├── ObservationTimeline.tsx
│   ├── AnomalyWatchList.tsx
│   ├── FutureObservations.tsx
│   ├── InterstellarComparison.tsx
│   ├── SourceAttribution.tsx
│   └── Footer.tsx
├── services/
│   └── dataService.ts   # OpenAI API integration
├── types.ts             # TypeScript type definitions
├── App.tsx              # Main application component
└── index.html           # Entry point
```

## Deploy to Render

⚠️ **WARNING**: Deploying this app exposes your API key. Only deploy if you understand the security implications.

### Quick Deploy

1. **Fork or push this repository to GitHub**

2. **Sign up for Render**: https://render.com

3. **Create a new Static Site:**
   - Connect your GitHub repository
   - Render will automatically detect the `render.yaml` configuration

4. **Set Environment Variable:**
   - In Render dashboard, add environment variable:
   - Key: `VITE_API_KEY`
   - Value: Your OpenAI API key
   - **Important**: Set this in Render dashboard, NOT in your code!

5. **Deploy:**
   - Render will automatically build and deploy
   - Your app will be available at `https://your-app-name.onrender.com`

### Manual Deployment Steps

If not using `render.yaml`:

1. Create New > Static Site
2. Connect your repository
3. Configure:
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Add Environment Variable: `VITE_API_KEY`
5. Deploy

### Post-Deployment

- Monitor your OpenAI usage dashboard for unexpected activity
- Set up usage limits in OpenAI dashboard to prevent abuse
- Consider implementing rate limiting or authentication

## Known Limitations

1. **API Key Security**: See Security Notice above - client-side API keys are exposed
2. **CORS Restrictions**: JPL Horizons API cannot be called directly from browser
3. **No Backend**: All processing happens client-side
4. **Rate Limiting**: No protection against excessive API calls
5. **Cost Controls**: No built-in protection against API abuse

## Contributing

This is a demonstration/educational project. For production use, please address the security concerns outlined above.

## License

This project is for educational and demonstration purposes.

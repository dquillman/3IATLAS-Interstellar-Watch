import React, { useEffect, useState } from 'react';

interface Position {
  x: number;
  y: number;
  z: number;
  date: string;
}

interface SolarSystemData {
  source: string;
  timestamp: string;
  positions: {
    Earth?: Position;
    Mars?: Position;
    '3I/ATLAS'?: Position;
  };
  cached?: boolean;
}

const SolarSystemMap: React.FC = () => {
  const [data, setData] = useState<SolarSystemData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    try {
      setLoading(true);
      const backendUrl = import.meta.env.VITE_BACKEND_URL || window.location.origin;
      const response = await fetch(`${backendUrl}/api/solar-system-positions`);

      if (!response.ok) {
        throw new Error('Failed to fetch solar system positions');
      }

      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      console.error('Error fetching solar system positions:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // SVG viewbox and scaling
  const viewBoxSize = 400;
  const center = viewBoxSize / 2;
  const scale = 80; // pixels per AU

  // Convert AU coordinates to SVG coordinates (top-down view, X-Y plane)
  const toSVG = (x: number, y: number) => ({
    x: center + x * scale,
    y: center - y * scale // Invert Y for standard orientation
  });

  if (loading) {
    return (
      <div className="bg-comet-blue-900/50 p-6 rounded-lg border border-comet-blue-800 shadow-xl">
        <h2 className="text-2xl font-bold text-comet-blue-200 mb-4">Solar System Map</h2>
        <div className="flex items-center justify-center h-64">
          <div className="text-comet-blue-400">Loading positions from JPL Horizons...</div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-comet-blue-900/50 p-6 rounded-lg border border-comet-blue-800 shadow-xl">
        <h2 className="text-2xl font-bold text-comet-blue-200 mb-4">Solar System Map</h2>
        <div className="flex items-center justify-center h-64">
          <div className="text-red-400">Error: {error || 'No data available'}</div>
        </div>
      </div>
    );
  }

  const earthPos = data.positions.Earth;
  const marsPos = data.positions.Mars;
  const cometPos = data.positions['3I/ATLAS'];

  // Calculate orbital radii (approximate circles)
  const earthOrbitRadius = earthPos ? Math.sqrt(earthPos.x ** 2 + earthPos.y ** 2) * scale : 80;
  const marsOrbitRadius = marsPos ? Math.sqrt(marsPos.x ** 2 + marsPos.y ** 2) * scale : 152;

  return (
    <div className="bg-comet-blue-900/50 p-6 rounded-lg border border-comet-blue-800 shadow-xl">
      <h2 className="text-2xl font-bold text-comet-blue-200 mb-2">Solar System Map</h2>
      <p className="text-xs text-comet-blue-400 mb-4">
        Real-time positions from NASA JPL Horizons • Top-down view (X-Y plane)
        {data.cached && ' • Cached data'}
      </p>

      <div className="flex justify-center">
        <svg
          viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
          className="w-full max-w-2xl h-auto bg-black/30 rounded-lg"
        >
          {/* Orbital paths */}
          <circle
            cx={center}
            cy={center}
            r={earthOrbitRadius}
            fill="none"
            stroke="#4a9eff"
            strokeWidth="0.5"
            strokeDasharray="2,2"
            opacity="0.3"
          />
          <circle
            cx={center}
            cy={center}
            r={marsOrbitRadius}
            fill="none"
            stroke="#ff6b4a"
            strokeWidth="0.5"
            strokeDasharray="2,2"
            opacity="0.3"
          />

          {/* Sun */}
          <circle cx={center} cy={center} r="8" fill="#FDB813">
            <title>Sun</title>
          </circle>
          <text x={center} y={center + 20} fontSize="10" fill="#FDB813" textAnchor="middle">
            Sun
          </text>

          {/* Earth */}
          {earthPos && (
            <>
              <circle
                cx={toSVG(earthPos.x, earthPos.y).x}
                cy={toSVG(earthPos.x, earthPos.y).y}
                r="5"
                fill="#4a9eff"
              >
                <title>Earth - {earthPos.date}</title>
              </circle>
              <text
                x={toSVG(earthPos.x, earthPos.y).x}
                y={toSVG(earthPos.x, earthPos.y).y + 15}
                fontSize="10"
                fill="#4a9eff"
                textAnchor="middle"
              >
                Earth
              </text>
            </>
          )}

          {/* Mars */}
          {marsPos && (
            <>
              <circle
                cx={toSVG(marsPos.x, marsPos.y).x}
                cy={toSVG(marsPos.x, marsPos.y).y}
                r="4"
                fill="#ff6b4a"
              >
                <title>Mars - {marsPos.date}</title>
              </circle>
              <text
                x={toSVG(marsPos.x, marsPos.y).x}
                y={toSVG(marsPos.x, marsPos.y).y + 15}
                fontSize="10"
                fill="#ff6b4a"
                textAnchor="middle"
              >
                Mars
              </text>
            </>
          )}

          {/* 3I/ATLAS */}
          {cometPos && (
            <>
              <circle
                cx={toSVG(cometPos.x, cometPos.y).x}
                cy={toSVG(cometPos.x, cometPos.y).y}
                r="6"
                fill="#00ff88"
                stroke="#00ff88"
                strokeWidth="2"
              >
                <title>3I/ATLAS - {cometPos.date}</title>
              </circle>
              {/* Comet tail effect */}
              <circle
                cx={toSVG(cometPos.x, cometPos.y).x}
                cy={toSVG(cometPos.x, cometPos.y).y}
                r="12"
                fill="none"
                stroke="#00ff88"
                strokeWidth="1"
                opacity="0.3"
              />
              <text
                x={toSVG(cometPos.x, cometPos.y).x}
                y={toSVG(cometPos.x, cometPos.y).y - 15}
                fontSize="11"
                fill="#00ff88"
                textAnchor="middle"
                fontWeight="bold"
              >
                3I/ATLAS
              </text>
            </>
          )}

          {/* Scale reference */}
          <g transform={`translate(20, ${viewBoxSize - 30})`}>
            <line x1="0" y1="0" x2={scale} y2="0" stroke="#888" strokeWidth="1" />
            <text x={scale / 2} y="15" fontSize="9" fill="#888" textAnchor="middle">
              1 AU
            </text>
          </g>
        </svg>
      </div>

      <div className="mt-4 text-xs text-comet-blue-500 space-y-1">
        <p>• Position data: {new Date(data.timestamp).toLocaleString()}</p>
        <p>• 1 AU = 149.6 million km (Earth-Sun distance)</p>
        {cometPos && (
          <p>• 3I/ATLAS distance from Sun: {Math.sqrt(cometPos.x ** 2 + cometPos.y ** 2 + cometPos.z ** 2).toFixed(2)} AU</p>
        )}
      </div>
    </div>
  );
};

export default SolarSystemMap;

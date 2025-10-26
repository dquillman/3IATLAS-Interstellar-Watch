import React from 'react';

const sources = [
  { name: 'NASA JPL Horizons', description: 'Provides precise orbital parameters (trajectory path, speed, position) and ephemeris data (predicted positions over time) for tracking the object\'s movement through space' },
  { name: 'ATLAS Survey', description: 'Discovered 3I/ATLAS on July 1, 2025. Provides photometry data measuring the object\'s brightness and light variations to determine size and composition' },
  { name: 'ESA Gaia', description: 'Confirms precise position and motion using astrometry - the measurement of celestial object positions and movements with extreme accuracy to verify interstellar origin' },
  { name: 'Hubble (HST)', description: 'Analyzes light curves (brightness changes over time) and performs spectroscopy to identify chemical composition by studying how the object absorbs and reflects different wavelengths of light' },
  { name: 'James Webb (JWST)', description: 'Uses infrared sensors to detect heat signatures and analyze molecular composition, revealing materials and temperatures not visible in optical light' },
  { name: 'Minor Planet Center', description: 'Central repository collecting and verifying all observations worldwide, coordinating data from global telescope networks to build comprehensive tracking record' },
];

const SourceAttribution: React.FC = () => {
  return (
    <div className="bg-comet-blue-900/50 p-6 rounded-lg border border-comet-blue-800 shadow-xl">
      <h2 className="text-2xl font-bold text-comet-blue-200 mb-4">Data & Analysis Network</h2>
      <p className="text-sm text-comet-blue-400 mb-6">
        Analysis is based on data aggregated from the following trusted programs and archives.
      </p>
      <div className="space-y-3">
        {sources.map((source) => (
          <div key={source.name} className="bg-comet-blue-900 p-4 rounded-md border border-comet-blue-800 flex items-start gap-4">
            <div className="flex-shrink-0 w-40 font-semibold text-comet-blue-200">{source.name}</div>
            <div className="flex-1 text-xs text-comet-blue-500">{source.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SourceAttribution;
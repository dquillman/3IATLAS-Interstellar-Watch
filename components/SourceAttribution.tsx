import React from 'react';

const sources = [
  { name: 'NASA Jet Propulsion Laboratory (JPL) Horizons', description: 'Orbital Parameters & Ephemeris Data' },
  { name: 'ATLAS Sky Survey', description: 'Initial Discovery & Photometry' },
  { name: 'ESA Gaia Mission Archive', description: 'Astrometric Confirmation' },
  { name: 'Hubble Space Telescope (HST)', description: 'Light Curve & Spectroscopic Analysis' },
  { name: 'James Webb Space Telescope (JWST)', description: 'Infrared Compositional Analysis' },
  { name: 'Minor Planet Center (MPC)', description: 'Observation Database Aggregation' },
];

const SourceAttribution: React.FC = () => {
  return (
    <div className="bg-comet-blue-900/50 p-6 rounded-lg border border-comet-blue-800 shadow-xl">
      <h2 className="text-2xl font-bold text-comet-blue-200 mb-4">Data & Analysis Network</h2>
      <p className="text-sm text-comet-blue-400 mb-6">
        Analysis is based on data aggregated from the following trusted programs and archives.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sources.map((source) => (
          <div key={source.name} className="bg-comet-blue-900 p-3 rounded-md border border-comet-blue-800 hover:bg-comet-blue-800/50 transition-colors">
            <h3 className="font-semibold text-comet-blue-200">{source.name}</h3>
            <p className="text-xs text-comet-blue-500">{source.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SourceAttribution;
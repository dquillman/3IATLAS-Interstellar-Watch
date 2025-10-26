import React from 'react';

const sources = [
  {
    name: 'NASA JPL Horizons',
    description: 'Provides precise orbital parameters (trajectory path, speed, position) and ephemeris data (predicted positions over time) for tracking the object\'s movement through space',
    url: 'https://ssd.jpl.nasa.gov/'
  },
  {
    name: 'ATLAS Survey',
    description: 'Discovered 3I/ATLAS on July 1, 2025. Provides photometry data measuring the object\'s brightness and light variations to determine size and composition',
    url: 'https://fallingstar.com/'
  },
  {
    name: 'ESA Gaia',
    description: 'Confirms precise position and motion using astrometry - the measurement of celestial object positions and movements with extreme accuracy to verify interstellar origin',
    url: 'https://www.esa.int/Science_Exploration/Space_Science/Gaia'
  },
  {
    name: 'Hubble (HST)',
    description: 'Analyzes light curves (brightness changes over time) and performs spectroscopy to identify chemical composition by studying how the object absorbs and reflects different wavelengths of light',
    url: 'https://hubblesite.org/'
  },
  {
    name: 'James Webb (JWST)',
    description: 'Uses infrared sensors to detect heat signatures and analyze molecular composition, revealing materials and temperatures not visible in optical light',
    url: 'https://webbtelescope.org/'
  },
  {
    name: 'Minor Planet Center',
    description: 'Central repository collecting and verifying all observations worldwide, coordinating data from global telescope networks to build comprehensive tracking record',
    url: 'https://www.minorplanetcenter.net/'
  },
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
          <a
            key={source.name}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-comet-blue-900 p-4 rounded-md border border-comet-blue-800 flex items-start gap-4 hover:bg-comet-blue-800/70 hover:border-comet-blue-600 transition-all cursor-pointer group"
          >
            <div className="flex-shrink-0 w-40 font-semibold text-comet-blue-200 group-hover:text-comet-blue-100 flex items-center gap-2">
              {source.name}
              <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
            <div className="flex-1 text-xs text-comet-blue-500 group-hover:text-comet-blue-400">{source.description}</div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default SourceAttribution;
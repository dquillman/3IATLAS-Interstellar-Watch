import React from 'react';

const sources = [
  {
    name: 'ESA Planetary Defence',
    description: 'Primary coordination source. Manages global observation network including telescopes in Hawaii, Chile, and Australia tracking 3I/ATLAS',
    url: 'https://www.esa.int/Space_Safety/Planetary_Defence'
  },
  {
    name: 'NASA JPL Horizons',
    description: 'Live API providing precise orbital parameters, ephemeris data, and trajectory calculations updated in real-time',
    url: 'https://ssd.jpl.nasa.gov/horizons/'
  },
  {
    name: 'ATLAS Survey',
    description: 'Discovery site (Río Hurtado, Chile) that first detected 3I/ATLAS on July 1, 2025. Provides ongoing photometry and position data',
    url: 'https://fallingstar.com/'
  },
  {
    name: 'Hubble Space Telescope',
    description: 'Captured detailed images on July 21, 2025 showing dust coma and providing size estimates (5.6 km max diameter). Scheduled for UV spectroscopy in November 2025',
    url: 'https://hubblesite.org/'
  },
  {
    name: 'James Webb Space Telescope',
    description: 'First observations August 6, 2025 revealed unusual CO₂-rich composition. Next observations scheduled for December 2025 post-perihelion',
    url: 'https://webbtelescope.org/'
  },
  {
    name: 'Minor Planet Center',
    description: 'Central repository aggregating and verifying all observations worldwide from the global telescope network',
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
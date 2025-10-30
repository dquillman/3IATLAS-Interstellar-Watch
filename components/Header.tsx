import React from 'react';

interface HeaderProps {
  lastUpdateTimestamp?: string;
  onRequestUpdate: () => void;
  isUpdating: boolean;
  onExportData: () => void;
  canExport: boolean;
  nextRefreshIn?: number;
  autoRefreshEnabled?: boolean;
  onToggleAutoRefresh?: () => void;
}

const Header: React.FC<HeaderProps> = ({ lastUpdateTimestamp, onRequestUpdate, isUpdating, onExportData, canExport, nextRefreshIn, autoRefreshEnabled, onToggleAutoRefresh }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  return (
    <header className="text-center border-b-2 border-comet-blue-800 pb-6">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-comet-blue-300 to-comet-blue-500">
        3I/ATLAS Interstellar Watch
      </h1>
      <p className="text-sm text-comet-blue-500 mt-2">Version 1.2.0</p>
      <p className="mt-4 text-lg text-comet-blue-300 max-w-3xl mx-auto">
        Real-time threat analysis and mission status from the Interstellar Watch Program.
      </p>
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3 px-4">
        <button
          onClick={onRequestUpdate}
          disabled={isUpdating}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2 bg-comet-blue-600 text-white text-sm sm:text-base font-semibold rounded-lg shadow-md hover:bg-comet-blue-500 focus:outline-none focus:ring-2 focus:ring-comet-blue-400 focus:ring-opacity-75 transition-all duration-200 disabled:bg-comet-blue-800 disabled:cursor-not-allowed"
        >
          {isUpdating ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Receiving...</span>
            </>
          ) : (
            'Request Telemetry Update'
          )}
        </button>
        <button
          onClick={onExportData}
          disabled={isUpdating || !canExport}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2 bg-transparent border border-comet-blue-500 text-comet-blue-300 text-sm sm:text-base font-semibold rounded-lg shadow-md hover:bg-comet-blue-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-comet-blue-400 focus:ring-opacity-75 transition-all duration-200 disabled:border-comet-blue-700 disabled:text-comet-blue-600 disabled:cursor-not-allowed"
          aria-label="Export mission briefing data"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          <span>Export Briefing</span>
        </button>
        <div className="w-full flex flex-col items-center justify-center gap-2 mt-3">
          {lastUpdateTimestamp && (
            <p className="text-xs sm:text-sm text-comet-blue-500 text-center">
              Last Update: {new Date(lastUpdateTimestamp).toLocaleString()}
            </p>
          )}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
            {nextRefreshIn !== undefined && autoRefreshEnabled && (
              <p className="text-xs sm:text-sm text-comet-blue-400 flex items-center gap-2">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Next: {formatTime(nextRefreshIn)}
              </p>
            )}
            {onToggleAutoRefresh && (
              <button
                onClick={onToggleAutoRefresh}
                className="text-xs px-3 py-1 rounded bg-comet-blue-700 hover:bg-comet-blue-600 transition whitespace-nowrap"
              >
                {autoRefreshEnabled ? 'Disable' : 'Enable'} Auto-refresh
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

import React from 'react';
import { SummaryData } from '../types';

interface StatusDashboardProps {
  summary: SummaryData;
}

const StatusItem: React.FC<{ label: string; value: string; positive: boolean }> = ({ label, value, positive }) => {
  const colorClass = positive ? 'text-green-400' : 'text-yellow-400';
  return (
    <div>
      <h3 className="text-sm font-medium text-comet-blue-400">{label}</h3>
      <p className={`text-lg font-semibold ${colorClass}`}>{value}</p>
    </div>
  );
};

const ThreatGauge: React.FC<{ level: SummaryData['threatLevel'] }> = ({ level }) => {
    const levelConfig: { [key in SummaryData['threatLevel']]: { angle: number; labelColor: string } } = {
        'Nominal': { angle: -67.5, labelColor: 'bg-green-500 text-green-900' },
        'Elevated': { angle: -22.5, labelColor: 'bg-yellow-500 text-yellow-900' },
        'High': { angle: 22.5, labelColor: 'bg-orange-500 text-orange-900' },
        'Critical': { angle: 67.5, labelColor: 'bg-red-500 text-red-900' },
    };

    const currentConfig = levelConfig[level];

    const arcs = {
      nominal: { d: "M 20 100 A 80 80 0 0 1 43.5 43.5", color: "#22c55e" },
      elevated: { d: "M 43.5 43.5 A 80 80 0 0 1 100 20", color: "#eab308" },
      high: { d: "M 100 20 A 80 80 0 0 1 156.5 43.5", color: "#f97316" },
      critical: { d: "M 156.5 43.5 A 80 80 0 0 1 180 100", color: "#ef4444" },
    };

    return (
        <div className="flex flex-col items-center">
            <h3 className="text-sm font-medium text-comet-blue-400 mb-2">Threat Level</h3>
            <div className="relative w-48 h-24">
                <svg viewBox="0 0 200 100" className="w-full h-full">
                    {Object.values(arcs).map((arc, index) => (
                        <path key={index} d={arc.d} stroke={arc.color} strokeWidth="20" fill="none" strokeLinecap="butt" />
                    ))}
                    <g transform="translate(100, 100)"> {/* Pivot at the center bottom */}
                        <path
                            d="M 0 -8 L 0 -75" // A simple line needle
                            stroke="white"
                            strokeWidth="4"
                            strokeLinecap="round"
                            style={{ 
                                transform: `rotate(${currentConfig.angle}deg)`, 
                                transition: 'transform 0.7s cubic-bezier(0.68, -0.55, 0.27, 1.55)',
                                filter: 'drop-shadow(0 0 3px rgba(0,0,0,0.5))'
                            }}
                        />
                        <circle cx="0" cy="0" r="8" fill="#e5e7eb" stroke="#0c4a6e" strokeWidth="2" />
                    </g>
                </svg>
            </div>
            <div className="mt-4">
                 <span className={`px-4 py-1.5 text-lg font-bold rounded-full ${currentConfig.labelColor}`}>
                     {level}
                 </span>
            </div>
        </div>
    );
}


const StatusDashboard: React.FC<StatusDashboardProps> = ({ summary }) => {
  return (
    <div className="bg-comet-blue-900/50 p-6 rounded-lg border border-comet-blue-800 shadow-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
        
        <div className="md:col-span-1 lg:col-span-1 text-center lg:text-left">
            <h2 className="text-xl font-bold text-comet-blue-200">Current Phase</h2>
            <p className="text-3xl font-bold text-comet-blue-400">{summary.currentPhase}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:col-span-1 lg:col-span-2">
            <StatusItem label="Natural Origin" value={summary.isNatural.status ? 'Assumed' : 'No'} positive={summary.isNatural.status} />
            <StatusItem label="Maneuver Evidence" value={summary.maneuverEvidence.status ? 'Yes' : 'No'} positive={!summary.maneuverEvidence.status} />
        </div>

        <div className="md:col-span-2 lg:col-span-1">
            <ThreatGauge level={summary.threatLevel} />
        </div>
      </div>
      <div className="mt-6 pt-6 border-t border-comet-blue-800 text-center">
        <h3 className="text-lg font-semibold text-comet-blue-100">AI-Generated Assessment</h3>
        <p className="text-2xl font-bold text-comet-blue-300 mt-1">"{summary.assessment}"</p>
      </div>
    </div>
  );
};

export default StatusDashboard;
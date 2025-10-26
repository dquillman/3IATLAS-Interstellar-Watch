import React from 'react';
import { Observation, ConfidenceLevel } from '../types';

interface ObservationTimelineProps {
  observations: Observation[];
}

const ConfidenceBadge: React.FC<{ level: ConfidenceLevel }> = ({ level }) => {
  const styles: { [key in ConfidenceLevel]: string } = {
    [ConfidenceLevel.Low]: 'bg-gray-500 text-gray-100',
    [ConfidenceLevel.Medium]: 'bg-yellow-500 text-yellow-900',
    [ConfidenceLevel.High]: 'bg-green-500 text-green-900',
    [ConfidenceLevel.Confirmed]: 'bg-blue-500 text-blue-100',
  };
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[level]}`}>
      {level}
    </span>
  );
};

const ObservationTimeline: React.FC<ObservationTimelineProps> = ({ observations }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left table-auto">
        <thead className="border-b border-comet-blue-700 text-sm text-comet-blue-300">
          <tr>
            <th className="p-3">Date</th>
            <th className="p-3">Observatory/Source</th>
            <th className="p-3">Finding</th>
            <th className="p-3 text-center">Confidence</th>
          </tr>
        </thead>
        <tbody>
          {observations.map((obs) => (
            <tr key={obs.id} className="border-b border-comet-blue-800 hover:bg-comet-blue-800/50 transition-colors duration-200">
              <td className="p-3 align-top whitespace-nowrap">{obs.dateObserved}</td>
              <td className="p-3 align-top font-semibold">{obs.observatory}</td>
              <td className="p-3 align-top text-comet-blue-300">
                {obs.keyFinding}
              </td>
              <td className="p-3 align-top text-center">
                <ConfidenceBadge level={obs.confidence} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ObservationTimeline;
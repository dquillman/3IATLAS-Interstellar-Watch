import React from 'react';
import { FutureObservation, FutureStatus } from '../types';

interface FutureObservationsProps {
  observations: FutureObservation[];
}

const StatusBadge: React.FC<{ status: FutureStatus }> = ({ status }) => {
  const styles: { [key in FutureStatus]: string } = {
    [FutureStatus.Planned]: 'bg-gray-500 text-gray-100',
    [FutureStatus.Scheduled]: 'bg-blue-500 text-blue-100',
    [FutureStatus.Opportunity]: 'bg-indigo-500 text-indigo-100',
  };
  return (
    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${styles[status]}`}>
      {status}
    </span>
  );
};

const FutureObservations: React.FC<FutureObservationsProps> = ({ observations }) => {
  return (
    <div className="space-y-4">
      {observations.map((obs) => (
        <div key={obs.id} className="p-4 rounded-md bg-comet-blue-900 border border-comet-blue-800">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-comet-blue-100">{obs.mission}</h3>
            <StatusBadge status={obs.status} />
          </div>
          <p className="mt-1 text-sm text-comet-blue-300 font-medium">{obs.objective}</p>
          <p className="mt-2 text-xs text-comet-blue-400">
            Window: {new Date(obs.windowStart).toLocaleDateString()} - {new Date(obs.windowEnd).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default FutureObservations;
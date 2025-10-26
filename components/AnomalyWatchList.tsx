import React from 'react';
import { Anomaly, AnomalyStatus } from '../types';

interface AnomalyWatchListProps {
  anomalies: Anomaly[];
}

const StatusIndicator: React.FC<{ status: AnomalyStatus }> = ({ status }) => {
  const styles: { [key in AnomalyStatus]: string } = {
    [AnomalyStatus.Normal]: 'bg-green-500',
    [AnomalyStatus.Watch]: 'bg-yellow-500',
    [AnomalyStatus.Alert]: 'bg-red-500',
  };
  const shouldPing = status === AnomalyStatus.Alert || status === AnomalyStatus.Watch;
  return (
    <div className="flex-shrink-0">
        <span className="relative flex h-3 w-3">
            {shouldPing && <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${styles[status]} opacity-75`}></span>}
            <span className={`relative inline-flex rounded-full h-3 w-3 ${styles[status]}`}></span>
        </span>
    </div>
  );
};

const AnomalyWatchList: React.FC<AnomalyWatchListProps> = ({ anomalies }) => {
  return (
    <div className="space-y-4">
      {anomalies.map((anomaly) => (
        <div key={anomaly.id} className="p-4 rounded-md bg-comet-blue-900 border border-comet-blue-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <StatusIndicator status={anomaly.status} />
                <h3 className="font-semibold text-comet-blue-100">{anomaly.name}</h3>
            </div>
            <span className="text-xs font-bold text-comet-blue-400">{anomaly.status}</span>
          </div>
          <p className="mt-2 text-sm text-comet-blue-300">{anomaly.description}</p>
        </div>
      ))}
    </div>
  );
};

export default AnomalyWatchList;
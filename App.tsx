import React, { useState, useEffect, useCallback } from 'react';
import { SummaryData, Observation, Anomaly, FutureObservation } from './types';
import { fetchData } from './services/dataService';
import Header from './components/Header';
import StatusDashboard from './components/StatusDashboard';
import ObservationTimeline from './components/ObservationTimeline';
import AnomalyWatchList from './components/AnomalyWatchList';
import Footer from './components/Footer';
import SourceAttribution from './components/SourceAttribution';
import FutureObservations from './components/FutureObservations';
import InterstellarComparison from './components/InterstellarComparison';
import { jsPDF } from 'jspdf';

const App: React.FC = () => {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [observations, setObservations] = useState<Observation[]>([]);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [futureObservations, setFutureObservations] = useState<FutureObservation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [nextRefreshIn, setNextRefreshIn] = useState<number>(3600); // 60 minutes in seconds
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState<boolean>(true);

  const loadData = useCallback(async () => {
      try {
        const { summaryData, observationData, anomalyData, futureObservationData } = await fetchData();
        setSummary(summaryData);
        setObservations(observationData);
        setAnomalies(anomalyData);
        setFutureObservations(futureObservationData);
        setError(null);
      } catch (err) {
        setError('Failed to receive telemetry. Please refresh to try again.');
        console.error(err);
      }
  }, []);
  
  useEffect(() => {
    const initialLoad = async () => {
      setIsLoading(true);
      await loadData();
      setIsLoading(false);
      setNextRefreshIn(3600); // Reset timer after load
    }
    initialLoad();
  }, []);

  // Auto-refresh timer
  useEffect(() => {
    if (!autoRefreshEnabled) return;

    const interval = setInterval(() => {
      setNextRefreshIn((prev) => {
        if (prev <= 1) {
          handleRequestUpdate();
          return 3600; // Reset to 60 minutes
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [autoRefreshEnabled, handleRequestUpdate]);

  const handleRequestUpdate = useCallback(async () => {
    setIsUpdating(true);
    await loadData();
    setIsUpdating(false);
  }, [loadData]);

  const handleExportData = () => {
    if (!summary || !observations || !anomalies || !futureObservations) {
      console.error("No data available to export.");
      return;
    }

    const doc = new jsPDF();
    let yPos = 20;

    // Title
    doc.setFontSize(20);
    doc.text('3I/ATLAS Mission Briefing', 105, yPos, { align: 'center' });
    yPos += 15;

    // Timestamp
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 105, yPos, { align: 'center' });
    yPos += 15;

    // Summary Section
    doc.setFontSize(14);
    doc.text('Mission Summary', 20, yPos);
    yPos += 8;
    doc.setFontSize(10);
    doc.text(`Phase: ${summary.currentPhase}`, 20, yPos);
    yPos += 6;
    doc.text(`Threat Level: ${summary.threatLevel}`, 20, yPos);
    yPos += 6;
    doc.text(`Threat Reason: ${doc.splitTextToSize(summary.threatLevelReason, 170).join(' ')}`, 20, yPos);
    yPos += 12;
    doc.text(`Assessment: ${doc.splitTextToSize(summary.assessment, 170).join(' ')}`, 20, yPos);
    yPos += 15;

    // Observations
    doc.setFontSize(14);
    doc.text('Observation Timeline', 20, yPos);
    yPos += 8;
    doc.setFontSize(9);
    observations.forEach(obs => {
      if (yPos > 270) { doc.addPage(); yPos = 20; }
      doc.text(`${obs.dateObserved} - ${obs.observatory}`, 20, yPos);
      yPos += 5;
      doc.text(`  ${doc.splitTextToSize(obs.keyFinding, 170).join(' ')}`, 20, yPos);
      yPos += 8;
    });
    yPos += 10;

    // Anomalies
    if (yPos > 250) { doc.addPage(); yPos = 20; }
    doc.setFontSize(14);
    doc.text('Key Anomalies', 20, yPos);
    yPos += 8;
    doc.setFontSize(10);
    anomalies.forEach(anom => {
      if (yPos > 270) { doc.addPage(); yPos = 20; }
      doc.text(`${anom.name} (${anom.status})`, 20, yPos);
      yPos += 5;
      doc.text(`  ${doc.splitTextToSize(anom.description, 170).join(' ')}`, 20, yPos);
      yPos += 8;
    });

    // Save PDF
    const timestamp = new Date().toISOString().replace(/:/g, '-').slice(0, 19);
    doc.save(`3I-ATLAS_Mission_Briefing_${timestamp}.pdf`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-comet-blue-950">
        <div className="flex flex-col items-center space-y-4">
            <svg className="animate-spin h-10 w-10 text-comet-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-comet-blue-300 text-lg">Receiving Telemetry & Running Analysis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-900/50 text-red-200">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-comet-blue-950 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header
            lastUpdateTimestamp={summary?.lastUpdateTimestamp}
            onRequestUpdate={handleRequestUpdate}
            isUpdating={isUpdating}
            onExportData={handleExportData}
            canExport={!!summary}
            nextRefreshIn={nextRefreshIn}
            autoRefreshEnabled={autoRefreshEnabled}
            onToggleAutoRefresh={() => setAutoRefreshEnabled(!autoRefreshEnabled)}
        />
        <main className="mt-8 space-y-8">
          {summary && <StatusDashboard summary={summary} />}

          <InterstellarComparison />

          <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-comet-blue-900/50 p-6 rounded-lg border border-comet-blue-800 shadow-xl">
                <h2 className="text-2xl font-bold text-comet-blue-200 mb-4">Observation Timeline</h2>
                <ObservationTimeline observations={observations} />
              </div>
              <SourceAttribution />
            </div>

            <div className="lg:col-span-1 space-y-8">
                <div className="bg-comet-blue-900/50 p-6 rounded-lg border border-comet-blue-800 shadow-xl">
                    <h2 className="text-2xl font-bold text-comet-blue-200 mb-4">Key Anomalies</h2>
                    <AnomalyWatchList anomalies={anomalies} />
                </div>
                 <div className="bg-comet-blue-900/50 p-6 rounded-lg border border-comet-blue-800 shadow-xl">
                    <h2 className="text-2xl font-bold text-comet-blue-200 mb-4">Scheduled Mission Directives</h2>
                    <FutureObservations observations={futureObservations} />
                </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default App;

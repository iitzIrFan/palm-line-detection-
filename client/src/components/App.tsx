import React, { useState } from 'react';
import CameraCapture from '../components/CameraCapture';
import PalmAnalysis from '../components/PalmAnalysis';
import './App.css';

interface AnalysisResult {
    image: string;
    lines: {
        heartLine: number[];
        headLine: number[];
        lifeLine: number[];
        fateLine: number[];
        sunLine: number[];
    };
    landmarks: number[][];
    insights: {
        starseed: string;
        personality?: string;
        // Add more insight fields as needed
    };
}

const App: React.FC = () => {
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [activeTab, setActiveTab] = useState<'capture' | 'analysis'>('capture');

    const handleAnalysisComplete = (result: AnalysisResult) => {
        setAnalysisResult(result);
        setActiveTab('analysis');
    };

    return (
        <div className="app-container">
            <header className="app-header">
                <h1>Palmistry Analysis</h1>
            </header>

            <div className="tab-container">
                <button
                    className={activeTab === 'capture' ? 'active' : ''}
                    onClick={() => setActiveTab('capture')}
                >
                    Capture Palm
                </button>
                {analysisResult && (
                    <button
                        className={activeTab === 'analysis' ? 'active' : ''}
                        onClick={() => setActiveTab('analysis')}
                    >
                        View Analysis
                    </button>
                )}
            </div>

            <main className="app-main">
                {activeTab === 'capture' ? (
                    <CameraCapture onComplete={handleAnalysisComplete} />
                ) : (
                    <div className="analysis-container">
                        <PalmAnalysis result={analysisResult} />
                        <div className="insights">
                            <h2>Your Starseed Reading</h2>
                            <p>{analysisResult?.insights.starseed}</p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default App;
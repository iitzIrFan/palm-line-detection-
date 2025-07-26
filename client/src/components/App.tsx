import React, { useState } from 'react';
import CameraCapture from './CameraCapture';
import PalmAnalysis from './PalmAnalysis';
import '../App.css';

interface LineData {
    class: string;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    confidence?: number;
    description: string;
}

interface FingertipData {
    name: string;
    x: number;
    y: number;
    confidence: number;
    description: string;
}

interface AnalysisResult {
    image: string;
    lines: LineData[];
    fingertips?: FingertipData[];
    analysis?: {
        personality: string;
        strengths: string[];
        starseed: string;
        overall: string;
    };
    // Backward compatibility
    insights?: {
        starseed: string;
        personality?: string;
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
                            <p>{analysisResult?.insights?.starseed || analysisResult?.analysis?.starseed}</p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default App;
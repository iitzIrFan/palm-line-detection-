import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import * as handpose from '@tensorflow-models/handpose';
import * as tf from '@tensorflow/tfjs';
interface CameraCaptureProps {
    onComplete: (result: any) => void;
}
const CameraCapture: React.FC<CameraCaptureProps> = ({ onComplete }) => {
    const webcamRef = useRef<Webcam>(null);
    const [message, setMessage] = useState('Align your palm with the template');
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const captureAndAnalyze = async () => {
        if (!webcamRef.current) return;

        setIsAnalyzing(true);
        setMessage('Detecting palm...');

        try {
            const imageSrc = webcamRef.current.getScreenshot();
            if (!imageSrc) throw new Error('Failed to capture image');

            const model = await handpose.load();
            const img = new Image();
            img.src = imageSrc;

            await new Promise((resolve) => { img.onload = resolve; });

            const predictions = await model.estimateHands(img);
            if (!predictions || predictions.length === 0) {
                throw new Error('No palm detected. Please try again.');
            }

            // Proceed with analysis
            await analyzePalm(imageSrc, predictions[0].landmarks);

        } catch (error: unknown) {
            setMessage(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const analyzePalm = async (imageSrc: string, landmarks: any) => {
        // Send to backend for detailed analysis
        setMessage('Analyzing...');

        const response = await fetch('/api/analyze', {
            method: 'POST',
            body: JSON.stringify({ image: imageSrc, landmarks }),
            headers: { 'Content-Type': 'application/json' }
        });

        const result = await response.json();
        renderPalmAnalysis(result);
    };

    const renderPalmAnalysis = (result: any) => {
        // Render the analysis with lines and dots
        setMessage('Analysis complete');
        // Implementation details below...
    };

    return (
        <div className="camera-container">
            <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode: 'user' }}
            />
            <div className="hand-template-overlay"></div>
            <button
                onClick={captureAndAnalyze}
                disabled={isAnalyzing}
            >
                {isAnalyzing ? 'Processing...' : 'Capture Palm'}
            </button>
            <div className="message">{message}</div>
        </div>
    );
};

export default CameraCapture;
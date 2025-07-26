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
            setMessage('Analysis complete!');

        } catch (error: unknown) {
            setMessage(error instanceof Error ? error.message : 'Analysis failed. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const analyzePalm = async (imageSrc: string, landmarks: any) => {
        // Send to backend for detailed analysis
        setMessage('Analyzing palm lines and fingertips...');

        try {
            const response = await fetch('http://localhost:3001/api/analyze', {
                method: 'POST',
                body: JSON.stringify({ image: imageSrc, landmarks }),
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                throw new Error('Analysis failed');
            }

            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.message || 'Analysis failed');
            }

            // Pass the complete result to parent component
            onComplete({
                image: imageSrc,
                lines: result.lines || [],
                fingertips: result.fingertips || [],
                analysis: result.analysis || null,
                insights: result.insights || result.analysis // Backward compatibility
            });

        } catch (error) {
            setMessage(error instanceof Error ? error.message : 'Analysis failed');
            throw error;
        }
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
import React, { useState, useRef, useEffect } from "react";

// Inline CSS styles
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  color: #2d3748;
}

.container {
  min-height: 100vh;
  padding: 0;
  background: #ffffff;
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.1);
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
  padding: 60px 20px;
  position: relative;
  overflow: hidden;
}

.header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.05"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>') repeat;
  pointer-events: none;
}

.header h1 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 16px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 1;
}

.header p {
  font-size: 1.2rem;
  opacity: 0.95;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.card {
  background: #ffffff;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2);
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.card h1, .card h2 {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 20px;
  text-align: center;
  color: #2d3748;
}

.video-container {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

video, canvas {
  width: 100%;
  height: auto;
  border-radius: 16px;
  display: block;
}

.progress-bar {
  background: #e2e8f0;
  height: 12px;
  border-radius: 6px;
  margin-top: 15px;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.progress-bar .progress {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  width: 0;
  transition: width 0.4s ease;
  border-radius: 6px;
  position: relative;
}

.progress-bar .progress::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.results {
  display: grid;
  gap: 25px;
  margin-top: 20px;
}

.analysis-section {
  background: #f8fafc;
  border-radius: 16px;
  padding: 25px;
  border-left: 5px solid #667eea;
  transition: all 0.3s ease;
  position: relative;
}

.analysis-section:hover {
  background: #f1f5f9;
  transform: translateX(5px);
}

.analysis-section h3 {
  color: #667eea;
  margin-bottom: 15px;
  font-size: 1.3rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.analysis-section h4 {
  color: #4a5568;
  margin: 15px 0 8px 0;
  font-size: 1.1rem;
  font-weight: 500;
}

.analysis-section p {
  color: #4a5568;
  line-height: 1.7;
  margin-bottom: 12px;
  font-size: 1rem;
}

.analysis-section strong {
  color: #2d3748;
  font-weight: 600;
}

.analysis-section ul {
  margin-left: 20px;
  margin-top: 8px;
}

.analysis-section li {
  margin-bottom: 8px;
  color: #4a5568;
  line-height: 1.6;
}

.starseed-section {
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  border-left-color: #805ad5;
}

.starseed-section h3 {
  color: #805ad5;
}

.overall-section {
  background: linear-gradient(135deg, #fffaf0 0%, #fef5e7 100%);
  border-left-color: #ed8936;
}

.overall-section h3 {
  color: #ed8936;
}

button {
  width: 100%;
  margin-top: 20px;
  padding: 16px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

button:hover {
  background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
}

button:hover::before {
  left: 100%;
}

button:active {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.error-container {
  text-align: center;
  padding: 40px 20px;
}

.error-container h2 {
  color: #e53e3e;
  margin-bottom: 15px;
}

.error-container p {
  font-size: 1.1rem;
  color: #718096;
  line-height: 1.6;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header h1 {
    font-size: 2.5rem;
  }
  
  .header p {
    font-size: 1.1rem;
  }
  
  .main-content {
    padding: 30px 15px;
  }
  
  .card {
    padding: 30px 20px;
  }
  
  .card h1, .card h2 {
    font-size: 1.8rem;
  }
  
  .analysis-section {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .header {
    padding: 40px 15px;
  }
  
  .header h1 {
    font-size: 2rem;
  }
  
  .header p {
    font-size: 1rem;
  }
  
  .card {
    padding: 25px 15px;
  }
  
  .analysis-section {
    padding: 15px;
  }
}
`;

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

interface AnalysisData {
  personality: string;
  strengths: string[];
  challenges: string[];
  starseed: string;
  overall: string;
  detailedReadings?: {
    lines: Record<string, {
      description: string;
      meaning: string;
      strength: number;
    }>;
    fingertips: Record<string, {
      description: string;
      meaning: string;
      confidence: number;
    }>;
  };
}

function App() {
  const [stage, setStage] = useState<"camera" | "analyzing" | "result" | "error">("camera");
  const [stepIndex, setStepIndex] = useState(0);
  const [image, setImage] = useState<string | null>(null);
  const [lines, setLines] = useState<LineData[]>([]);
  const [fingertips, setFingertips] = useState<FingertipData[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("Palm detection failed. Please try again.");

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (stage === "camera" && navigator.mediaDevices && videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } })
        .then((stream) => {
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch(() => {
          setErrorMessage("Camera access denied. Please allow camera permissions and refresh the page.");
          setStage("error");
        });
    }
  }, [stage]);

  /** ✅ Capture Image Without Stretching */
  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Match canvas size to actual video feed
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

    const dataUrl = canvas.toDataURL("image/png");
    setImage(dataUrl);
    analyzeImage(dataUrl);
  };

  /** Analyze Image */
  const analyzeImage = async (img: string) => {
    setStage("analyzing");
    setStepIndex(0);
    
    // Draw the base image on canvas during analysis
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d")!;
      const baseImg = new Image();
      
      baseImg.onload = () => {
        canvas.width = baseImg.width;
        canvas.height = baseImg.height;
        ctx.drawImage(baseImg, 0, 0);
      };
      baseImg.src = img;
    }
    
    try {
      const res = await fetch("http://localhost:3001/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: img }),
      });

      const data = await res.json();
      
      console.log("✅ Server response:", data);

      if (!data.success) {
        console.error("❌ Analysis failed:", data.message || data.error);
        setErrorMessage(data.message || data.error || "Palm analysis failed. Please try again with better lighting.");
        setStage("error");
        return;
      }

      // First set the data from server
      const detectedLines = data.lines || [];
      const detectedFingertips = data.fingertips || [];
      
      setLines(detectedLines);
      setFingertips(detectedFingertips);
      setAnalysis(data.analysis || null);

      // Then animate through detection steps with the actual data
      const totalItems = detectedLines.length + detectedFingertips.length;
      
      if (totalItems === 0) {
        console.warn("⚠️ No palm lines or fingertips detected");
        setErrorMessage("No palm lines detected. Please ensure your palm is clearly visible with good lighting and try again.");
        setStage("error");
        return;
      }

      // Animate through each detected item
      for (let i = 1; i <= totalItems; i++) {
        setStepIndex(i);
        await new Promise((r) => setTimeout(r, 1000));
      }

      setStage("result");
    } catch (error) {
      console.error("❌ Network/Server error:", error);
      setErrorMessage("Network error. Please check if the server is running on port 3001 and try again.");
      setStage("error");
    }
  };

  // Effect to draw progressive analysis visualization
  useEffect(() => {
    if (stage === "analyzing" && image && canvasRef.current && stepIndex > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d")!;
      
      // Draw lines up to current step
      if (stepIndex <= lines.length) {
        const currentLine = lines[stepIndex - 1];
        if (currentLine) {
          // Highlight current line being analyzed
          const color = getColor(currentLine.class);
          ctx.strokeStyle = color;
          ctx.lineWidth = 6;
          ctx.lineCap = 'round';
          ctx.shadowColor = color;
          ctx.shadowBlur = 10;

          ctx.beginPath();
          ctx.moveTo(currentLine.x1, currentLine.y1);
          ctx.lineTo(currentLine.x2, currentLine.y2);
          ctx.stroke();
          
          // Reset shadow
          ctx.shadowBlur = 0;
          
          // Add label
          ctx.font = "bold 16px Arial";
          ctx.fillStyle = "white";
          ctx.strokeStyle = "black";
          ctx.lineWidth = 3;
          const labelText = currentLine.class.replace('_', ' ').toUpperCase();
          ctx.strokeText(labelText, currentLine.x1 + 8, currentLine.y1 - 8);
          ctx.fillText(labelText, currentLine.x1 + 8, currentLine.y1 - 8);
        }
      } else {
        // Draw fingertip being analyzed
        const fingertipIndex = stepIndex - lines.length - 1;
        const currentFingertip = fingertips[fingertipIndex];
        if (currentFingertip) {
          const color = getFingertipColor(currentFingertip.name);
          
          // Pulsing circle effect
          const pulseRadius = 12 + Math.sin(Date.now() / 200) * 4;
          
          // Outer glow
          ctx.beginPath();
          ctx.arc(currentFingertip.x, currentFingertip.y, pulseRadius + 8, 0, 2 * Math.PI);
          ctx.fillStyle = `${color}30`;
          ctx.fill();
          
          // Main circle
          ctx.beginPath();
          ctx.arc(currentFingertip.x, currentFingertip.y, pulseRadius, 0, 2 * Math.PI);
          ctx.fillStyle = color;
          ctx.fill();
          ctx.strokeStyle = "white";
          ctx.lineWidth = 3;
          ctx.stroke();
          
          // Label
          ctx.font = "bold 14px Arial";
          ctx.fillStyle = "white";
          ctx.strokeStyle = "black";
          ctx.lineWidth = 3;
          const labelText = currentFingertip.name.toUpperCase();
          ctx.strokeText(labelText, currentFingertip.x - (labelText.length * 4), currentFingertip.y + 30);
          ctx.fillText(labelText, currentFingertip.x - (labelText.length * 4), currentFingertip.y + 30);
        }
      }
    }
  }, [stage, stepIndex, lines, fingertips, image]);

  /** ✅ Draw Image + Lines + Fingertips Correctly */
  useEffect(() => {
    if (stage === "result" && image && (lines.length > 0 || fingertips.length > 0) && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d")!;
      const baseImg = new Image();

      baseImg.onload = () => {
        // Resize canvas to actual image size for consistency
        canvas.width = baseImg.width;
        canvas.height = baseImg.height;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(baseImg, 0, 0, baseImg.width, baseImg.height);

        // No scaling needed as coordinates should match image dimensions
        const scaleX = 1;
        const scaleY = 1;

        // Draw palm lines with consistent styling
        lines.forEach((line, idx) => {
          setTimeout(() => {
            const x1 = line.x1 * scaleX;
            const y1 = line.y1 * scaleY;
            const x2 = line.x2 * scaleX;
            const y2 = line.y2 * scaleY;

            // Create gradient for line
            const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
            const color = getColor(line.class);
            gradient.addColorStop(0, color);
            gradient.addColorStop(0.5, `${color}CC`); // 80% opacity
            gradient.addColorStop(1, color);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 5;
            ctx.lineCap = 'round';
            ctx.shadowColor = color;
            ctx.shadowBlur = 8;

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();

            // Reset shadow for text
            ctx.shadowBlur = 0;

            // Line label with better styling
            const labelText = line.class.replace('_', ' ').toUpperCase();
            ctx.font = "bold 16px Arial";
            ctx.fillStyle = "white";
            ctx.strokeStyle = "black";
            ctx.lineWidth = 3;
            ctx.strokeText(labelText, x1 + 8, y1 - 8);
            ctx.fillText(labelText, x1 + 8, y1 - 8);
          }, idx * 600);
        });

        // Draw fingertips with consistent positioning
        fingertips.forEach((fingertip, idx) => {
          setTimeout(() => {
            const x = fingertip.x * scaleX;
            const y = fingertip.y * scaleY;

            // Draw fingertip circle with glow effect
            const color = getFingertipColor(fingertip.name);
            
            // Outer glow
            ctx.beginPath();
            ctx.arc(x, y, 16, 0, 2 * Math.PI);
            ctx.fillStyle = `${color}40`; // 25% opacity
            ctx.fill();
            
            // Main circle
            ctx.beginPath();
            ctx.arc(x, y, 12, 0, 2 * Math.PI);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.strokeStyle = "white";
            ctx.lineWidth = 3;
            ctx.stroke();

            // Inner highlight
            ctx.beginPath();
            ctx.arc(x - 3, y - 3, 4, 0, 2 * Math.PI);
            ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
            ctx.fill();

            // Fingertip label with better positioning
            const labelText = fingertip.name.toUpperCase();
            ctx.font = "bold 14px Arial";
            ctx.fillStyle = "white";
            ctx.strokeStyle = "black";
            ctx.lineWidth = 3;
            
            // Calculate text position to avoid overlap
            const textY = y > canvas.height / 2 ? y - 25 : y + 30;
            ctx.strokeText(labelText, x - (labelText.length * 4), textY);
            ctx.fillText(labelText, x - (labelText.length * 4), textY);
          }, (lines.length + idx) * 600);
        });
      };

      baseImg.src = image;
    }
  }, [stage, image, lines, fingertips]);

  const getColor = (lineClass: string) => {
    switch (lineClass) {
      case "heart_line":
        return "#FF6B6B"; // Red
      case "head_line":
        return "#4ECDC4"; // Teal
      case "life_line":
        return "#45B7D1"; // Blue
      case "fate_line":
        return "#FFA726"; // Orange
      case "sun_line":
        return "#AB47BC"; // Purple
      default:
        return "#FFFFFF"; // White - full 6-character hex
    }
  };

  const getFingertipColor = (fingerName: string) => {
    switch (fingerName) {
      case "thumb":
        return "#E91E63"; // Pink
      case "index":
        return "#2196F3"; // Blue
      case "middle":
        return "#4CAF50"; // Green
      case "ring":
        return "#FF9800"; // Orange
      case "pinky":
        return "#9C27B0"; // Purple
      default:
        return "#607D8B"; // Blue Grey
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="container">
        <div className="header">
          <h1>Palm Reader AI</h1>
          <p>Analyze your palm lines instantly using advanced AI technology. Discover your personality traits, strengths, and mystical insights through palmistry.</p>
        </div>

        <div className="main-content">
          {stage === "camera" && (
            <div className="card">
              <h2>📸 Capture Your Palm</h2>
              <div className="video-container">
                <video ref={videoRef} autoPlay playsInline />
              </div>
              <canvas ref={canvasRef} style={{ display: "none" }} />
              <button onClick={captureImage}>📸 Capture Palm Reading</button>
            </div>
          )}

          {stage === "analyzing" && (
            <div className="card">
              <h2>🔍 Analyzing {
                lines.length > 0 && stepIndex <= lines.length 
                  ? `${lines[stepIndex - 1]?.class?.replace("_", " ") || "palm lines"}` 
                  : fingertips.length > 0 && stepIndex > lines.length
                  ? `${fingertips[stepIndex - lines.length - 1]?.name || "fingertip"} positioning`
                  : stepIndex === 0 
                  ? "your palm image..."
                  : "palm features..."
              }</h2>
              <div className="video-container">
                <canvas ref={canvasRef} />
              </div>
              <div className="progress-bar">
                <div
                  className="progress"
                  style={{ 
                    width: lines.length + fingertips.length > 0 
                      ? `${(stepIndex / (lines.length + fingertips.length)) * 100}%`
                      : stepIndex === 0 ? "0%" : "50%"
                  }}
                />
              </div>
              <p style={{ textAlign: 'center', marginTop: '15px', color: '#667eea', fontWeight: '500' }}>
                {stepIndex === 0 
                  ? "Connecting to AI palm reading service..."
                  : lines.length > 0 && stepIndex <= lines.length 
                  ? `Detecting and analyzing palm line ${stepIndex} of ${lines.length}...` 
                  : fingertips.length > 0
                  ? `Mapping fingertip ${stepIndex - lines.length} of ${fingertips.length}...`
                  : "Processing palm analysis..."
                }
              </p>
            </div>
          )}

          {stage === "result" && (
            <div className="card">
              <h2>✨ Your Palm Reading Results</h2>
              <div className="video-container">
                <canvas ref={canvasRef} />
              </div>
              
              <div className="results">
                <div className="analysis-section">
                  <h3>🔮 Palm Lines Detected</h3>
                  {lines.map((line, idx) => (
                    <div key={idx} style={{ marginBottom: '15px', padding: '10px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', borderLeft: `4px solid ${getColor(line.class)}` }}>
                      <p style={{ color: getColor(line.class), fontWeight: 'bold', marginBottom: '5px' }}>
                        {line.class.replace("_", " ").toUpperCase()} - {Math.round((line.confidence || 0.7) * 100)}% confidence
                      </p>
                      <p style={{ marginBottom: '8px' }}>{line.description}</p>
                      {analysis?.detailedReadings?.lines[line.class] && (
                        <p style={{ fontSize: '0.9em', fontStyle: 'italic', opacity: 0.9 }}>
                          {analysis.detailedReadings.lines[line.class].meaning}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {fingertips.length > 0 && (
                  <div className="analysis-section">
                    <h3>👆 Fingertips Analysis</h3>
                    {fingertips.map((fingertip, idx) => (
                      <div key={idx} style={{ marginBottom: '15px', padding: '10px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', borderLeft: `4px solid ${getFingertipColor(fingertip.name)}` }}>
                        <p style={{ color: getFingertipColor(fingertip.name), fontWeight: 'bold', marginBottom: '5px' }}>
                          {fingertip.name.toUpperCase()} FINGER - {Math.round((fingertip.confidence || 0.8) * 100)}% detected
                        </p>
                        <p style={{ marginBottom: '8px' }}>{fingertip.description}</p>
                        {analysis?.detailedReadings?.fingertips[fingertip.name] && (
                          <p style={{ fontSize: '0.9em', fontStyle: 'italic', opacity: 0.9 }}>
                            {analysis.detailedReadings.fingertips[fingertip.name].meaning}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {analysis && (
                  <>
                    <div className="analysis-section">
                      <h3>🌟 Personality Analysis</h3>
                      <p style={{ marginBottom: '15px' }}>{analysis.personality}</p>
                      
                      {analysis.strengths.length > 0 && (
                        <div style={{ marginBottom: '15px' }}>
                          <h4>✨ Your Key Strengths:</h4>
                          <ul>
                            {analysis.strengths.map((strength, idx) => (
                              <li key={idx} style={{ marginBottom: '5px' }}>{strength}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {analysis.challenges && analysis.challenges.length > 0 && (
                        <div>
                          <h4>🎯 Areas for Growth:</h4>
                          <ul>
                            {analysis.challenges.map((challenge, idx) => (
                              <li key={idx} style={{ marginBottom: '5px' }}>{challenge}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="analysis-section starseed-section">
                      <h3>✨ Your Starseed Origin & Mission</h3>
                      <p style={{ lineHeight: '1.8', fontSize: '1.05em' }}>{analysis.starseed}</p>
                    </div>

                    <div className="analysis-section overall-section">
                      <h3>🎯 Complete Palm Reading Summary</h3>
                      <p style={{ lineHeight: '1.8', fontSize: '1.05em' }}>{analysis.overall}</p>
                    </div>
                  </>
                )}
              </div>
              
              <button onClick={() => setStage("camera")}>🔁 Scan Another Palm</button>
            </div>
          )}

          {stage === "error" && (
            <div className="card error-container">
              <h2>❌ Analysis Error</h2>
              <p>{errorMessage}</p>
              <button onClick={() => setStage("camera")}>🔁 Try Again</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
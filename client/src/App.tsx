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
}

function App() {
  const [stage, setStage] = useState<"camera" | "analyzing" | "result" | "error">("camera");
  const [stepIndex, setStepIndex] = useState(0);
  const [image, setImage] = useState<string | null>(null);
  const [lines, setLines] = useState<LineData[]>([]);
  const [fingertips, setFingertips] = useState<FingertipData[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (stage === "camera" && navigator.mediaDevices && videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } })
        .then((stream) => {
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch(() => setStage("error"));
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
    try {
      // Get image dimensions for better server processing
      const tempImage = new Image();
      await new Promise((resolve) => {
        tempImage.onload = resolve;
        tempImage.src = img;
      });

      const res = await fetch("http://localhost:3001/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          image: img,
          imageWidth: tempImage.width,
          imageHeight: tempImage.height 
        }),
      });

      const data = await res.json();
      if (!data.success) return setStage("error");

      setLines(data.lines || []);
      setFingertips(data.fingertips || []);
      setAnalysis(data.analysis || null);

      // Animate through detection steps
      const totalItems = (data.lines?.length || 0) + (data.fingertips?.length || 0);
      for (let i = 1; i <= totalItems; i++) {
        setStepIndex(i);
        await new Promise((r) => setTimeout(r, 600)); // Faster animation
      }

      setStage("result");
    } catch {
      setStage("error");
    }
  };

  /** ✅ Draw Image + Lines + Fingertips Correctly */
  useEffect(() => {
    if (stage === "result" && image && (lines.length > 0 || fingertips.length > 0) && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d")!;
      const baseImg = new Image();

      baseImg.onload = () => {
        // Set canvas to match the display size but maintain aspect ratio
        const displayWidth = canvas.offsetWidth;
        const aspectRatio = baseImg.height / baseImg.width;
        const displayHeight = displayWidth * aspectRatio;
        
        canvas.width = baseImg.width;
        canvas.height = baseImg.height;
        canvas.style.width = displayWidth + 'px';
        canvas.style.height = displayHeight + 'px';

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(baseImg, 0, 0, baseImg.width, baseImg.height);

        // No scaling needed since we're using actual image coordinates
        const scaleX = 1;
        const scaleY = 1;

        // Draw palm lines with animation
        lines.forEach((line, idx) => {
          setTimeout(() => {
            const x1 = line.x1 * scaleX;
            const y1 = line.y1 * scaleY;
            const x2 = line.x2 * scaleX;
            const y2 = line.y2 * scaleY;

            // Create a more visible gradient
            const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
            const color = getColor(line.class);
            gradient.addColorStop(0, color);
            gradient.addColorStop(0.5, color + 'CC'); // More opaque
            gradient.addColorStop(1, color);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 6; // Thicker lines for better visibility
            ctx.lineCap = 'round';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
            ctx.shadowBlur = 4;

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();

            // Reset shadow
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;

            // Line label with better visibility
            ctx.font = "bold 16px Inter, Arial";
            ctx.fillStyle = "white";
            ctx.strokeStyle = "rgba(0, 0, 0, 0.8)";
            ctx.lineWidth = 3;
            const labelText = line.class.replace('_', ' ').toUpperCase();
            ctx.strokeText(labelText, x1 + 10, y1 - 15);
            ctx.fillText(labelText, x1 + 10, y1 - 15);
          }, idx * 300); // Faster animation
        });

        // Draw fingertips with animation
        fingertips.forEach((fingertip, idx) => {
          setTimeout(() => {
            const x = fingertip.x * scaleX;
            const y = fingertip.y * scaleY;

            // Draw fingertip circle with shadow
            ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
            ctx.shadowBlur = 6;
            
            ctx.beginPath();
            ctx.arc(x, y, 15, 0, 2 * Math.PI); // Larger circles
            ctx.fillStyle = getFingertipColor(fingertip.name);
            ctx.fill();
            ctx.strokeStyle = "white";
            ctx.lineWidth = 3;
            ctx.stroke();

            // Reset shadow
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;

            // Fingertip label with better positioning
            ctx.font = "bold 14px Inter, Arial";
            ctx.fillStyle = "white";
            ctx.strokeStyle = "rgba(0, 0, 0, 0.8)";
            ctx.lineWidth = 2;
            const labelText = fingertip.name.toUpperCase();
            const textWidth = ctx.measureText(labelText).width;
            ctx.strokeText(labelText, x - textWidth / 2, y + 35);
            ctx.fillText(labelText, x - textWidth / 2, y + 35);
          }, (lines.length * 300) + (idx * 200)); // Stagger after lines
        });
      };

      baseImg.src = image;
    }
  }, [stage, image, lines, fingertips]);

  const getColor = (lineClass: string) => {
    switch (lineClass) {
      case "heart_line":
        return "#FF1744"; // Bright Red
      case "head_line":
        return "#00E676"; // Bright Green
      case "life_line":
        return "#2979FF"; // Bright Blue
      case "fate_line":
        return "#FF9100"; // Bright Orange
      case "sun_line":
        return "#E91E63"; // Bright Pink
      default:
        return "#FFFFFF"; // White
    }
  };

  const getFingertipColor = (fingerName: string) => {
    switch (fingerName) {
      case "thumb":
        return "#FF5722"; // Deep Orange
      case "index":
        return "#3F51B5"; // Indigo
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
                stepIndex <= lines.length 
                  ? lines[stepIndex - 1]?.class.replace("_", " ") || "palm lines" 
                  : fingertips[stepIndex - lines.length - 1]?.name + " fingertip" || "fingertips"
              }</h2>
              <div className="progress-bar">
                <div
                  className="progress"
                  style={{ width: `${(stepIndex / (lines.length + fingertips.length)) * 100}%` }}
                />
              </div>
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
                    <p key={idx} style={{ color: getColor(line.class) }}>
                      <strong>{line.class.replace("_", " ")}:</strong> {line.description}
                    </p>
                  ))}
                </div>

                {fingertips.length > 0 && (
                  <div className="analysis-section">
                    <h3>👆 Fingertips Analysis</h3>
                    {fingertips.map((fingertip, idx) => (
                      <p key={idx} style={{ color: getFingertipColor(fingertip.name) }}>
                        <strong>{fingertip.name} finger:</strong> {fingertip.description}
                      </p>
                    ))}
                  </div>
                )}

                {analysis && (
                  <>
                    <div className="analysis-section">
                      <h3>🌟 Personality Analysis</h3>
                      <p>{analysis.personality}</p>
                      
                      {analysis.strengths.length > 0 && (
                        <div>
                          <h4>Your Strengths:</h4>
                          <ul>
                            {analysis.strengths.map((strength, idx) => (
                              <li key={idx}>{strength}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {analysis.challenges.length > 0 && (
                        <div>
                          <h4>Areas for Growth:</h4>
                          <ul>
                            {analysis.challenges.map((challenge, idx) => (
                              <li key={idx}>{challenge}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="analysis-section starseed-section">
                      <h3>✨ Starseed Reading</h3>
                      <p>{analysis.starseed}</p>
                    </div>

                    <div className="analysis-section overall-section">
                      <h3>🎯 Overall Analysis</h3>
                      <p>{analysis.overall}</p>
                    </div>
                  </>
                )}
              </div>
              
              <button onClick={() => setStage("camera")}>🔁 Scan Another Palm</button>
            </div>
          )}

          {stage === "error" && (
            <div className="card error-container">
              <h2>❌ Palm Not Detected</h2>
              <p>Please ensure your hand is clearly visible within the camera frame and try again. Make sure there's adequate lighting for the best results.</p>
              <button onClick={() => setStage("camera")}>🔁 Try Again</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
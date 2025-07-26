import React, { useState, useRef, useEffect } from "react";
import "./App.css";

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
      const res = await fetch("http://localhost:3001/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: img }),
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
        await new Promise((r) => setTimeout(r, 800));
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
        // Resize canvas to actual image size
        canvas.width = baseImg.width;
        canvas.height = baseImg.height;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(baseImg, 0, 0, baseImg.width, baseImg.height);

        const scaleX = canvas.width / baseImg.width;
        const scaleY = canvas.height / baseImg.height;

        // Draw palm lines
        lines.forEach((line, idx) => {
          setTimeout(() => {
            const x1 = line.x1 * scaleX;
            const y1 = line.y1 * scaleY;
            const x2 = line.x2 * scaleX;
            const y2 = line.y2 * scaleY;

            const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
            const color = getColor(line.class);
            gradient.addColorStop(0, color);
            gradient.addColorStop(0.5, `${color}80`); // Semi-transparent (50% opacity)
            gradient.addColorStop(1, color);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 4;
            ctx.lineCap = 'round';

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();

            // Line label
            ctx.font = "bold 14px Arial";
            ctx.fillStyle = "white";
            ctx.strokeStyle = "black";
            ctx.lineWidth = 2;
            ctx.strokeText(line.class.replace('_', ' '), x1 + 5, y1 - 10);
            ctx.fillText(line.class.replace('_', ' '), x1 + 5, y1 - 10);
          }, idx * 500);
        });

        // Draw fingertips
        fingertips.forEach((fingertip, idx) => {
          setTimeout(() => {
            const x = fingertip.x * scaleX;
            const y = fingertip.y * scaleY;

            // Draw fingertip circle
            ctx.beginPath();
            ctx.arc(x, y, 12, 0, 2 * Math.PI);
            ctx.fillStyle = getFingertipColor(fingertip.name);
            ctx.fill();
            ctx.strokeStyle = "white";
            ctx.lineWidth = 2;
            ctx.stroke();

            // Fingertip label
            ctx.font = "bold 12px Arial";
            ctx.fillStyle = "white";
            ctx.strokeStyle = "black";
            ctx.lineWidth = 2;
            ctx.strokeText(fingertip.name, x - 15, y + 25);
            ctx.fillText(fingertip.name, x - 15, y + 25);
          }, (lines.length + idx) * 500);
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
    <div className="container">
      <div className="header">
        <h1>Palm Reader AI</h1>
        <p>Analyze your palm lines instantly using AI technology.</p>
      </div>

      {stage === "camera" && (
        <div className="card">
          <h1>Palm Reader AI</h1>
          <video ref={videoRef} autoPlay playsInline style={{ width: "100%", height: "auto" }} />
          <canvas ref={canvasRef} style={{ display: "none" }} />
          <button onClick={captureImage}>📸 Capture Palm</button>
        </div>
      )}

      {stage === "analyzing" && (
        <div className="card">
          <h2>Analyzing {
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
          <h2>✨ Your Palm Reading</h2>
          <canvas ref={canvasRef} style={{ maxWidth: "100%", height: "auto", marginBottom: "20px" }} />
          
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

                <div className="starseed-section">
                  <h3>✨ Starseed Reading</h3>
                  <p>{analysis.starseed}</p>
                </div>

                <div className="overall-section">
                  <h3>🎯 Overall Analysis</h3>
                  <p>{analysis.overall}</p>
                </div>
              </div>
            )}
          </div>
          
          <button onClick={() => setStage("camera")}>🔁 Try Again</button>
        </div>
      )}

      {stage === "error" && (
        <div className="card">
          <h2>❌ Palm Not Detected</h2>
          <p>Make sure your hand fits inside the frame and try again.</p>
          <button onClick={() => setStage("camera")}>🔁 Retry</button>
        </div>
      )}
    </div>
  );
}

export default App;

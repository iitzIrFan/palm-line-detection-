import React, { useState, useRef, useEffect } from "react";
import "./App.css";

interface LineData {
  class: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  description: string;
}

function App() {
  const [stage, setStage] = useState<"camera" | "analyzing" | "result" | "error">("camera");
  const [stepIndex, setStepIndex] = useState(0);
  const [image, setImage] = useState<string | null>(null);
  const [lines, setLines] = useState<LineData[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (stage === "camera" && navigator.mediaDevices && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then((stream) => {
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch(() => setStage("error"));
    }
  }, [stage]);

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    const dataUrl = canvasRef.current.toDataURL("image/png");
    setImage(dataUrl);
    analyzeImage(dataUrl);
  };

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

      setLines(data.lines);

      for (let i = 1; i <= data.lines.length; i++) {
        setStepIndex(i);
        await new Promise((r) => setTimeout(r, 800));
      }

      setStage("result");
    } catch {
      setStage("error");
    }
  };

  useEffect(() => {
    if (stage === "result" && image && lines.length > 0 && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d")!;
      const baseImg = new Image();

      baseImg.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(baseImg, 0, 0, canvas.width, canvas.height);
        ctx.lineWidth = 3;

        lines.forEach((line, idx) => {
          setTimeout(() => {
          const gradient = ctx.createLinearGradient(line.x1, line.y1, line.x2, line.y2);
gradient.addColorStop(0, "red");
gradient.addColorStop(0.5, "blue");
gradient.addColorStop(1, "green");
ctx.strokeStyle = gradient;
ctx.lineWidth = 3;

ctx.beginPath();
ctx.moveTo(line.x1, line.y1);
ctx.lineTo(line.x2, line.y2);
ctx.stroke();


            ctx.font = "14px Arial";
            ctx.fillStyle = "white";
            ctx.fillText(line.class, line.x1, line.y1 - 10);
          }, idx * 500);
        });
      };
      baseImg.src = image;
    }
  }, [stage, image, lines]);

  const getColor = (lineClass: string) => {
    switch (lineClass) {
      case "heart_line": return "red";
      case "head_line": return "blue";
      case "life_line": return "green";
      case "fate_line": return "orange";
      case "sun_line": return "purple";
      default: return "#fff";
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
          <video ref={videoRef} autoPlay playsInline width="300" height="400" />
          <canvas ref={canvasRef} width="300" height="400" style={{ display: "none" }} />
          <button onClick={captureImage}>📸 Capture Palm</button>
        </div>
      )}

      {stage === "analyzing" && (
        <div className="card">
          <h2>Analyzing {lines[stepIndex - 1]?.class.replace("_", " ") || "..."}</h2>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${(stepIndex / lines.length) * 100}%` }} />
          </div>
        </div>
      )}

      {stage === "result" && (
        <div className="card">
          <h2>✨ Your Palm Reading</h2>
          <canvas ref={canvasRef} width="300" height="400" />
          <div className="results">
            {lines.map((line, idx) => (
              <p key={idx}><strong>{line.class.replace("_", " ")}:</strong> {line.description}</p>
            ))}
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

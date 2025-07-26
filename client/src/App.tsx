import React, { useState, useRef, useEffect } from "react";
import "./App.css";

interface LineData {
  class: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  description: string;
  // Optional: If backend provides palm bounding box
  palmX?: number;
  palmY?: number;
  palmWidth?: number;
  palmHeight?: number;
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

  /** ✅ Draw Image + Lines Correctly */
  useEffect(() => {
    if (stage === "result" && image && lines.length > 0 && canvasRef.current) {
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

        // Optional: Clip to palm area if backend provides bounding box
        const palm = lines[0]; // assume bounding box from first line (update if available)
        if (palm.palmWidth && palm.palmHeight) {
          ctx.save();
          ctx.beginPath();
          ctx.rect(
            palm.palmX! * scaleX,
            palm.palmY! * scaleY,
            palm.palmWidth! * scaleX,
            palm.palmHeight! * scaleY
          );
          ctx.clip();
        }

        lines.forEach((line, idx) => {
          setTimeout(() => {
            const x1 = line.x1 * scaleX;
            const y1 = line.y1 * scaleY;
            const x2 = line.x2 * scaleX;
            const y2 = line.y2 * scaleY;

            const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
            gradient.addColorStop(0, "red");
            gradient.addColorStop(0.5, "blue");
            gradient.addColorStop(1, "green");
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 3;

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();

            ctx.font = "14px Arial";
            ctx.fillStyle = "white";
            ctx.fillText(line.class, x1, y1 - 10);
          }, idx * 500);
        });

        if (palm.palmWidth && palm.palmHeight) {
          ctx.restore(); // remove clipping after drawing
        }
      };

      baseImg.src = image;
    }
  }, [stage, image, lines]);

  const getColor = (lineClass: string) => {
    switch (lineClass) {
      case "heart_line":
        return "red";
      case "head_line":
        return "blue";
      case "life_line":
        return "green";
      case "fate_line":
        return "orange";
      case "sun_line":
        return "purple";
      default:
        return "#fff";
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
          <h2>Analyzing {lines[stepIndex - 1]?.class.replace("_", " ") || "..."}</h2>
          <div className="progress-bar">
            <div
              className="progress"
              style={{ width: `${(stepIndex / lines.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {stage === "result" && (
        <div className="card">
          <h2>✨ Your Palm Reading</h2>
          <canvas ref={canvasRef} style={{ maxWidth: "100%", height: "auto" }} />
          <div className="results">
            {lines.map((line, idx) => (
              <p key={idx}>
                <strong>{line.class.replace("_", " ")}:</strong> {line.description}
              </p>
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

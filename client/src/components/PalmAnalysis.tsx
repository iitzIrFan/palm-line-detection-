import React, { useEffect, useRef } from 'react';
import * as fabric from 'fabric';

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
}

const PalmAnalysis: React.FC<{ result: AnalysisResult | null }> = ({ result }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricRef = useRef<fabric.Canvas | null>(null);

    useEffect(() => {
        if (!canvasRef.current || !result) return;

        fabricRef.current = new fabric.Canvas(canvasRef.current, {
            selection: false,
            backgroundColor: '#f8f8f8'
        });

        fabric.Image.fromURL(result.image, {
            crossOrigin: 'anonymous'
        }).then((img: fabric.Image) => {
            if (!fabricRef.current) return;

            img.set({
                left: 0,
                top: 0,
                selectable: false
            });

            fabricRef.current.add(img);
            fabricRef.current.setDimensions({
                width: img.width || 500,
                height: img.height || 500
            });

            animateAnalysis(result);
        });

        return () => {
            fabricRef.current?.dispose();
        };
    }, [result]);

    const animateAnalysis = (result: AnalysisResult) => {
        if (!fabricRef.current) return;

        const canvas = fabricRef.current;
        
        // Draw palm lines with animation
        result.lines.forEach((line, index) => {
            setTimeout(() => {
                const lineObj = new fabric.Line([line.x1, line.y1, line.x2, line.y2], {
                    stroke: getLineColor(line.class),
                    strokeWidth: 4,
                    selectable: false,
                    strokeLineCap: 'round'
                });

                // Add text label
                const text = new fabric.Text(line.class.replace('_', ' '), {
                    left: line.x1,
                    top: line.y1 - 20,
                    fontSize: 14,
                    fill: 'white',
                    stroke: 'black',
                    strokeWidth: 1,
                    selectable: false
                });

                canvas.add(lineObj);
                canvas.add(text);
                canvas.renderAll();
            }, index * 800);
        });

        // Draw fingertips if available
        if (result.fingertips) {
            result.fingertips.forEach((fingertip, index) => {
                setTimeout(() => {
                    const circle = new fabric.Circle({
                        left: fingertip.x - 8,
                        top: fingertip.y - 8,
                        radius: 8,
                        fill: getFingertipColor(fingertip.name),
                        stroke: 'white',
                        strokeWidth: 2,
                        selectable: false
                    });

                    const text = new fabric.Text(fingertip.name, {
                        left: fingertip.x - 15,
                        top: fingertip.y + 15,
                        fontSize: 12,
                        fill: 'white',
                        stroke: 'black',
                        strokeWidth: 1,
                        selectable: false
                    });

                    canvas.add(circle);
                    canvas.add(text);
                    canvas.renderAll();
                }, (result.lines.length + index) * 800);
            });
        }
    };

    const getLineColor = (lineClass: string): string => {
        switch (lineClass) {
            case "heart_line": return "#FF6B6B";
            case "head_line": return "#4ECDC4";
            case "life_line": return "#45B7D1";
            case "fate_line": return "#FFA726";
            case "sun_line": return "#AB47BC";
            default: return "#666666"; // Full 6-character hex
        }
    };

    const getFingertipColor = (fingerName: string): string => {
        switch (fingerName) {
            case "thumb": return "#E91E63";
            case "index": return "#2196F3";
            case "middle": return "#4CAF50";
            case "ring": return "#FF9800";
            case "pinky": return "#9C27B0";
            default: return "#607D8B";
        }
    };

    return (
        <div className="palm-analysis">
            <canvas ref={canvasRef} style={{ maxWidth: '100%', height: 'auto' }} />
        </div>
    );
};

export default PalmAnalysis;
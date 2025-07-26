import React, { useEffect, useRef } from 'react';
import * as fabric from 'fabric';  // Changed from named import to namespace import

const PalmAnalysis: React.FC<{ result: any }> = ({ result }) => {
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
        }).then((img: fabric.Image) => {  // Added explicit type annotation
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

    const animateAnalysis = (result: any) => {
        // Animation logic here
    };

    return <canvas ref={canvasRef} />;
};

export default PalmAnalysis;
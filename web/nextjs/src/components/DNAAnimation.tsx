'use client';

import { useEffect, useRef } from 'react';

export default function DNAAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = 300;
      canvas.height = 400;
    };

    resizeCanvas();

    const helixRadius = 50;
    const helixHeight = 300;
    const segments = 20;
    let rotation = 0;

    const draw = () => {
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Project 3D to 2D
      const project3D = (x: number, y: number, z: number) => {
        const perspective = 400;
        const scale = perspective / (perspective + z);
        return {
          x: centerX + x * scale,
          y: centerY + y * scale,
          scale: scale
        };
      };

      // Draw left helix
      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = 4;
      ctx.beginPath();
      
      for (let i = 0; i <= segments; i++) {
        const y = (i / segments - 0.5) * helixHeight;
        const angle = (i / segments) * Math.PI * 4 + rotation;
        const x = Math.cos(angle) * helixRadius;
        const z = Math.sin(angle) * helixRadius + 100;
        
        const projected = project3D(x, y, z);
        if (i === 0) {
          ctx.moveTo(projected.x, projected.y);
        } else {
          ctx.lineTo(projected.x, projected.y);
        }
      }
      ctx.stroke();

      // Draw right helix
      ctx.strokeStyle = '#818cf8';
      ctx.lineWidth = 4;
      ctx.beginPath();
      
      for (let i = 0; i <= segments; i++) {
        const y = (i / segments - 0.5) * helixHeight;
        const angle = (i / segments) * Math.PI * 4 + rotation + Math.PI;
        const x = Math.cos(angle) * helixRadius;
        const z = Math.sin(angle) * helixRadius + 100;
        
        const projected = project3D(x, y, z);
        if (i === 0) {
          ctx.moveTo(projected.x, projected.y);
        } else {
          ctx.lineTo(projected.x, projected.y);
        }
      }
      ctx.stroke();

      // Draw connecting lines
      ctx.strokeStyle = '#a5b4fc';
      ctx.lineWidth = 2;
      
      for (let i = 0; i <= segments; i++) {
        const y = (i / segments - 0.5) * helixHeight;
        const angle = (i / segments) * Math.PI * 4 + rotation;
        
        const leftX = Math.cos(angle) * helixRadius;
        const leftZ = Math.sin(angle) * helixRadius + 100;
        const rightX = Math.cos(angle + Math.PI) * helixRadius;
        const rightZ = Math.sin(angle + Math.PI) * helixRadius + 100;
        
        const leftProjected = project3D(leftX, y, leftZ);
        const rightProjected = project3D(rightX, y, rightZ);
        
        ctx.beginPath();
        ctx.moveTo(leftProjected.x, leftProjected.y);
        ctx.lineTo(rightProjected.x, rightProjected.y);
        ctx.stroke();
      }

      rotation += 0.02;
      requestAnimationFrame(draw);
    };

    draw();
  }, []);

  return (
    <div className="flex justify-center items-center my-8">
      <canvas
        ref={canvasRef}
        className="drop-shadow-lg"
        style={{
          imageRendering: 'crisp-edges',
        }}
      />
    </div>
  );
}

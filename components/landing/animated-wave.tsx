"use client";

import { useEffect, useRef } from "react";

export function AnimatedWave() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const chars = "·∘○◯◌●◉";
    let time = 0;
    let lastTime = 0;
    const FRAME_INTERVAL = 1000 / 24; // 24fps is enough for a background wave
    let width = 0, height = 0, cols = 0, rows = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      cols = Math.floor(width / 20);
      rows = Math.floor(height / 20);
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const render = (timestamp: number) => {
      frameRef.current = requestAnimationFrame(render);
      if (timestamp - lastTime < FRAME_INTERVAL) return;
      lastTime = timestamp;

      ctx.clearRect(0, 0, width, height);
      ctx.font = "14px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const colW = width / cols;
      const rowH = height / rows;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const wave1 = Math.sin(x * 0.2 + time * 2) * Math.cos(y * 0.15 + time);
          const wave2 = Math.sin((x + y) * 0.1 + time * 1.5);
          const combined = (wave1 + wave2) / 2;
          const normalized = (combined + 1) / 2;
          const charIndex = Math.floor(normalized * (chars.length - 1));
          const alpha = (0.15 + normalized * 0.5).toFixed(2);
          ctx.fillStyle = `rgba(0,0,0,${alpha})`;
          ctx.fillText(chars[charIndex], (x + 0.5) * colW, (y + 0.5) * rowH);
        }
      }

      time += 0.03;
    };

    frameRef.current = requestAnimationFrame(render);

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: "block", willChange: "contents" }}
    />
  );
}

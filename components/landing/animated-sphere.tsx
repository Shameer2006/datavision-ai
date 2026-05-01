"use client";

import { useEffect, useRef } from "react";

export function AnimatedSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const chars = "░▒▓█▀▄▌▐│─┤├┴┬╭╮╰╯";
    let time = 0;
    let lastTime = 0;
    const TARGET_FPS = 30;
    const FRAME_INTERVAL = 1000 / TARGET_FPS;

    let width = 0, height = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    // Pre-generate sphere points at fixed angles (only recalc rotation each frame)
    const PHI_STEP = 0.22;
    const THETA_STEP = 0.22;
    const basePoints: { bx: number; by: number; bz: number }[] = [];
    for (let phi = 0; phi < Math.PI * 2; phi += PHI_STEP) {
      for (let theta = 0; theta < Math.PI; theta += THETA_STEP) {
        basePoints.push({
          bx: Math.sin(theta) * Math.cos(phi),
          by: Math.sin(theta) * Math.sin(phi),
          bz: Math.cos(theta),
        });
      }
    }

    const points: { x: number; y: number; z: number; char: string }[] = basePoints.map(() => ({ x: 0, y: 0, z: 0, char: '' }));

    const render = (timestamp: number) => {
      frameRef.current = requestAnimationFrame(render);
      if (timestamp - lastTime < FRAME_INTERVAL) return;
      lastTime = timestamp;

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) * 0.525;

      ctx.font = "12px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const rotY = time * 0.3;
      const rotX = time * 0.2;
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX), sinX = Math.sin(rotX);

      for (let i = 0; i < basePoints.length; i++) {
        const { bx, by, bz } = basePoints[i];
        const nx = bx * cosY - bz * sinY;
        const nz = bx * sinY + bz * cosY;
        const ny = by * cosX - nz * sinX;
        const fz = by * sinX + nz * cosX;
        const depth = (fz + 1) / 2;
        points[i].x = centerX + nx * radius;
        points[i].y = centerY + ny * radius;
        points[i].z = fz;
        points[i].char = chars[Math.floor(depth * (chars.length - 1))];
      }

      points.sort((a, b) => a.z - b.z);

      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        ctx.fillStyle = `rgba(0,0,0,${(0.2 + (p.z + 1) * 0.4).toFixed(2)})`;
        ctx.fillText(p.char, p.x, p.y);
      }

      time += 0.02;
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
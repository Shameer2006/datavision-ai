"use client";

import { useEffect, useRef } from "react";

export function AnimatedTetrahedron() {
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
    const FRAME_INTERVAL = 1000 / 30;
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

    const vertices = [
      { x: 0, y: 1, z: 0 },
      { x: -0.943, y: -0.333, z: -0.5 },
      { x: 0.943, y: -0.333, z: -0.5 },
      { x: 0, y: -0.333, z: 1 },
    ];
    const edges = [[0,1],[0,2],[0,3],[1,2],[2,3],[3,1]];
    const faces = [[0,1,2],[0,2,3],[0,3,1],[1,3,2]];

    // Pre-generate all base points
    const basePoints: { x: number; y: number; z: number }[] = [];
    edges.forEach(([i, j]) => {
      const v1 = vertices[i], v2 = vertices[j];
      for (let t = 0; t <= 1; t += 0.07) {
        basePoints.push({ x: v1.x+(v2.x-v1.x)*t, y: v1.y+(v2.y-v1.y)*t, z: v1.z+(v2.z-v1.z)*t });
      }
    });
    faces.forEach(([i, j, k]) => {
      const v1 = vertices[i], v2 = vertices[j], v3 = vertices[k];
      for (let u = 0; u <= 1; u += 0.15) {
        for (let v = 0; v <= 1-u; v += 0.15) {
          const w = 1-u-v;
          basePoints.push({ x: v1.x*u+v2.x*v+v3.x*w, y: v1.y*u+v2.y*v+v3.y*w, z: v1.z*u+v2.z*v+v3.z*w });
        }
      }
    });

    const out: { x: number; y: number; z: number; char: string }[] = basePoints.map(() => ({ x:0,y:0,z:0,char:'' }));

    const render = (timestamp: number) => {
      frameRef.current = requestAnimationFrame(render);
      if (timestamp - lastTime < FRAME_INTERVAL) return;
      lastTime = timestamp;

      ctx.clearRect(0, 0, width, height);
      const cx = width / 2, cy = height / 2;
      const scale = Math.min(width, height) * 0.7;
      ctx.font = "18px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const cosY = Math.cos(time*0.4), sinY = Math.sin(time*0.4);
      const cosX = Math.cos(time*0.3), sinX = Math.sin(time*0.3);
      const cosZ = Math.cos(time*0.2), sinZ = Math.sin(time*0.2);

      for (let i = 0; i < basePoints.length; i++) {
        let { x, y, z } = basePoints[i];
        // rotateY
        let nx = x*cosY - z*sinY; let nz = x*sinY + z*cosY; x=nx; z=nz;
        // rotateX
        let ny = y*cosX - z*sinX; nz = y*sinX + z*cosX; y=ny; z=nz;
        // rotateZ
        nx = x*cosZ - y*sinZ; ny = x*sinZ + y*cosZ; x=nx; y=ny;
        const depth = (z+1.5)/3;
        out[i].x = cx + x*scale;
        out[i].y = cy - y*scale;
        out[i].z = z;
        out[i].char = chars[Math.min(Math.floor(depth*(chars.length-1)), chars.length-1)];
      }

      out.sort((a,b) => a.z-b.z);

      for (let i = 0; i < out.length; i++) {
        const p = out[i];
        ctx.fillStyle = `rgba(0,0,0,${Math.min(0.15+(p.z+1.5)*0.25, 0.9).toFixed(2)})`;
        ctx.fillText(p.char, p.x, p.y);
      }

      time += 0.015;
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

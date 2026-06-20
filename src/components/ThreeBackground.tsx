import { useEffect, useRef } from 'react';

interface TorusKnotProps {
  enabled?: boolean;
}

export default function ThreeBackground({ enabled = true }: TorusKnotProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    let time = 0;
    const points: { x: number; y: number; z: number }[] = [];
    const p = 2, q = 3;
    const numPoints = 400;
    const radius = Math.min(w, h) * 0.28;

    // Generate torus knot points
    for (let i = 0; i < numPoints; i++) {
      const t = (i / numPoints) * Math.PI * 2;
      const r = Math.cos(q * t) + 2;
      const x = r * Math.cos(p * t) * radius;
      const y = r * Math.sin(p * t) * radius;
      const z = -Math.sin(q * t) * radius;
      points.push({ x, y, z });
    }

    function project(x: number, y: number, z: number) {
      const fov = 800;
      const scale = fov / (fov + z);
      return {
        x: w / 2 + x * scale,
        y: h / 2 + y * scale,
        scale,
      };
    }

    function animate() {
      time += 0.004;
      ctx!.clearRect(0, 0, w, h);

      // Rotate points
      const rotY = time * 0.5;
      const rotX = Math.sin(time * 0.3) * 0.3;

      const projected: { x: number; y: number; alpha: number }[] = [];

      for (let i = 0; i < points.length; i++) {
        let { x, y, z } = points[i];

        // Apply warp
        const displacement = 8 * Math.sin(3 * x * 0.002 + time * 2) * Math.cos(3 * y * 0.002 + time * 2);
        const len = Math.sqrt(x * x + y * y + z * z) || 1;
        x += (x / len) * displacement;
        y += (y / len) * displacement;
        z += (z / len) * displacement;

        // Rotate Y
        const cosY = Math.cos(rotY);
        const sinY = Math.sin(rotY);
        const rx = x * cosY - z * sinY;
        const rz = x * sinY + z * cosY;
        x = rx;
        z = rz;

        // Rotate X
        const cosX = Math.cos(rotX);
        const sinX = Math.sin(rotX);
        const ry = y * cosX - z * sinX;
        const rzz = y * sinX + z * cosX;
        y = ry;
        z = rzz;

        const p = project(x, y, z);
        const depthAlpha = Math.max(0.1, Math.min(1, (p.scale - 0.3) * 1.5));
        projected.push({ x: p.x, y: p.y, alpha: depthAlpha });
      }

      // Draw connecting lines
      for (let i = 0; i < projected.length; i++) {
        const curr = projected[i];
        const next = projected[(i + 1) % projected.length];
        const alpha = (curr.alpha + next.alpha) / 2 * 0.35;

        ctx!.beginPath();
        ctx!.moveTo(curr.x, curr.y);
        ctx!.lineTo(next.x, next.y);
        ctx!.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
        ctx!.lineWidth = 1;
        ctx!.stroke();

        // Cross connections for wireframe density
        const skip = 12;
        const cross = projected[(i + skip) % projected.length];
        const crossAlpha = (curr.alpha + cross.alpha) / 2 * 0.12;
        ctx!.beginPath();
        ctx!.moveTo(curr.x, curr.y);
        ctx!.lineTo(cross.x, cross.y);
        ctx!.strokeStyle = `rgba(59, 130, 246, ${crossAlpha})`;
        ctx!.lineWidth = 0.5;
        ctx!.stroke();
      }

      // Draw points with glow
      for (let i = 0; i < projected.length; i += 3) {
        const p = projected[i];
        const size = 1.5 * p.alpha;

        // Glow
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, size * 4, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(59, 130, 246, ${p.alpha * 0.08})`;
        ctx!.fill();

        // Core
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(59, 130, 246, ${p.alpha * 0.6})`;
        ctx!.fill();
      }

      animRef.current = requestAnimationFrame(animate);
    }

    animate();

    function handleResize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}

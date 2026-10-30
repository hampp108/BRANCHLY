import React, { useEffect, useRef } from 'react';

export const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle nodes: emerald and cyan subtle dust
    const particleCount = Math.min(Math.floor((width * height) / 28000), 45);
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      alpha: number;
    }

    const colors = [
      'rgba(16, 185, 129, ', // emerald
      'rgba(6, 182, 212, ',  // cyan
      'rgba(132, 204, 22, ', // lime
    ];

    const particles: Particle[] = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: prefersReducedMotion ? 0 : (Math.random() - 0.5) * 0.35,
      vy: prefersReducedMotion ? 0 : (Math.random() - 0.5) * 0.35,
      radius: Math.random() * 1.5 + 0.8,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.35 + 0.15,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle connecting lines between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const lineAlpha = (1 - dist / 110) * 0.08;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(16, 185, 129, ${lineAlpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // Draw and update particles
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.fill();

        if (!prefersReducedMotion) {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#080B09]">
      {/* Aurora Ambient Mesh */}
      <div
        className="absolute top-[-10%] left-[-10%] w-[55vw] h-[55vw] rounded-full blur-[140px] opacity-25 mix-blend-screen pointer-events-none animate-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.4) 0%, rgba(6, 182, 212, 0.15) 50%, transparent 70%)',
          animationDuration: '12s',
        }}
      />
      <div
        className="absolute top-[40%] right-[-15%] w-[50vw] h-[50vw] rounded-full blur-[160px] opacity-20 mix-blend-screen pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.35) 0%, rgba(16, 185, 129, 0.1) 60%, transparent 75%)',
        }}
      />
      <div
        className="absolute bottom-[-10%] left-[25%] w-[45vw] h-[45vw] rounded-full blur-[150px] opacity-15 mix-blend-screen pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(132, 204, 22, 0.25) 0%, rgba(16, 185, 129, 0.1) 50%, transparent 70%)',
        }}
      />

      {/* Subtle Micro-Grid */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.15) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Star / Constellation Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};

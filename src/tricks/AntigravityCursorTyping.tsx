import {
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;

  constructor(width: number, height: number) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.radius = Math.random() * 1.5 + 0.5;
    this.baseAlpha = Math.random() * 0.3 + 0.1;
  }

  update(width: number, height: number) {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0) this.x = width;
    if (this.x > width) this.x = 0;
    if (this.y < 0) this.y = height;
    if (this.y > height) this.y = 0;
  }

  draw(ctx: CanvasRenderingContext2D, mouseX: number, mouseY: number) {
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    let alpha = this.baseAlpha;
    let r = this.radius;
    const maxDistance = 250;

    let factor = 0;
    if (distance < maxDistance) {
      factor = 1 - distance / maxDistance;
      alpha = Math.min(1, this.baseAlpha + factor * 0.8);
      r = this.radius + factor * 1.5;
    }

    ctx.beginPath();
    ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;

    if (factor > 0) {
      ctx.shadowBlur = 10 * factor;
      ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
    } else {
      ctx.shadowBlur = 0;
    }

    ctx.fill();
  }
}

export default function AntigravityCursorTyping() {
  const [text, setText] = useState("");
  const fullText = "Welcome to Antigravity.\nBuild the new way.";
  const [position, setPosition] = useState({ x: -1000, y: -1000 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Typing effect
  useEffect(() => {
    let i = 0;
    const interval = window.setInterval(() => {
      setText(fullText.slice(0, i + 1));
      i++;
      if (i === fullText.length) {
        window.clearInterval(interval);
      }
    }, 50);
    return () => window.clearInterval(interval);
  }, []);

  // Particle System
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let particles: Particle[] = [];

    const resize = () => {
      width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.parentElement?.clientHeight || window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const numParticles = Math.floor((width * height) / 6000); // Density of particles
      for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle(width, height));
      }
    };

    window.addEventListener("resize", resize);
    resize();

    let currentMouseX = -1000;
    let currentMouseY = -1000;

    const handleGlobalMouseMove = (e: globalThis.MouseEvent) => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        currentMouseX = e.clientX - rect.left;
        currentMouseY = e.clientY - rect.top;
      }
    };
    window.addEventListener("mousemove", handleGlobalMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.update(width, height);
        p.draw(ctx, currentMouseX, currentMouseY);
      });
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleContainerMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPosition({ x, y });
  };

  return (
    <div
      onMouseMove={handleContainerMouseMove}
      className="relative flex items-center justify-center w-full h-[100dvh] overflow-hidden"
      style={{
        background: `radial-gradient(800px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.1), rgba(255,255,255,0.03) 20%, transparent 60%), #020617`,
      }}
    >
      {/* Subtle Grid */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      ></div>

      {/* Particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      <div className="z-10 font-mono text-3xl md:text-5xl whitespace-pre-line text-center leading-relaxed font-light tracking-wide text-white drop-shadow-lg">
        {text}
        <span className="animate-pulse inline-block w-[1ch] h-[1em] bg-white align-middle ml-1 rounded-sm shadow-[0_0_10px_rgba(255,255,255,0.8)]"></span>
      </div>
    </div>
  );
}

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Demonstrates three common requestAnimationFrame patterns:
 * 1. Smooth counter — animating a numeric value over time
 * 2. Canvas particle rain — a lightweight render loop
 * 3. Throttled scroll listener — using rAF to batch scroll updates
 */

/* ------------------------------------------------------------------ */
/*  Tab 1 – Smooth counter that lerps from 0 to a target value       */
/* ------------------------------------------------------------------ */
function SmoothCounter() {
  const [target, setTarget] = useState(1000);
  const [display, setDisplay] = useState(0);
  const rafRef = useRef(0);

  useEffect(() => {
    let start: number | null = null;
    const duration = 1200; // ms
    const from = 0;

    const step = (ts: number) => {
      if (start === null) start = ts;
      const elapsed = ts - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (target - from) * eased));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target]);

  return (
    <div className="flex flex-col items-center gap-3">
      <span
        className="font-display text-4xl font-bold tabular-nums"
        aria-label="animated counter"
      >
        {display.toLocaleString()}
      </span>
      <div className="flex gap-2">
        {[500, 1000, 5000, 9999].map((v) => (
          <button
            key={v}
            onClick={() => setTarget(v)}
            className="px-3 py-1 text-xs rounded-full border border-border hover:bg-surface transition-colors"
          >
            {v.toLocaleString()}
          </button>
        ))}
      </div>
      <p className="text-xs text-text-secondary text-center max-w-[240px] m-0">
        Uses <code>requestAnimationFrame</code> to animate a number with
        ease-out cubic easing over 1.2 s.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab 2 – Canvas particle rain driven by a rAF render loop         */
/* ------------------------------------------------------------------ */
interface Particle {
  x: number;
  y: number;
  r: number;
  speed: number;
  hue: number;
}

function ParticleRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width;
    const H = canvas.height;

    // Seed particles
    particlesRef.current = Array.from({ length: 60 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: 1.5 + Math.random() * 2.5,
      speed: 0.4 + Math.random() * 1.2,
      hue: Math.random() * 360,
    }));

    const draw = () => {
      ctx.fillStyle = "rgba(15,23,42,0.25)"; // slight trail effect
      ctx.fillRect(0, 0, W, H);

      for (const p of particlesRef.current) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},80%,65%,0.9)`;
        ctx.fill();

        p.y += p.speed;
        p.hue = (p.hue + 0.2) % 360;
        if (p.y > H + p.r) {
          p.y = -p.r;
          p.x = Math.random() * W;
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div className="flex flex-col items-center gap-2">
      <canvas
        ref={canvasRef}
        width={280}
        height={160}
        className="rounded-xl border border-border"
        aria-label="particle rain canvas"
      />
      <p className="text-xs text-text-secondary text-center max-w-[260px] m-0">
        A 60-particle rain loop — each frame is scheduled via{" "}
        <code>requestAnimationFrame</code>, keeping motion smooth at the
        display's native refresh rate.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab 3 – rAF-throttled scroll listener                            */
/* ------------------------------------------------------------------ */
function ThrottledScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [rafFires, setRafFires] = useState(0);
  const [rawFires, setRawFires] = useState(0);
  const ticking = useRef(false);
  const rafRef = useRef(0);

  // Queues one paint-aligned read no matter how many scroll updates arrive.
  const queueScrollRead = useCallback(() => {
    setRawFires((n) => n + 1);

    if (!ticking.current) {
      ticking.current = true;
      rafRef.current = requestAnimationFrame(() => {
        setScrollY(containerRef.current?.scrollTop ?? 0);
        setRafFires((n) => n + 1);
        ticking.current = false;
      });
    }
  }, []);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const handleScroll = useCallback(() => {
    queueScrollRead();
  }, [queueScrollRead]);

  const runBurst = () => {
    const container = containerRef.current;
    if (!container) return;

    for (let i = 0; i < 24; i += 1) {
      container.scrollTop = (container.scrollTop + 9) % container.scrollHeight;
      queueScrollRead();
    }
  };

  const reset = () => {
    setRawFires(0);
    setRafFires(0);
    setScrollY(0);
    ticking.current = false;
    cancelAnimationFrame(rafRef.current);
    if (containerRef.current) containerRef.current.scrollTop = 0;
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-[140px] w-full overflow-y-auto rounded-xl border border-border bg-surface p-3"
        aria-label="scrollable area"
      >
        {Array.from({ length: 30 }, (_, i) => (
          <div key={i} className="py-2 border-b border-border text-sm">
            Row {i + 1}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3 text-center w-full">
        <div>
          <div className="text-lg font-bold tabular-nums">{rawFires}</div>
          <div className="text-[10px] text-text-secondary">scroll events</div>
        </div>
        <div>
          <div className="text-lg font-bold tabular-nums text-[#6366f1]">
            {rafFires}
          </div>
          <div className="text-[10px] text-text-secondary">rAF callbacks</div>
        </div>
        <div>
          <div className="text-lg font-bold tabular-nums">
            {Math.round(scrollY)}px
          </div>
          <div className="text-[10px] text-text-secondary">scrollTop</div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={runBurst}
          className="px-3 py-1 text-xs rounded-full border border-border hover:bg-surface transition-colors"
        >
          Burst 24 updates
        </button>
        <button
          onClick={reset}
          className="px-3 py-1 text-xs rounded-full border border-border hover:bg-surface transition-colors"
        >
          Reset
        </button>
      </div>

      <p className="text-xs text-text-secondary text-center max-w-[280px] m-0">
        Manual scrolling may already be frame-aligned in modern browsers. The
        burst button queues 24 scroll updates in one frame, while the handler
        still batches them into one <code>requestAnimationFrame</code> DOM read.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main demo with tabbed sections                                    */
/* ------------------------------------------------------------------ */
const tabs = ["Smooth Counter", "Particle Rain", "Throttled Scroll"] as const;
type Tab = (typeof tabs)[number];

export default function RequestAnimationFrameDemo() {
  const [activeTab, setActiveTab] = useState<Tab>("Smooth Counter");

  return (
    <div className="w-[360px] flex flex-col gap-4">
      <div className="bg-white border border-border rounded-2xl p-5">
        <h3 className="font-display text-lg font-bold m-0 mb-1">
          requestAnimationFrame
        </h3>
        <p className="text-sm text-text-secondary m-0">
          Three patterns that leverage the browser's paint-aligned callback for
          smooth, jank-free updates.
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-surface border border-border rounded-xl p-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 text-xs py-1.5 rounded-lg font-semibold transition-colors ${
              activeTab === tab
                ? "bg-white shadow-sm text-text-primary"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="bg-white border border-border rounded-2xl p-5 min-h-[240px] flex items-center justify-center">
        {activeTab === "Smooth Counter" && <SmoothCounter />}
        {activeTab === "Particle Rain" && <ParticleRain />}
        {activeTab === "Throttled Scroll" && <ThrottledScroll />}
      </div>
    </div>
  );
}

import { useCallback, useRef, useState } from "react";

const EMOJIS = ["❤️", "😂", "🔥", "🎉", "👏", "😮", "💯"];

interface Reaction {
  id: number;
  emoji: string;
  left: number; // percentage
  size: number;
  duration: number; // in seconds
  swayAmplitude: number;
}

export default function YoutubeReaction() {
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const idCounter = useRef(0);

  const addReaction = useCallback((emoji: string) => {
    const newReaction: Reaction = {
      id: idCounter.current++,
      emoji,
      left: 20 + Math.random() * 60, // Random horizontal position between 20% and 80%
      size: 1.5 + Math.random() * 1.5, // 1.5rem to 3rem
      duration: 2 + Math.random() * 2, // 2 to 4 seconds
      swayAmplitude: 10 + Math.random() * 40, // 10px to 50px sway
    };

    setReactions((prev) => [...prev, newReaction]);

    // Remove the reaction after its animation completes
    setTimeout(() => {
      setReactions((prev) => prev.filter((r) => r.id !== newReaction.id));
    }, newReaction.duration * 1000);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-end w-full h-[100dvh] overflow-hidden bg-slate-950 text-white font-sans">
      {/* Background Video/Content Placeholder */}
      <div className="absolute inset-0 flex flex-col items-center justify-center opacity-20 pointer-events-none">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          LIVE
        </h1>
        <p className="mt-4 text-xl font-light tracking-wide text-slate-300">
          React to the moment
        </p>
      </div>

      {/* Floating Reactions Container */}
      <div className="absolute bottom-24 left-0 right-0 top-0 pointer-events-none overflow-hidden z-20">
        {reactions.map((r) => (
          <div
            key={r.id}
            className="absolute bottom-0 will-change-transform"
            style={
              {
                left: `${r.left}%`,
                animation: `floatUp ${r.duration}s linear forwards`,
              } as React.CSSProperties
            }
          >
            <div
              className="text-shadow-lg drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] will-change-transform origin-bottom"
              style={
                {
                  fontSize: `${r.size}rem`,
                  animation: `sway ${r.duration / 3}s ease-in-out infinite alternate`,
                  "--sway": `${r.swayAmplitude}px`,
                } as React.CSSProperties
              }
            >
              {r.emoji}
            </div>
          </div>
        ))}
      </div>

      {/* Reaction Toolbar */}
      {/* will-change-transform reminds browser this component will change appearance. it will use gpu if possible */}
      <div className="z-30 mb-8 p-3 flex gap-2 md:gap-4 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
        {EMOJIS.map((emoji) => (
          <button
            key={emoji}
            onClick={() => addReaction(emoji)}
            className="w-10 h-10 md:w-14 md:h-14 flex items-center justify-center text-2xl md:text-3xl hover:scale-125 hover:-translate-y-2 hover:bg-white/20 transition-all duration-300 ease-out rounded-full active:scale-90"
            aria-label={`React with ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>

      <style>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) scale(0.5);
            opacity: 0;
          }
          5% {
            transform: translateY(-5vh) scale(1.2);
            opacity: 1;
          }
          15% {
            transform: translateY(-15vh) scale(1);
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh);
            opacity: 0;
          }
        }
        
        @keyframes sway {
          0% {
            transform: translateX(calc(var(--sway) * -1));
          }
          100% {
            transform: translateX(var(--sway));
          }
        }
      `}</style>
    </div>
  );
}

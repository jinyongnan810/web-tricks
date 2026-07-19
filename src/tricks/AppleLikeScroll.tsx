import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function AppleLikeScroll() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoSectionRef = useRef<HTMLElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const sections = Array.from(
      el.querySelectorAll<HTMLElement>(".scroll-section"),
    );

    const targetProgress = new Array(sections.length).fill(0);
    const currentProgress = new Array(sections.length).fill(0);
    let animationFrameId: number;

    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const loop = () => {
      sections.forEach((sec, i) => {
        const rect = sec.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();

        // Relative to the scroll container
        const offsetTop = rect.top - elRect.top;

        // For the first section, animation starts when it hits the top.
        // For subsequent sections, start animation when they are 20% visible (offsetTop = 0.8 * elRect.height)
        const startOffset = i === 0 ? 0 : 0.8 * elRect.height;
        const endOffset = elRect.height - rect.height;

        // Ensure distance is at least 1 to prevent division by zero
        const totalDistance = Math.max(1, startOffset - endOffset);
        const progress = (startOffset - offsetTop) / totalDistance;

        // Clamp between 0 and 1
        targetProgress[i] = Math.max(0, Math.min(1, progress));

        // Apply smooth momentum
        currentProgress[i] = lerp(currentProgress[i], targetProgress[i], 0.08);

        // Snap to target if very close to stop unnecessary repaints
        if (Math.abs(currentProgress[i] - targetProgress[i]) < 0.001) {
          currentProgress[i] = targetProgress[i];
        }

        const p = currentProgress[i];
        // create a v shaped curve that peaks at 0.5 and goes down to 0 at 0 and 1
        const parabola = Math.max(0, 1 - Math.abs(p - 0.5) * 2);

        // set CSS variables for each section to use in styles
        sec.style.setProperty("--progress", p.toString());
        sec.style.setProperty("--progress-parabola", parabola.toString());
      });

      // it tells the browser: "Whenever you are ready to paint the next frame, run this exact function again."
      animationFrameId = window.requestAnimationFrame(loop);
    };

    // It tells the browser: "Hey, before you paint the very first frame on the screen, run this loop function."
    animationFrameId = window.requestAnimationFrame(loop);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    // detect video section is in the viewport and play/pause the video accordingly
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = videoRef.current;
          if (!video) return;

          if (entry.isIntersecting) {
            video.currentTime = 0;
            video.play().catch(() => {
              // Autoplay may be blocked by browser policies
            });
          } else {
            video.pause();
          }
        });
      },
      // let me know when at least 5% of the video section is visible on screen
      { threshold: 0.05 },
    );

    const sectionEl = videoSectionRef.current;
    if (sectionEl) {
      observer.observe(sectionEl);
    }

    return () => {
      if (sectionEl) observer.unobserve(sectionEl);
      observer.disconnect();
    };
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  return (
    <div
      ref={scrollRef}
      className="absolute inset-0 overflow-y-auto overflow-x-hidden bg-black font-sans text-white"
    >
      {/* Section 1: Hero Phone */}
      {/* Parent of sticky component use 150vh height to create a "track" for sticky component to slide on */}
      {/* The sticky <div> hits the top of your screen and freezes in place. However, the parent <section> (which is 150vh tall) keeps scrolling up invisibly in the background. */}
      <section className="scroll-section relative h-[150vh]">
        {/* sticky and top-0 means: Scroll this element normally until it hits the very top of the screen. Once it touches the top, freeze it in place. */}
        <div className="sticky top-0 flex h-full max-h-[100dvh] w-full flex-col items-center justify-center overflow-hidden">
          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
            <h1
              className="text-center font-display text-5xl font-bold tracking-tight text-white will-change-transform md:text-8xl"
              style={{
                opacity: "calc(1 - var(--progress) * 5)",
                transform:
                  "scale(calc(1 + var(--progress) * 0.2)) translateY(calc(var(--progress) * -40px))",
              }}
            >
              iPhone 17 Pro
            </h1>
          </div>
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
            <h2
              className="text-center font-display text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-500 will-change-transform md:text-8xl"
              style={{
                opacity: "calc(var(--progress) * 4 - 0.5)",
                transform:
                  "scale(calc(0.9 + var(--progress) * 0.1)) translateY(calc((1 - var(--progress)) * 20px))",
              }}
            >
              Titanium.
              <br />
              So strong. So light.
            </h2>
          </div>
          <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
            <img
              src="/images/apple-like/sleek_smartphone.jpg"
              alt="iPhone"
              className="h-full w-full origin-center object-cover will-change-transform"
              style={{
                transform: "scale(calc(1 + var(--progress) * 1.5))",
                opacity: "calc(1 - var(--progress) * 0.5)",
              }}
            />
          </div>
        </div>
      </section>

      {/* Section 2: Chip */}
      <section className="scroll-section relative h-[200vh] bg-black">
        <div className="sticky top-0 flex h-full max-h-[100dvh] w-full flex-col items-center justify-center overflow-hidden">
          <div className="pointer-events-none absolute inset-0 opacity-60">
            <img
              src="/images/apple-like/silicon_chip.jpg"
              alt="Chip"
              className="h-full w-full object-cover will-change-transform"
              style={{
                transform: "scale(calc(1.1 + var(--progress-parabola) * 0.15))",
                opacity: "calc(0.5 + var(--progress-parabola) * 0.5)",
              }}
            />
          </div>
          <div className="z-10 max-w-4xl px-6 text-center">
            <h2
              className="mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text font-display text-4xl font-bold tracking-tight text-transparent will-change-transform md:text-7xl"
              style={{
                opacity: "calc(var(--progress-parabola) * 2.5)",
                transform: "translateY(calc((1 - var(--progress)) * 100px))",
              }}
            >
              A17 Pro chip.
              <br />A monster win for gaming.
            </h2>
            <p
              className="font-body text-lg font-medium text-neutral-300 will-change-transform md:text-3xl"
              style={{
                opacity: "calc(var(--progress-parabola) * 2)",
                transform: "translateY(calc((1 - var(--progress)) * 50px))",
              }}
            >
              The biggest redesign in the history of Apple GPUs.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: Full Screen Video */}
      <section
        ref={videoSectionRef}
        className="scroll-section relative h-[150vh] bg-black"
      >
        <div className="sticky top-0 flex h-full max-h-[100dvh] w-full flex-col items-center justify-center overflow-hidden">
          <div className="absolute left-6 top-6 z-50 md:left-10 md:top-10">
            <button
              onClick={togglePlay}
              className="flex items-center justify-center rounded-full bg-white/20 p-3 text-white backdrop-blur-md transition-colors hover:bg-white/30"
              aria-label={isPlaying ? "Pause video" : "Play video"}
            >
              {isPlaying ? (
                <Pause size={24} fill="currentColor" />
              ) : (
                <Play size={24} fill="currentColor" />
              )}
            </button>
          </div>
          <div
            className="relative h-full w-full will-change-transform"
            style={{
              opacity: "calc(0.5 + var(--progress-parabola))",
            }}
          >
            <video
              ref={videoRef}
              src="/legacy-tricks/Video/videos/gone.mp4"
              className="h-full w-full object-cover"
              style={{ transform: "scale(1.35)" }}
              muted
              playsInline
              loop
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          </div>
        </div>
      </section>

      {/* Section 4: Camera */}
      <section className="scroll-section relative h-[150vh] bg-black">
        <div className="sticky top-0 flex h-full max-h-[100dvh] w-full flex-col items-center justify-center overflow-hidden md:flex-row">
          <div
            className="z-10 flex h-[40%] w-full flex-col justify-center px-10 will-change-transform md:h-full md:w-1/2"
            style={{
              opacity: "calc(var(--progress) * 3)",
              transform: "translateX(calc((1 - var(--progress)) * -50px))",
            }}
          >
            <h2 className="mb-6 font-display text-4xl font-bold tracking-tight text-white md:text-7xl">
              48MP Main camera.
              <br />
              Mega powerful.
            </h2>
            <p className="font-body text-lg text-neutral-400 md:text-xl">
              The advanced quad-pixel sensor makes the most of 48 megapixels by
              adapting to what you’re shooting.
            </p>
          </div>
          <div
            className="relative h-[60%] w-full will-change-transform md:h-full md:w-1/2"
            style={{
              opacity: "calc(var(--progress) * 2)",
              transform:
                "scale(calc(0.8 + var(--progress) * 0.2)) translateX(calc((1 - var(--progress)) * 50px))",
            }}
          >
            <img
              src="/images/apple-like/camera_lens.jpg"
              alt="Camera"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent md:bg-gradient-to-r" />
          </div>
        </div>
      </section>

      {/* Spacer to allow scrolling past the last section cleanly */}
      <div className="flex h-[30vh] items-center justify-center bg-black pb-[env(safe-area-inset-bottom)]">
        <p className="font-body font-medium text-neutral-500">
          End of presentation
        </p>
      </div>
    </div>
  );
}

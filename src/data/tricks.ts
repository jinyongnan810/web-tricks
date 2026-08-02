import type { ComponentType } from "react";

import antigravityCursorTypingThumb from "../assets/thumbnails/antigravity.png";
import appleLikeScrollThumb from "../assets/thumbnails/appleLikeScroll.png";
import appleMusicLyricsThumb from "../assets/thumbnails/appleMusicLyrics.png";
import compositionSearchThumb from "../assets/thumbnails/compositionSearch.png";
import containerQueriesThumb from "../assets/thumbnails/containerQueries.png";
import glassmorphismThumb from "../assets/thumbnails/glassmorphism.png";
import intersectionObserverThumb from "../assets/thumbnails/intersectionObserver.png";
import miroLikeCanvasThumb from "../assets/thumbnails/miroLikeCanvas.png";
import optimisticUIThumb from "../assets/thumbnails/optimisticUIUpdates.png";
import progressStepsThumb from "../assets/thumbnails/progressSteps.png";
import reactHookForm from "../assets/thumbnails/reactHookForm.png";
import rechartsThumb from "../assets/thumbnails/recharts.png";
import requestAnimationFrameThumb from "../assets/thumbnails/requestAnimationFrame.png";
import scrollAnimationsThumb from "../assets/thumbnails/scrollDrivenAnimations.png";
import segementedProgressRingThumb from "../assets/thumbnails/segmentedProgressRing.png";
import useLocalStorageThumb from "../assets/thumbnails/useLocalStorage.png";
import youtubeReactionThumb from "../assets/thumbnails/youtubeReaction.png";

export interface TrickKeyPoint {
  code: string;
  explanation?: string;
}

export interface Trick {
  id: string;
  title: string;
  description: string;
  category: "CSS" | "JS" | "React";
  technologies: string[];
  thumbnail: string;
  githubUrl: string;
  fullscreenMode?: "fill" | "scale";
  keyPoint?: TrickKeyPoint;
  component: () => Promise<{ default: ComponentType }>;
}

const trickList: Trick[] = [
  {
    id: "miro-like-canvas",
    title: "Miro-like Sticky Note Canvas",
    description:
      "Interactive infinite canvas inspired by Miro. Create, drag, resize, and style sticky note stickers with editable text, custom font sizes, text colors, and background palettes.",
    category: "React",
    technologies: [
      "React",
      "CSS Transforms",
      "State Management",
      "Interactive Drag & Resize",
      "Tailwind CSS",
    ],
    thumbnail: miroLikeCanvasThumb,
    githubUrl:
      "https://github.com/jinyongnan810/web-tricks/tree/main/src/tricks/MiroLikeCanvas.tsx",
    fullscreenMode: "fill",
    keyPoint: {
      explanation:
        "Manages active dragging & resizing state via mouse event listeners and 2D canvas coordinates.",
      code: `// Pointer down tracks initial note position and click cursor offset
const handleMouseDown = (e: React.PointerEvent, note: Note) => {
  setDragState({ id: note.id, startX: e.clientX - note.x, startY: e.clientY - note.y });
};

// Apply smooth 3D CSS translate positioning
<div style={{ transform: \`translate3d(\${x}px, \${y}px, 0)\` }} />`,
    },
    component: () => import("../tricks/MiroLikeCanvas"),
  },
  {
    id: "apple-like-scroll",
    title: "Apple-like Scroll Animations",
    description:
      "Stunning scroll-driven animations with zooming images, text reveals, and parallax using pure React and inline CSS variables.",
    category: "React",
    technologies: [
      "React",
      "CSS Variables",
      "Scroll Event",
      "Sticky Positioning",
    ],
    thumbnail: appleLikeScrollThumb,
    githubUrl:
      "https://github.com/jinyongnan810/web-tricks/tree/main/src/tricks/AppleLikeScroll.tsx",
    fullscreenMode: "fill",
    keyPoint: {
      explanation:
        "Uses linear interpolation (lerp) on scroll bounding rects to set --progress and --progress-parabola CSS variables.",
      code: `// Linear interpolation (lerp) for smooth momentum
const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

// Calculate progress relative to container viewport & set CSS variables
currentProgress[i] = lerp(currentProgress[i], targetProgress[i], 0.08);
sec.style.setProperty("--progress", currentProgress[i].toString());
sec.style.setProperty("--progress-parabola", (1 - Math.abs(p - 0.5) * 2).toString());`,
    },
    component: () => import("../tricks/AppleLikeScroll"),
  },
  {
    id: "apple-music-lyrics",
    title: "Apple Music Lyrics",
    description:
      "Apple Music-inspired synced scrolling lyrics with word-level karaoke animations, real audio playback, interactive track switching, and animated artwork gradients.",
    category: "React",
    technologies: [
      "React",
      "HTML5 Audio",
      "Backdrop Filters",
      "CSS Animations",
    ],
    thumbnail: appleMusicLyricsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/web-tricks/tree/main/src/tricks/AppleMusicLyrics.tsx",
    fullscreenMode: "fill",
    keyPoint: {
      explanation:
        "Auto-scrolls the active line into view smoothly and uses multi-layer text rendering for word-level karaoke reveal effects.",
      code: `// 1. Auto-scroll active lyric line to center block
useEffect(() => {
  if (isManualScroll) return;
  lyricLineRefs.current[activeLineIndex]?.scrollIntoView({
    behavior: isInitial ? "auto" : "smooth",
    block: "center",
  });
}, [activeLineIndex, isManualScroll]);

// 2. Multi-layer text rendering for word-level reveal
function RevealedWord({ word, progress }: { word: string; progress: number }) {
  return (
    <span className="relative inline-block">
      <span className="invisible">{word}</span> {/* Reserve layout space */}
      <span className="absolute inset-0 text-white/30">{word}</span> {/* Gray underlay */}
      <span className="absolute inset-0 overflow-hidden text-white drop-shadow" style={{ width: \`\${progress * 100}%\` }}>
        {word} {/* Active white overlay */}
      </span>
    </span>
  );
}`,
    },
    component: () => import("../tricks/AppleMusicLyrics"),
  },
  {
    id: "youtube-reaction",
    title: "YouTube Reaction Animations",
    description:
      "Mimics YouTube's live reaction feature with floating emoji animations.",
    category: "React",
    technologies: ["React", "CSS Animations", "Keyframes"],
    thumbnail: youtubeReactionThumb,
    githubUrl:
      "https://github.com/jinyongnan810/web-tricks/tree/main/src/tricks/YoutubeReaction.tsx",
    fullscreenMode: "fill",
    keyPoint: {
      explanation:
        "Spawns floating emoji reactions with randomized positions & durations, cleaning them up after animation.",
      code: `// Generate reaction object with random offset & duration
const newReaction = { id: idCounter.current++, emoji, left: 20 + Math.random() * 60, duration: 2 + Math.random() * 2 };
setReactions((prev) => [...prev, newReaction]);

// Clean up state on completion
setTimeout(() => setReactions((prev) => prev.filter((r) => r.id !== newReaction.id)), duration * 1000);`,
    },
    component: () => import("../tricks/YoutubeReaction"),
  },
  {
    id: "antigravity-cursor-typing",
    title: "Antigravity Cursor & Typing",
    description:
      "Mimics the background spotlight cursor effect with a typing text animation on load.",
    category: "React",
    technologies: ["React", "CSS radial-gradient", "typing animation"],
    thumbnail: antigravityCursorTypingThumb,
    githubUrl:
      "https://github.com/jinyongnan810/web-tricks/tree/main/src/tricks/AntigravityCursorTyping.tsx",
    fullscreenMode: "fill",
    keyPoint: {
      explanation:
        "HTML5 Canvas particle system calculating distance to mouse pointer for proximity glowing effects.",
      code: `// Particle draw loop reacting to mouse distance
const dx = mouseX - this.x;
const dy = mouseY - this.y;
const distance = Math.sqrt(dx * dx + dy * dy);

if (distance < maxDistance) {
  const factor = 1 - distance / maxDistance;
  ctx.shadowBlur = 10 * factor; // Glow effect on mouse proximity
}`,
    },
    component: () => import("../tricks/AntigravityCursorTyping"),
  },
  {
    id: "react-hook-form",
    title: "React Hook Form",
    description:
      "Realistic project intake form with wrapped inputs, radios, selects, checkbox groups, validation, and live form state.",
    category: "React",
    technologies: ["React", "React Hook Form", "forms", "validation"],
    thumbnail: reactHookForm,
    githubUrl:
      "https://github.com/jinyongnan810/web-tricks/tree/main/src/tricks/ReactHookForm.tsx",
    fullscreenMode: "scale",
    keyPoint: {
      explanation:
        "Leverages React Hook Form useForm, register, Controller, and useWatch for performant form validation.",
      code: `// Initialize useForm hook with TypeScript types & defaultValues
const { register, control, handleSubmit, formState: { errors } } = useForm<ProjectFormValues>({ defaultValues });

// Watch live values without unnecessary parent re-renders
const formValues = useWatch({ control });
const onSubmit = (data: ProjectFormValues) => console.log(data);`,
    },
    component: () => import("../tricks/ReactHookForm"),
  },
  {
    id: "request-animation-frame",
    title: "requestAnimationFrame",
    description:
      "Three rAF patterns: smooth counter with easing, canvas particle rain loop, and throttled scroll listener.",
    category: "JS",
    technologies: ["requestAnimationFrame", "Canvas", "animation", "throttle"],
    thumbnail: requestAnimationFrameThumb,
    githubUrl:
      "https://github.com/jinyongnan810/web-tricks/tree/main/src/tricks/RequestAnimationFrame.tsx",
    fullscreenMode: "scale",
    keyPoint: {
      explanation:
        "Uses requestAnimationFrame timestamp for smooth 60fps counter animation with cubic easing & cancellation cleanup.",
      code: `// Timestamp calculation with ease-out cubic curve
const step = (ts: number) => {
  if (start === null) start = ts;
  const progress = Math.min((ts - start) / duration, 1);
  const eased = 1 - Math.pow(1 - progress, 3); // Ease-out cubic
  setDisplay(Math.round(from + (target - from) * eased));
  if (progress < 1) rafRef.current = requestAnimationFrame(step);
};
rafRef.current = requestAnimationFrame(step);
return () => cancelAnimationFrame(rafRef.current);`,
    },
    component: () => import("../tricks/RequestAnimationFrame"),
  },
  {
    id: "segmented-progress-ring",
    title: "Segmented Progress Ring",
    description:
      "Reusable SVG progress ring built from rounded arc paths with equal or weighted segments.",
    category: "React",
    technologies: ["React", "TypeScript", "SVG arcs", "animation"],
    thumbnail: segementedProgressRingThumb,
    githubUrl:
      "https://github.com/jinyongnan810/web-tricks/tree/main/src/tricks/SegmentedProgressRing.tsx",
    fullscreenMode: "scale",
    keyPoint: {
      explanation:
        "Converts angles to Cartesian coordinates to draw SVG arc path commands dynamically with rounded caps.",
      code: `// Convert angle to SVG Cartesian coordinate
function polarToCartesian(cx: number, cy: number, radius: number, angleInDegrees: number) {
  const radians = (angleInDegrees * Math.PI) / 180;
  return { x: cx + radius * Math.cos(radians), y: cy + radius * Math.sin(radians) };
}

// Generate SVG arc path d attribute
const d = \`M \${start.x} \${start.y} A \${radius} \${radius} 0 \${largeArc} 1 \${end.x} \${end.y}\`;`,
    },
    component: () => import("../tricks/SegmentedProgressRing"),
  },
  {
    id: "basic-recharts",
    title: "Basic Recharts",
    description:
      "Three tabbed chart examples using Recharts: grouped bars, multi-line trends, and a pie chart.",
    category: "React",
    technologies: ["React", "Recharts", "tabs"],
    thumbnail: rechartsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/web-tricks/tree/main/src/tricks/BasicRecharts.tsx",
    fullscreenMode: "scale",
    keyPoint: {
      explanation:
        "Renders responsive Bar, Line, and Pie charts using Recharts containers and custom tooltip renderers.",
      code: `// Responsive chart layout with grouped series & tooltips
<ResponsiveContainer width="100%" height={320}>
  <BarChart data={barData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="location" />
    <Tooltip content={<CustomTooltip />} />
    <Bar dataKey="desktop" fill="#6366f1" radius={[6, 6, 0, 0]} />
  </BarChart>
</ResponsiveContainer>`,
    },
    component: () => import("../tricks/BasicRecharts"),
  },
  {
    id: "kins-page",
    title: "Kin's Page",
    description: "Memo/blog style page migrated from Kin's legacy project.",
    category: "JS",
    technologies: ["Markdown rendering", "Firestore API", "layout"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/web-tricks/tree/main/src/tricks/KinsPage.tsx",
    keyPoint: {
      explanation:
        "Wraps static legacy HTML page inside a responsive iframe via LegacyExternalPage wrapper.",
      code: `// Render legacy static demo inside iframe wrapper
export default function KinsPage() {
  return (
    <LegacyExternalPage
      title="Kins-Page"
      src="/legacy-tricks/Kins-Page/index.html"
    />
  );
}`,
    },
    component: () => import("../tricks/KinsPage"),
  },
  {
    id: "composition-search",
    title: "Composition Search (IME)",
    description:
      "Use onCompositionStart/onCompositionEnd so search waits until Japanese IME input is committed.",
    category: "React",
    technologies: ["React", "IME composition", "onCompositionStart"],
    thumbnail: compositionSearchThumb,
    githubUrl:
      "https://github.com/jinyongnan810/web-tricks/tree/main/src/tricks/CompositionSearch.tsx",
    fullscreenMode: "scale",
    keyPoint: {
      explanation:
        "Defer search filtering during Japanese/Chinese IME input until onCompositionEnd completes.",
      code: `<input
  value={inputValue}
  onCompositionStart={() => setIsComposing(true)}
  onCompositionEnd={(e) => {
    setIsComposing(false);
    setKeyword(e.currentTarget.value); // Apply filter on IME confirm!
  }}
  onChange={(e) => {
    setInputValue(e.target.value);
    if (!isComposing) setKeyword(e.target.value);
  }}
/>`,
    },
    component: () => import("../tricks/CompositionSearch"),
  },
  {
    id: "glassmorphism",
    title: "Glassmorphism Card",
    description:
      "Frosted glass effect with backdrop-filter and translucent layers.",
    category: "CSS",
    technologies: ["backdrop-filter", "CSS", "opacity"],
    thumbnail: glassmorphismThumb,
    githubUrl:
      "https://github.com/jinyongnan810/web-tricks/tree/main/src/tricks/Glassmorphism.tsx",
    fullscreenMode: "scale",
    keyPoint: {
      explanation:
        "Frosted glass UI card using CSS backdrop-blur with semi-transparent background & border.",
      code: `// Glassmorphism card styling
<div className="rounded-2xl border border-white/30 bg-white/20 backdrop-blur-xl shadow-lg p-6">
  <h3 className="text-white font-bold">Glass Card</h3>
  <p className="text-white/80">Frosted glass backdrop effect.</p>
</div>`,
    },
    component: () => import("../tricks/Glassmorphism"),
  },
  {
    id: "use-local-storage",
    title: "useLocalStorage Hook",
    description:
      "A custom hook that syncs React state with localStorage automatically.",
    category: "React",
    technologies: ["React hooks", "localStorage", "JSON"],
    thumbnail: useLocalStorageThumb,
    githubUrl:
      "https://github.com/jinyongnan810/web-tricks/tree/main/src/tricks/UseLocalStorage.tsx",
    fullscreenMode: "scale",
    keyPoint: {
      explanation:
        "Custom React hook with lazy state initialization and sync to localStorage on state update.",
      code: `function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}`,
    },
    component: () => import("../tricks/UseLocalStorage"),
  },
  {
    id: "progress-steps",
    title: "Progress Steps",
    description:
      "A step indicator with active state, connecting line, and next/prev controls.",
    category: "JS",
    technologies: ["React state", "progress UI", "buttons"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/web-tricks/tree/main/src/tricks/ProgressSteps.tsx",
    fullscreenMode: "scale",
    keyPoint: {
      explanation:
        "Calculates active step progress width percentage to dynamically expand background bar width.",
      code: `// Compute progress bar fill percentage
const progressWidth = \`\${(currentStep / (steps.length - 1)) * 100}%\`;

// Style active connecting bar width
<div className="absolute left-0 top-1/2 h-1 -translate-y-1/2 bg-[#34989b] transition-all duration-500" style={{ width: progressWidth }} />`,
    },
    component: () => import("../tricks/ProgressSteps"),
  },

  {
    id: "blurry-loading",
    title: "Blurry Loading",
    description:
      "Blur reveal loading effect demo migrated from legacy project.",
    category: "JS",
    technologies: ["DOM", "CSS filter", "timers"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/web-tricks/tree/main/src/tricks/BlurryLoading.tsx",
    keyPoint: {
      explanation:
        "Timer loop mapping loading percentage (0-100%) to CSS filter blur and opacity reduction.",
      code: `const blurring = () => {
  load++;
  if (load == 100) clearInterval(interval);
  loading.innerText = \`\${load}%\`;
  loading.style.opacity = (100 - load) / 100;
  bg.style.filter = \`blur(\${(100 - load) * 0.3}px)\`;
};`,
    },
    component: () => import("../tricks/BlurryLoading"),
  },
  {
    id: "breakout-game",
    title: "Breakout Game",
    description: "Canvas breakout game demo migrated from legacy project.",
    category: "JS",
    technologies: ["Canvas", "game loop", "keyboard input"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/web-tricks/tree/main/src/tricks/BreakoutGame.tsx",
    keyPoint: {
      explanation:
        "HTML5 Canvas game loop updating ball coordinates and checking brick collision bounding boxes.",
      code: `// Ball to brick collision detection logic
bricks.forEach((column) => {
  column.forEach((brick) => {
    if (brick.visible) {
      if (ball.x + ball.size > brick.x && ball.x - ball.size < brick.x + brick.w &&
          ball.y + ball.size > brick.y && ball.y - ball.size < brick.y + brick.h) {
        ball.dy *= -1; // Reverse vertical velocity
        brick.visible = false; // Hide hit brick
      }
    }
  });
});`,
    },
    component: () => import("../tricks/BreakoutGame"),
  },
  {
    id: "dom-methods",
    title: "DOM Methods",
    description: "DOM array methods demo migrated from legacy project.",
    category: "JS",
    technologies: ["fetch", "array methods", "DOM"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/web-tricks/tree/main/src/tricks/DomMethods.tsx",
    keyPoint: {
      explanation:
        "Use Array.prototype.map, filter, sort, and reduce to manipulate data and render HTML.",
      code: `// Double user wealth with map()
function doubleMoney() {
  data = data.map((user) => ({ ...user, money: user.money * 2 }));
  updateDOM();
}

// Calculate total wealth using reduce()
const total = data.reduce((acc, user) => (acc += user.money), 0);`,
    },
    component: () => import("../tricks/DomMethods"),
  },
  {
    id: "exapanse-tracker",
    title: "Exapanse Tracker",
    description: "Expense tracker demo migrated from legacy project.",
    category: "JS",
    technologies: ["localStorage", "forms", "state"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/web-tricks/tree/main/src/tricks/ExapanseTracker.tsx",
    keyPoint: {
      explanation:
        "Persists income/expense transactions in localStorage and updates balance totals.",
      code: `// Filter positive income vs negative expense amounts
const amounts = transactions.map((t) => t.amount);
const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
const income = amounts.filter((item) => item > 0).reduce((acc, item) => (acc += item), 0);
const expense = amounts.filter((item) => item < 0).reduce((acc, item) => (acc += item), 0) * -1;`,
    },
    component: () => import("../tricks/ExapanseTracker"),
  },
  {
    id: "extending-cards",
    title: "Extending Cards",
    description: "Expanding cards interaction migrated from legacy project.",
    category: "CSS",
    technologies: ["events", "CSS transitions", "classes"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/web-tricks/tree/main/src/tricks/ExtendingCards.tsx",
    keyPoint: {
      explanation:
        "Toggles 'active' class on clicked cards, expanding flex flex-grow via CSS transitions.",
      code: `// Remove active class from previous cards & add to target
panels.forEach((panel) => {
  panel.addEventListener('click', () => {
    removeActiveClasses();
    panel.classList.add('active'); // CSS flex: 5 expands card smoothly
  });
});`,
    },
    component: () => import("../tricks/ExtendingCards"),
  },
  {
    id: "faq-collapse",
    title: "FAQ Collapse",
    description: "FAQ collapse interaction migrated from legacy project.",
    category: "CSS",
    technologies: ["events", "DOM", "classes"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/web-tricks/tree/main/src/tricks/FaqCollapse.tsx",
    keyPoint: {
      explanation:
        "Toggles FAQ accordion container state using parent node class toggling.",
      code: `// Toggle active class on FAQ card parent element
toggleButtons.forEach((toggle) => {
  toggle.addEventListener('click', () => {
    toggle.parentNode.classList.toggle('active');
  });
});`,
    },
    component: () => import("../tricks/FaqCollapse"),
  },
  {
    id: "form-validator-legacy",
    title: "Form Validator",
    description: "Validation flow migrated from legacy project.",
    category: "JS",
    technologies: ["forms", "validation", "DOM"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/web-tricks/tree/main/src/tricks/FormValidatorLegacy.tsx",
    keyPoint: {
      explanation:
        "Validates field length, format regex, and matching passwords, setting error styling classes.",
      code: `// Show input error border and message
function showError(input, message) {
  const formControl = input.parentElement;
  formControl.className = 'form-control error';
  formControl.querySelector('small').innerText = message;
}`,
    },
    component: () => import("../tricks/FormValidatorLegacy"),
  },
  {
    id: "form-wave-animation",
    title: "Form Wave Animation",
    description: "Wave label animation migrated from legacy project.",
    category: "CSS",
    technologies: ["CSS animation", "labels", "DOM"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/web-tricks/tree/main/src/tricks/FormWaveAnimation.tsx",
    keyPoint: {
      explanation:
        "Splits label text into spans with inline transition-delay for a staggered wave effect on focus.",
      code: `// Wrap each letter in a span with staggered transition-delay
labels.forEach((label) => {
  label.innerHTML = label.innerText
    .split('')
    .map((letter, idx) => \`<span style="transition-delay:\${idx * 50}ms">\${letter}</span>\`)
    .join('');
});`,
    },
    component: () => import("../tricks/FormWaveAnimation"),
  },
  {
    id: "hangman-legacy",
    title: "Hangman",
    description: "Hangman mini-game migrated from legacy project.",
    category: "JS",
    technologies: ["SVG", "events", "game logic"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/web-tricks/tree/main/src/tricks/HangmanLegacy.tsx",
    keyPoint: {
      explanation:
        "Tracks correctly and wrongly guessed letters, revealing SVG figure parts step-by-step.",
      code: `// Display SVG hangman parts for each incorrect guess
figureParts.forEach((part, index) => {
  const errors = wrongLetters.length;
  part.style.display = index < errors ? 'block' : 'none';
});`,
    },
    component: () => import("../tricks/HangmanLegacy"),
  },
  {
    id: "hidden-search",
    title: "Hidden Search",
    description: "Expandable search input migrated from legacy project.",
    category: "CSS",
    technologies: ["events", "focus", "transitions"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/web-tricks/tree/main/src/tricks/HiddenSearch.tsx",
    keyPoint: {
      explanation:
        "Toggles active class to expand search input width and auto-focus the field.",
      code: `// Toggle container expand class & focus input
btn.addEventListener('click', () => {
  search.classList.toggle('active');
  input.focus();
});`,
    },
    component: () => import("../tricks/HiddenSearch"),
  },
  {
    id: "infinite-scroll",
    title: "Infinite Scroll",
    description: "Infinite scroll feed migrated from legacy project.",
    category: "JS",
    technologies: ["scroll", "fetch", "pagination"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/web-tricks/tree/main/src/tricks/InfiniteScroll.tsx",
    keyPoint: {
      explanation:
        "Detects scroll position near window bottom to fetch next paginated page.",
      code: `// Scroll listener checking bottom boundary distance
window.addEventListener('scroll', () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 5) {
    showLoadingSpinnerAndFetchMore();
  }
});`,
    },
    component: () => import("../tricks/InfiniteScroll"),
  },
  {
    id: "key-codes",
    title: "Key Codes",
    description: "Keyboard event visualizer migrated from legacy project.",
    category: "JS",
    technologies: ["KeyboardEvent", "DOM", "events"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/web-tricks/tree/main/src/tricks/KeyCodes.tsx",
    keyPoint: {
      explanation:
        "Captures KeyboardEvent properties (e.key, e.keyCode, e.code) and displays them dynamically.",
      code: `// Render event properties on keydown listener
window.addEventListener('keydown', (event) => {
  insert.innerHTML = \`
    <div class="key">\${event.key === ' ' ? 'Space' : event.key}<small>event.key</small></div>
    <div class="key">\${event.keyCode}<small>event.keyCode</small></div>
    <div class="key">\${event.code}<small>event.code</small></div>\`;
});`,
    },
    component: () => import("../tricks/KeyCodes"),
  },

  {
    id: "lyrics-search",
    title: "Lyrics Search",
    description: "Lyrics search demo migrated from legacy project.",
    category: "JS",
    technologies: ["API", "fetch", "DOM"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/web-tricks/tree/main/src/tricks/LyricsSearch.tsx",
    keyPoint: {
      explanation:
        "Fetches songs & lyrics from public API and injects next/prev pagination links.",
      code: `// Fetch lyrics by artist and song title
async function getLyrics(artist, songTitle) {
  const res = await fetch(\`\${apiURL}/v1/\${artist}/\${songTitle}\`);
  const data = await res.json();
  const lyrics = data.lyrics.replace(/(\\r\\n|\\r|\\n)/g, '<br>');
  result.innerHTML = \`<h2>\${artist} - \${songTitle}</h2><span>\${lyrics}</span>\`;
}`,
    },
    component: () => import("../tricks/LyricsSearch"),
  },
  {
    id: "meal-search",
    title: "Meal Search",
    description: "Meal finder demo migrated from legacy project.",
    category: "JS",
    technologies: ["API", "search", "DOM"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/web-tricks/tree/main/src/tricks/MealSearch.tsx",
    keyPoint: {
      explanation:
        "Queries meal DB API by term or random pick, displaying ingredients and instructions.",
      code: `// Fetch meal details by API search ID
fetch(\`https://www.themealdb.com/api/json/v1/1/lookup.php?i=\${mealID}\`)
  .then((res) => res.json())
  .then((data) => {
    const meal = data.meals[0];
    addMealToDOM(meal);
  });`,
    },
    component: () => import("../tricks/MealSearch"),
  },
  {
    id: "memory-cards",
    title: "Memory Cards",
    description: "Flashcard interaction migrated from legacy project.",
    category: "JS",
    technologies: ["transforms", "localStorage", "DOM"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/web-tricks/tree/main/src/tricks/MemoryCards.tsx",
    keyPoint: {
      explanation:
        "Flips card element via CSS transform 3D rotateY and saves card deck to localStorage.",
      code: `// Toggle show-answer class for 3D card flip animation
card.addEventListener('click', () => card.classList.toggle('show-answer'));

/* CSS 3D flip transform */
// .card.show-answer .card-inner { transform: rotateX(180deg); }`,
    },
    component: () => import("../tricks/MemoryCards"),
  },
  {
    id: "menu-modal",
    title: "Menu Modal",
    description: "Menu and modal UI demo migrated from legacy project.",
    category: "JS",
    technologies: ["modal", "menu", "events"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/web-tricks/tree/main/src/tricks/MenuModal.tsx",
    keyPoint: {
      explanation:
        "Toggles slide-out navigation drawer class and modal dialog visibility backdrop.",
      code: `// Toggle nav menu slide drawer
toggle.addEventListener('click', () =>
  document.body.classList.toggle('show-nav')
);

// Show / hide modal overlay
open.addEventListener('click', () => modal.classList.add('show-modal'));
close.addEventListener('click', () => modal.classList.remove('show-modal'));`,
    },
    component: () => import("../tricks/MenuModal"),
  },
  {
    id: "mine-sweeper",
    title: "Mine Sweeper",
    description: "Mine sweeper game migrated from legacy project.",
    category: "JS",
    technologies: ["grid", "events", "game logic"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/web-tricks/tree/main/src/tricks/MineSweeper.tsx",
    keyPoint: {
      explanation:
        "Calculates surrounding mine counts for grid coordinates and uses recursion for empty reveals.",
      code: `// Count adjacent mines in 3x3 surrounding grid
for (let i = -1; i <= 1; i++) {
  for (let j = -1; j <= 1; j++) {
    if (squares[r + i]?.[c + j]?.classList.contains('bomb')) total++;
  }
}
// Recursively reveal neighboring empty cells if total === 0`,
    },
    component: () => import("../tricks/MineSweeper"),
  },
  {
    id: "movie-seat",
    title: "Movie Seat",
    description: "Seat picker demo migrated from legacy project.",
    category: "JS",
    technologies: ["localStorage", "events", "DOM"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/web-tricks/tree/main/src/tricks/MovieSeat.tsx",
    keyPoint: {
      explanation:
        "Saves selected seat indexes array and ticket price selection to localStorage.",
      code: `// Store selected seats index mapping
const seatsIndex = [...selectedSeats].map((seat) => [...seats].indexOf(seat));
localStorage.setItem('selectedSeats', JSON.stringify(seatsIndex));

// Update count and total sum in UI
count.innerText = selectedSeats.length;
total.innerText = selectedSeats.length * ticketPrice;`,
    },
    component: () => import("../tricks/MovieSeat"),
  },
  {
    id: "music-player",
    title: "Music Player",
    description: "Audio player demo migrated from legacy project.",
    category: "JS",
    technologies: ["audio", "controls", "progress"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/web-tricks/tree/main/src/tricks/MusicPlayer.tsx",
    keyPoint: {
      explanation:
        "Updates HTML audio currentTime on progress bar click and tracks timeupdate event.",
      code: `// Update progress bar width on audio playback
audio.addEventListener('timeupdate', (e) => {
  const { duration, currentTime } = e.srcElement;
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = \`\${progressPercent}%\`;
});`,
    },
    component: () => import("../tricks/MusicPlayer"),
  },
  {
    id: "random-choice-picker",
    title: "Random Choice Picker",
    description: "Random picker demo migrated from legacy project.",
    category: "JS",
    technologies: ["timers", "random", "DOM"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/web-tricks/tree/main/src/tricks/RandomChoicePicker.tsx",
    keyPoint: {
      explanation:
        "Flashes random tags at interval before picking winning index.",
      code: `// Random selection interval loop
const interval = setInterval(() => {
  const randomTag = pickRandomTag();
  highlightTag(randomTag);
  setTimeout(() => unHighlightTag(randomTag), 100);
}, 100);

// Stop after timeout and select final winner
setTimeout(() => clearInterval(interval), 3000);`,
    },
    component: () => import("../tricks/RandomChoicePicker"),
  },
  {
    id: "rotating-navigation",
    title: "Rotating Navigation",
    description: "Rotating nav effect migrated from legacy project.",
    category: "CSS",
    technologies: ["transforms", "navigation", "events"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/web-tricks/tree/main/src/tricks/RotatingNavigation.tsx",
    keyPoint: {
      explanation:
        "Rotates container layout -20deg and shifts navigation menu items into view.",
      code: `// Toggle show-nav class to rotate main article container
open.addEventListener('click', () => container.classList.add('show-nav'));
close.addEventListener('click', () => container.classList.remove('show-nav'));

/* CSS transform rotation */
// .container.show-nav { transform: rotate(-20deg); }`,
    },
    component: () => import("../tricks/RotatingNavigation"),
  },
  {
    id: "scroll-animation-legacy",
    title: "Scroll Animation (Legacy)",
    description: "Scroll reveal demo migrated from legacy project.",
    category: "CSS",
    technologies: ["scroll", "classes", "transitions"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/web-tricks/tree/main/src/tricks/ScrollAnimationLegacy.tsx",
    keyPoint: {
      explanation:
        "Checks trigger boundary against window.innerHeight to add 'show' class to scroll items.",
      code: `// Calculate window trigger point for scroll reveal
const triggerBottom = (window.innerHeight / 5) * 4;

boxes.forEach((box) => {
  const boxTop = box.getBoundingClientRect().top;
  if (boxTop < triggerBottom) box.classList.add('show');
  else box.classList.remove('show');
});`,
    },
    component: () => import("../tricks/ScrollAnimationLegacy"),
  },
  {
    id: "sortable-list",
    title: "Sortable List",
    description: "Drag and drop list demo migrated from legacy project.",
    category: "JS",
    technologies: ["drag and drop", "list", "events"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/web-tricks/tree/main/src/tricks/SortableList.tsx",
    keyPoint: {
      explanation:
        "Implements HTML5 Drag and Drop API events (dragstart, dragover, drop) to swap list elements.",
      code: `// Swap DOM elements during drop event
function dragDrop() {
  const dragEndIndex = +this.getAttribute('data-index');
  swapItems(dragStartIndex, dragEndIndex);
}

function swapItems(fromIndex, toIndex) {
  const itemOne = listItems[fromIndex].querySelector('.draggable');
  const itemTwo = listItems[toIndex].querySelector('.draggable');
  listItems[fromIndex].appendChild(itemTwo);
  listItems[toIndex].appendChild(itemOne);
}`,
    },
    component: () => import("../tricks/SortableList"),
  },
  {
    id: "typing-game",
    title: "Typing Game",
    description: "Typing speed game migrated from legacy project.",
    category: "JS",
    technologies: ["timers", "input", "game logic"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/web-tricks/tree/main/src/tricks/TypingGame.tsx",
    keyPoint: {
      explanation:
        "Decrements countdown timer every second and adds bonus time on matching input word.",
      code: `// Add bonus time when correct word is typed
input.addEventListener('input', (e) => {
  if (e.target.value === randomWord) {
    addWordToDOM();
    updateScore();
    time += 3; // +3 seconds reward!
  }
});`,
    },
    component: () => import("../tricks/TypingGame"),
  },
  {
    id: "exchange-rate-calculator",
    title: "Exchange Rate Calculator",
    description: "Currency conversion demo migrated from legacy project.",
    category: "JS",
    technologies: ["API", "currency", "forms"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/web-tricks/tree/main/src/tricks/ExchangeRateCalculator.tsx",
    keyPoint: {
      explanation:
        "Fetches live currency conversion rates and updates target input rate calculations.",
      code: `// Calculate converted rate from API response
fetch(\`https://open.er-api.com/v6/latest/\${currency_one}\`)
  .then((res) => res.json())
  .then((data) => {
    const rate = data.rates[currency_two];
    rateEl.innerText = \`1 \${currency_one} = \${rate} \${currency_two}\`;
    amountEl_two.value = (amountEl_one.value * rate).toFixed(2);
  });`,
    },
    component: () => import("../tricks/ExchangeRateCalculator"),
  },
  {
    id: "newyear-countdown",
    title: "New Year CountDown",
    description: "Countdown timer demo migrated from legacy project.",
    category: "JS",
    technologies: ["Date", "timers", "DOM"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/web-tricks/tree/main/src/tricks/NewYearCountDown.tsx",
    keyPoint: {
      explanation:
        "Calculates difference between target date and current timestamp for days, hours, mins, secs.",
      code: `// Calculate remaining countdown breakdown
const currentYear = new Date().getFullYear();
const newYearTime = new Date(\`January 01 \${currentYear + 1} 00:00:00\`);
const diff = newYearTime - new Date();

const d = Math.floor(diff / 1000 / 60 / 60 / 24);
const h = Math.floor(diff / 1000 / 60 / 60) % 24;
const m = Math.floor(diff / 1000 / 60) % 60;
const s = Math.floor(diff / 1000) % 60;`,
    },
    component: () => import("../tricks/NewYearCountDown"),
  },
  {
    id: "number-guessing-game",
    title: "Number Guessing Game",
    description: "Speech-based guessing game migrated from legacy project.",
    category: "JS",
    technologies: ["Web Speech API", "game", "DOM"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/web-tricks/tree/main/src/tricks/NumberGuessingGame.tsx",
    keyPoint: {
      explanation:
        "Uses Web Speech API SpeechRecognition to capture voice input and compare against target number.",
      code: `// Initialize SpeechRecognition listener
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = new window.SpeechRecognition();
recognition.start();

recognition.addEventListener('result', (e) => {
  const msg = e.results[0][0].transcript;
  checkNumber(msg);
});`,
    },
    component: () => import("../tricks/NumberGuessingGame"),
  },
  {
    id: "relaxer-legacy",
    title: "Relaxer",
    description: "Breathing exercise animation migrated from legacy project.",
    category: "JS",
    technologies: ["timers", "animation", "DOM"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/web-tricks/tree/main/src/tricks/RelaxerLegacy.tsx",
    keyPoint: {
      explanation:
        "Timer loop switching breathing state cycle between Breathe In, Hold, and Breathe Out.",
      code: `// Breathing cycle interval calculation
const totalTime = 7500;
const breatheTime = (totalTime / 5) * 2;
const holdTime = totalTime / 5;

function breathAnimation() {
  text.innerText = 'Breathe In!';
  container.className = 'container grow';
  setTimeout(() => {
    text.innerText = 'Hold';
    setTimeout(() => {
      text.innerText = 'Breathe Out!';
      container.className = 'container shrink';
    }, holdTime);
  }, breatheTime);
}`,
    },
    component: () => import("../tricks/RelaxerLegacy"),
  },
  {
    id: "sass-demo",
    title: "Sass Demo",
    description: "Sass-based layout demo migrated from legacy project.",
    category: "CSS",
    technologies: ["Sass", "layout", "components"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/web-tricks/tree/main/src/tricks/SassDemo.tsx",
    keyPoint: {
      explanation:
        "Sass nested selectors, SCSS variables, and responsive mixins compiled into stylesheet rules.",
      code: `// Sass nested syntax and mixin usage
$primary-color: #3490dc;

@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-card {
  @include flex-center;
  background: $primary-color;
}`,
    },
    component: () => import("../tricks/SassDemo"),
  },
  {
    id: "sound-board",
    title: "Sound Board",
    description: "Soundboard demo migrated from legacy project.",
    category: "JS",
    technologies: ["audio", "buttons", "events"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/web-tricks/tree/main/src/tricks/SoundBoard.tsx",
    keyPoint: {
      explanation:
        "Stops existing audio playback elements before playing the newly selected audio clip.",
      code: `// Stop active sounds before playing new clip
function stopSongs() {
  sounds.forEach((sound) => {
    const song = document.getElementById(sound);
    song.pause();
    song.currentTime = 0;
  });
}

btn.addEventListener('click', () => {
  stopSongs();
  document.getElementById(sound).play();
});`,
    },
    component: () => import("../tricks/SoundBoard"),
  },
  {
    id: "speech-text-reader",
    title: "Speech Text Reader",
    description: "Text-to-speech cards demo migrated from legacy project.",
    category: "JS",
    technologies: ["SpeechSynthesis", "cards", "modal"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/web-tricks/tree/main/src/tricks/SpeechTextReader.tsx",
    keyPoint: {
      explanation:
        "Uses SpeechSynthesisUtterance to convert text card prompts into spoken audio.",
      code: `// Create speech utterance & speak text
const message = new SpeechSynthesisUtterance();

function setTextMessage(text) {
  message.text = text;
}
function speakText() {
  speechSynthesis.speak(message);
}`,
    },
    component: () => import("../tricks/SpeechTextReader"),
  },
  {
    id: "split-landing-page",
    title: "Split Landing Page",
    description: "Split hero interaction migrated from legacy project.",
    category: "CSS",
    technologies: ["hover", "layout", "transitions"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/web-tricks/tree/main/src/tricks/SplitLandingPage.tsx",
    keyPoint: {
      explanation:
        "Expands hovered side container width to 75% while compressing opposite side to 25%.",
      code: `// Toggle hover split state classes
left.addEventListener('mouseenter', () => container.classList.add('hover-left'));
left.addEventListener('mouseleave', () => container.classList.remove('hover-left'));

/* CSS split width transitions */
// .hover-left .left { width: 75%; }
// .hover-left .right { width: 25%; }`,
    },
    component: () => import("../tricks/SplitLandingPage"),
  },
  {
    id: "tesla-configuration",
    title: "Tesla Configuration",
    description: "Vehicle configuration UI migrated from legacy project.",
    category: "JS",
    technologies: ["state", "UI controls", "images"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/web-tricks/tree/main/src/tricks/TeslaConfiguration.tsx",
    keyPoint: {
      explanation:
        "Updates active vehicle configuration state (color, wheels, package) and updates rendered spec view.",
      code: `// Update selected configuration option
function updateVehicleOption(key, value) {
  configState[key] = value;
  renderVehiclePreview(configState);
  calculateTotalPrice(configState);
}`,
    },
    component: () => import("../tricks/TeslaConfiguration"),
  },
  {
    id: "video-legacy",
    title: "Video Player",
    description: "Custom video controls demo migrated from legacy project.",
    category: "JS",
    technologies: ["video", "controls", "progress"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/web-tricks/tree/main/src/tricks/VideoLegacy.tsx",
    keyPoint: {
      explanation:
        "Custom video element play/pause toggle and time progress bar click positioning.",
      code: `// Toggle video play state
function toggleVideoStatus() {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
}
// Set video time from progress bar position
function setVideoProgress() {
  video.currentTime = (+progress.value * video.duration) / 100;
}`,
    },
    component: () => import("../tricks/VideoLegacy"),
  },
  {
    id: "winbox-landing-page",
    title: "Winbox Landing Page",
    description: "Landing page demo migrated from legacy project.",
    category: "JS",
    technologies: ["layout", "UI", "interactions"],
    thumbnail: progressStepsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/web-tricks/tree/main/src/tricks/WinboxLandingPage.tsx",
    keyPoint: {
      explanation:
        "Instantiates floating WinBox modal windows with custom dimensions and background themes.",
      code: `// Open floating desktop winbox window
const winbox = new WinBox({
  title: 'About Me',
  width: '400px',
  height: '400px',
  top: 50,
  right: 50,
  bottom: 50,
  left: 50,
  mount: document.querySelector('#about-content'),
});`,
    },
    component: () => import("../tricks/WinboxLandingPage"),
  },
  {
    id: "scroll-animations",
    title: "Scroll-Driven Animations",
    description:
      "Animate elements on scroll using pure CSS animation-timeline.",
    category: "CSS",
    technologies: ["animation-timeline", "CSS", "scroll()"],
    thumbnail: scrollAnimationsThumb,
    githubUrl:
      "https://github.com/jinyongnan810/web-tricks/tree/main/src/tricks/ScrollAnimations.tsx",
    fullscreenMode: "scale",
    keyPoint: {
      explanation:
        "Pure CSS scroll-driven animation using animation-timeline: view() and entry animation-range.",
      code: `/* Scroll-driven CSS Animation */
@keyframes fadeSlideIn {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.scroll-animate {
  animation: fadeSlideIn linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 100%;
}`,
    },
    component: () => import("../tricks/ScrollAnimations"),
  },
  {
    id: "intersection-observer",
    title: "Intersection Observer",
    description:
      "Lazy-load images and trigger animations when elements enter the viewport.",
    category: "JS",
    technologies: ["IntersectionObserver", "JavaScript", "lazy loading"],
    thumbnail: intersectionObserverThumb,
    githubUrl:
      "https://github.com/jinyongnan810/web-tricks/tree/main/src/tricks/IntersectionObserverDemo.tsx",
    fullscreenMode: "scale",
    keyPoint: {
      explanation:
        "IntersectionObserver triggering element state changes when entering 30% viewport visibility.",
      code: `useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.unobserve(el); // Unobserve after initial reveal
      }
    },
    { threshold: 0.3 }
  );
  if (ref.current) observer.observe(ref.current);
  return () => observer.disconnect();
}, []);`,
    },
    component: () => import("../tricks/IntersectionObserverDemo"),
  },
  {
    id: "optimistic-ui",
    title: "Optimistic UI Updates",
    description:
      "Update the UI instantly before the server confirms, then reconcile.",
    category: "React",
    technologies: ["React", "useState", "async"],
    thumbnail: optimisticUIThumb,
    githubUrl:
      "https://github.com/jinyongnan810/web-tricks/tree/main/src/tricks/OptimisticUI.tsx",
    fullscreenMode: "scale",
    keyPoint: {
      explanation:
        "Optimistically toggles item state and sets saving flag immediately before awaiting server response.",
      code: `const toggle = async (id: number) => {
  // 1. Optimistic update in UI state
  setTodos((prev) => prev.map((t) => t.id === id ? { ...t, done: !t.done, saving: true } : t));

  // 2. Await async API / server call
  await simulateServer();

  // 3. Confirm & clear saving state flag
  setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, saving: false } : t)));
};`,
    },
    component: () => import("../tricks/OptimisticUI"),
  },
  {
    id: "container-queries",
    title: "Container Queries",
    description:
      "Style components based on their parent size, not the viewport.",
    category: "CSS",
    technologies: ["@container", "CSS", "container-type"],
    thumbnail: containerQueriesThumb,
    githubUrl:
      "https://github.com/jinyongnan810/web-tricks/tree/main/src/tricks/ContainerQueries.tsx",
    fullscreenMode: "scale",
    keyPoint: {
      explanation:
        "Defines container-type: inline-size on wrapper and @container query to switch card orientation dynamically.",
      code: `/* Container query CSS layout */
.cq-container {
  container-type: inline-size;
}

.cq-card { display: flex; flex-direction: column; }

/* Adapts card layout when container width exceeds 350px */
@container (min-width: 350px) {
  .cq-card { flex-direction: row; align-items: center; }
}`,
    },
    component: () => import("../tricks/ContainerQueries"),
  },
];

const legacyThumbnailById: Record<string, string> = {
  "blurry-loading": "/thumbnails/legacy/blurry-loading.png",
  "breakout-game": "/thumbnails/legacy/breakout.png",
  "dom-methods": "/thumbnails/legacy/dom-methods.jpg",
  "exapanse-tracker": "/thumbnails/legacy/expance-tracker.jpg",
  "extending-cards": "/thumbnails/legacy/extending-cards.png",
  "faq-collapse": "/thumbnails/legacy/faq-collapse.png",
  "form-validator-legacy": "/thumbnails/legacy/form-validator.jpg",
  "form-wave-animation": "/thumbnails/legacy/form-wave-animation.png",
  "hangman-legacy": "/thumbnails/legacy/hangman.jpg",
  "hidden-search": "/thumbnails/legacy/hidden-search.png",
  "infinite-scroll": "/thumbnails/legacy/infinite-scroll.jpg",
  "key-codes": "/thumbnails/legacy/key-codes.png",
  "kins-page": "/thumbnails/legacy/kins-page.png",
  "lyrics-search": "/thumbnails/legacy/lyrics-search.jpg",
  "meal-search": "/thumbnails/legacy/meals-search.jpg",
  "memory-cards": "/thumbnails/legacy/memory-cards.jpg",
  "menu-modal": "/thumbnails/legacy/menu-modal.jpg",
  "mine-sweeper": "/thumbnails/legacy/mine-sweeper.png",
  "movie-seat": "/thumbnails/legacy/movie-seat.jpg",
  "music-player": "/thumbnails/legacy/music-player.png",
  "random-choice-picker": "/thumbnails/legacy/random-choice-picker.png",
  "rotating-navigation": "/thumbnails/legacy/rotating-navigation.png",
  "scroll-animation-legacy": "/thumbnails/legacy/scroll-animation.png",
  "sortable-list": "/thumbnails/legacy/sortable-list.png",
  "typing-game": "/thumbnails/legacy/typing-game.jpg",
  "exchange-rate-calculator": "/thumbnails/legacy/exchange-rate.jpg",
  "newyear-countdown": "/thumbnails/legacy/new-year.png",
  "number-guessing-game": "/thumbnails/legacy/guess-number.png",
  "relaxer-legacy": "/thumbnails/legacy/relaxer.png",
  "sass-demo": "/thumbnails/legacy/sass-demo.png",
  "sound-board": "/thumbnails/legacy/sound-board.png",
  "speech-text-reader": "/thumbnails/legacy/speech-text-reader.jpg",
  "split-landing-page": "/thumbnails/legacy/split-landing-page.png",
  "tesla-configuration": "/thumbnails/legacy/tesla-configuration.png",
  "video-legacy": "/thumbnails/legacy/video.jpg",
  "winbox-landing-page": "/thumbnails/legacy/winbox-landing-page.png",
};

const legacySourceFolderById: Record<string, string> = {
  "blurry-loading": "Blurry-Loading",
  "breakout-game": "Breakout-Game",
  "dom-methods": "Dom-Methods",
  "exapanse-tracker": "Exapanse-Tracker",
  "extending-cards": "Extending-Cards",
  "faq-collapse": "FAQ-Collapse",
  "form-validator-legacy": "Form-Validator",
  "form-wave-animation": "Form-Wave-Animation",
  "hangman-legacy": "Hangman",
  "hidden-search": "Hidden-Search",
  "infinite-scroll": "Infinite-Scroll",
  "key-codes": "Key-Codes",
  "kins-page": "Kins-Page",
  "lyrics-search": "Lyrics-Search",
  "meal-search": "Meal-Search",
  "memory-cards": "Memory-Cards",
  "menu-modal": "Menu-Modal",
  "mine-sweeper": "Mine-Sweeper",
  "movie-seat": "Movie-Seat",
  "music-player": "Music-Player",
  "random-choice-picker": "Random-Choice-Picker",
  "rotating-navigation": "Rotating-Navigation",
  "scroll-animation-legacy": "Scroll-Animation",
  "sortable-list": "Sortable-List",
  "typing-game": "Typing-Game",
  "exchange-rate-calculator": "Exchange-Rate-Calculator",
  "newyear-countdown": "NewYear-CountDown",
  "number-guessing-game": "Number-Guessing-Game",
  "relaxer-legacy": "Relaxer",
  "sass-demo": "Sass-Demo",
  "sound-board": "Sound-Board",
  "speech-text-reader": "Speech-Text-Reader",
  "split-landing-page": "Split-Landing-Page",
  "tesla-configuration": "Tesla-Configuration",
  "video-legacy": "Video",
  "winbox-landing-page": "Winbox-Landing-Page",
};

export const tricks: Trick[] = trickList.map((trick) => {
  const sourceFolder = legacySourceFolderById[trick.id];
  const githubUrl = sourceFolder
    ? `https://github.com/jinyongnan810/web-tricks/tree/main/public/legacy-tricks/${sourceFolder}`
    : trick.githubUrl;

  if (trick.thumbnail === progressStepsThumb && trick.id !== "progress-steps") {
    const mappedThumbnail = legacyThumbnailById[trick.id];
    if (mappedThumbnail) {
      return { ...trick, githubUrl, thumbnail: mappedThumbnail };
    }
    return { ...trick, githubUrl, thumbnail: progressStepsThumb };
  }
  return { ...trick, githubUrl };
});

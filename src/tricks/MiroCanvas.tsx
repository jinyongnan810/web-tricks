import {
  ChevronDown,
  ChevronsDown,
  ChevronsUp,
  ChevronUp,
  Copy,
  Maximize2,
  Palette,
  Plus,
  RotateCcw,
  Sparkles,
  Trash2,
  Type,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * Trick Concept: Miro Canvas & Trackpad Pinch/Pan Engine
 *
 * Essential Concepts:
 * 1. WebKit Gesture & Chrome Wheel Dual Trackpad Handling:
 *    - Safari on macOS fires WebKit gesture events (`gesturestart`, `gesturechange`).
 *      Calling `setViewport` inside `gesturechange` using `initialZoom * e.scale` enables
 *      smooth, 60fps trackpad pinch zoom on Safari while preventing native page zoom.
 *    - Chrome & Firefox fire `wheel` events with `ctrlKey === true`.
 *      Calling `setViewport` using `zoomFactor` enables smooth trackpad pinch zoom on Chrome.
 *
 * 2. Atomic Viewport State (x, y, zoom):
 *    Single unified state object ensures pan offsets (x, y) and scale factor (zoom)
 *    update synchronously in one re-render pass.
 *
 * 3. Pointer-Anchored Zoom Matrix Math:
 *    canvasX = (mouseX - prevX) / prevZoom
 *    canvasY = (mouseY - prevY) / prevZoom
 *    nextX = mouseX - canvasX * nextZoom
 *    nextY = mouseY - canvasY * nextZoom
 */

export interface Sticker {
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  bgColor: string;
  textColor: string;
  fontSize: number;
}

// Preset color palettes inspired by Miro canvas sticky notes
const BG_PALETTES = [
  { name: "Yellow", bg: "#fef08a", text: "#1e293b" },
  { name: "Mint", bg: "#bbf7d0", text: "#064e3b" },
  { name: "Sky", bg: "#bae6fd", text: "#0c4a6e" },
  { name: "Pink", bg: "#fbcfe8", text: "#831843" },
  { name: "Purple", bg: "#e9d5ff", text: "#581c87" },
  { name: "Orange", bg: "#fed7aa", text: "#7c2d12" },
  { name: "Dark", bg: "#1e293b", text: "#f8fafc" },
  { name: "White", bg: "#ffffff", text: "#0f172a" },
];

const TEXT_COLORS = [
  { name: "Charcoal", value: "#0f172a" },
  { name: "Pure White", value: "#ffffff" },
  { name: "Electric Blue", value: "#2563eb" },
  { name: "Emerald", value: "#059669" },
  { name: "Crimson", value: "#dc2626" },
  { name: "Purple", value: "#7c3aed" },
  { name: "Amber", value: "#d97706" },
];

const FONT_SIZES = [
  { label: "S", value: 14 },
  { label: "M", value: 18 },
  { label: "L", value: 24 },
  { label: "XL", value: 32 },
  { label: "2XL", value: 40 },
];

// Initial template sticky notes for demo
const INITIAL_STICKERS: Sticker[] = [
  {
    id: "sticker-1",
    text: "🚀 Sprint Goal:\nDeliver Miro-like infinite canvas with stickers",
    x: 80,
    y: 80,
    width: 230,
    height: 200,
    bgColor: "#fef08a",
    textColor: "#1e293b",
    fontSize: 18,
  },
  {
    id: "sticker-2",
    text: "💡 Key Feature:\nResizable sticky notes & text color selection",
    x: 340,
    y: 100,
    width: 230,
    height: 190,
    bgColor: "#bae6fd",
    textColor: "#0c4a6e",
    fontSize: 18,
  },
  {
    id: "sticker-3",
    text: "🎨 Overlay Toolbars:\nFloating controls float on top without resizing canvas!",
    x: 600,
    y: 120,
    width: 240,
    height: 180,
    bgColor: "#bbf7d0",
    textColor: "#064e3b",
    fontSize: 18,
  },
  {
    id: "sticker-4",
    text: "⚡ Quick Tip: Pointer position stays fixed during zoom. 2-finger swipe to pan!",
    x: 200,
    y: 320,
    width: 340,
    height: 160,
    bgColor: "#e9d5ff",
    textColor: "#581c87",
    fontSize: 18,
  },
];

export default function MiroCanvas() {
  const [stickers, setStickers] = useState<Sticker[]>(INITIAL_STICKERS);
  const [selectedId, setSelectedId] = useState<string | null>("sticker-1");

  // Atomic viewport state: x, y pan offset and zoom scale factor
  const [viewport, setViewport] = useState({ x: 0, y: 0, zoom: 1 });
  const viewportRef = useRef(viewport);

  useEffect(() => {
    viewportRef.current = viewport;
  }, [viewport]);

  // Interaction tracking state
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const [resizingId, setResizingId] = useState<string | null>(null);
  const [resizeStart, setResizeStart] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const mousePosRef = useRef<{ x: number; y: number } | null>(null);
  const isHoveringRef = useRef<boolean>(false);

  // Retrieve currently selected sticker & its layer index (0-based)
  const selectedIndex = useMemo(
    () => stickers.findIndex((s) => s.id === selectedId),
    [stickers, selectedId],
  );

  const selectedSticker = useMemo(
    () => (selectedIndex !== -1 ? stickers[selectedIndex] : null),
    [stickers, selectedIndex],
  );

  // -------------------------------------------------------------
  // Array-Order Layer Management Methods
  // -------------------------------------------------------------

  const bringToFront = useCallback((id: string) => {
    setStickers((items) => {
      const target = items.find((item) => item.id === id);
      if (!target) return items;
      return [...items.filter((item) => item.id !== id), target];
    });
  }, []);

  const bringForward = useCallback((id: string) => {
    setStickers((items) => {
      const idx = items.findIndex((item) => item.id === id);
      if (idx === -1 || idx === items.length - 1) return items;
      const nextItems = [...items];
      const temp = nextItems[idx];
      nextItems[idx] = nextItems[idx + 1];
      nextItems[idx + 1] = temp;
      return nextItems;
    });
  }, []);

  const sendBackward = useCallback((id: string) => {
    setStickers((items) => {
      const idx = items.findIndex((item) => item.id === id);
      if (idx <= 0) return items;
      const nextItems = [...items];
      const temp = nextItems[idx];
      nextItems[idx] = nextItems[idx - 1];
      nextItems[idx - 1] = temp;
      return nextItems;
    });
  }, []);

  const sendToBack = useCallback((id: string) => {
    setStickers((items) => {
      const target = items.find((item) => item.id === id);
      if (!target) return items;
      return [target, ...items.filter((item) => item.id !== id)];
    });
  }, []);

  // -------------------------------------------------------------
  // Viewport Zoom & Canvas Methods
  // -------------------------------------------------------------

  /**
   * Toolbar button zoom: Always zooms centered at the exact center of the canvas viewport
   */
  const zoomByMultiplier = useCallback((multiplier: number) => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;

    const rect = canvasEl.getBoundingClientRect();
    const anchorX = rect.width / 2;
    const anchorY = rect.height / 2;

    setViewport((prev) => {
      const nextZoom = Math.min(3.0, Math.max(0.3, prev.zoom * multiplier));
      const canvasX = (anchorX - prev.x) / prev.zoom;
      const canvasY = (anchorY - prev.y) / prev.zoom;

      return {
        x: anchorX - canvasX * nextZoom,
        y: anchorY - canvasY * nextZoom,
        zoom: nextZoom,
      };
    });
  }, []);

  const addSticker = useCallback(
    (paletteIndex = 0) => {
      const palette = BG_PALETTES[paletteIndex % BG_PALETTES.length];
      const nextId = `sticker-${Date.now()}`;

      const canvasWidth = canvasRef.current?.clientWidth || 800;
      const canvasHeight = canvasRef.current?.clientHeight || 600;

      const centerX = (canvasWidth / 2 - viewport.x) / viewport.zoom - 100;
      const centerY = (canvasHeight / 2 - viewport.y) / viewport.zoom - 90;

      const newSticker: Sticker = {
        id: nextId,
        text: "New Sticky Note\nType your thoughts here...",
        x: Math.max(20, centerX + (Math.random() * 40 - 20)),
        y: Math.max(20, centerY + (Math.random() * 40 - 20)),
        width: 220,
        height: 200,
        bgColor: palette.bg,
        textColor: palette.text,
        fontSize: 18,
      };

      setStickers((prev) => [...prev, newSticker]);
      setSelectedId(nextId);
    },
    [viewport.x, viewport.y, viewport.zoom],
  );

  const duplicateSticker = useCallback(() => {
    if (!selectedSticker) return;
    const nextId = `sticker-${Date.now()}`;

    const copy: Sticker = {
      ...selectedSticker,
      id: nextId,
      x: selectedSticker.x + 30,
      y: selectedSticker.y + 30,
    };

    setStickers((prev) => {
      const idx = prev.findIndex((s) => s.id === selectedSticker.id);
      if (idx === -1) return [...prev, copy];
      const nextItems = [...prev];
      nextItems.splice(idx + 1, 0, copy);
      return nextItems;
    });
    setSelectedId(nextId);
  }, [selectedSticker]);

  const deleteSticker = useCallback(
    (idToDelete?: string) => {
      const targetId = idToDelete || selectedId;
      if (!targetId) return;

      setStickers((prev) => prev.filter((s) => s.id !== targetId));
      if (selectedId === targetId) {
        setSelectedId(null);
      }
    },
    [selectedId],
  );

  const updateSticker = useCallback((id: string, updates: Partial<Sticker>) => {
    setStickers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    );
  }, []);

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      mousePosRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      e.target === canvasRef.current ||
      (e.target as HTMLElement).id === "canvas-grid"
    ) {
      setSelectedId(null);
      setIsPanning(true);
      setPanStart({ x: e.clientX - viewport.x, y: e.clientY - viewport.y });
    }
  };

  const handleStickerMouseDown = (
    e: React.MouseEvent<HTMLDivElement>,
    sticker: Sticker,
  ) => {
    e.stopPropagation();
    setSelectedId(sticker.id);

    setDraggingId(sticker.id);
    setDragOffset({
      x: e.clientX / viewport.zoom - sticker.x,
      y: e.clientY / viewport.zoom - sticker.y,
    });
  };

  const handleResizeMouseDown = (
    e: React.MouseEvent<HTMLDivElement>,
    sticker: Sticker,
  ) => {
    e.stopPropagation();
    setSelectedId(sticker.id);

    setResizingId(sticker.id);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: sticker.width,
      height: sticker.height,
    });
  };

  /**
   * Trackpad Wheel & WebKit Gesture Event Listeners
   * Intercepts pinch-to-zoom on Safari (gesturestart/gesturechange) and Chrome (wheel ctrlKey)
   * and scales canvas zoom anchored at pointer while preventing browser native page zoom.
   */
  useEffect(() => {
    const containerEl = containerRef.current;
    if (!containerEl) return;

    let initialGestureZoom = 1;

    // WebKit Safari Trackpad Pinch Handlers
    const handleGestureStart = (e: Event) => {
      e.preventDefault();
      initialGestureZoom = viewportRef.current.zoom;
    };

    const handleGestureChange = (e: Event) => {
      e.preventDefault();
      const gestureEv = e as unknown as {
        scale: number;
        clientX: number;
        clientY: number;
      };

      const rect = containerEl.getBoundingClientRect();
      const mouseX =
        typeof gestureEv.clientX === "number" && gestureEv.clientX > 0
          ? gestureEv.clientX - rect.left
          : mousePosRef.current
            ? mousePosRef.current.x
            : rect.width / 2;
      const mouseY =
        typeof gestureEv.clientY === "number" && gestureEv.clientY > 0
          ? gestureEv.clientY - rect.top
          : mousePosRef.current
            ? mousePosRef.current.y
            : rect.height / 2;

      const scale = gestureEv.scale;
      if (!scale || !Number.isFinite(scale)) return;

      setViewport((prev) => {
        const nextZoom = Math.min(
          3.0,
          Math.max(0.3, initialGestureZoom * scale),
        );
        const canvasX = (mouseX - prev.x) / prev.zoom;
        const canvasY = (mouseY - prev.y) / prev.zoom;

        console.log(
          `mouse position: ${mouseX}, ${mouseY}, canvas position: ${canvasX}, ${canvasY}, prev zoom: ${prev.zoom}, next zoom: ${nextZoom}`,
        );
        console.log(
          `prev viewport: ${JSON.stringify(prev)}, next viewport: ${JSON.stringify(
            {
              x: mouseX - canvasX * nextZoom,
              y: mouseY - canvasY * nextZoom,
              zoom: nextZoom,
            },
          )} `,
        );

        return {
          x: mouseX - canvasX * nextZoom,
          y: mouseY - canvasY * nextZoom,
          zoom: nextZoom,
        };
      });
    };

    const handleGestureEnd = (e: Event) => {
      e.preventDefault();
    };

    // Chrome / Firefox / General Wheel & Trackpad Pan Handlers
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const rect = containerEl.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      mousePosRef.current = { x: mouseX, y: mouseY };

      if (e.ctrlKey || e.metaKey) {
        // 2-Finger Trackpad Pinch or Ctrl + Wheel Zoom
        const zoomFactor = Math.exp(-e.deltaY * 0.008);

        setViewport((prev) => {
          const nextZoom = Math.min(3.0, Math.max(0.3, prev.zoom * zoomFactor));
          const canvasX = (mouseX - prev.x) / prev.zoom;
          const canvasY = (mouseY - prev.y) / prev.zoom;

          return {
            x: mouseX - canvasX * nextZoom,
            y: mouseY - canvasY * nextZoom,
            zoom: nextZoom,
          };
        });
      } else {
        // 2-Finger Trackpad Pan
        setViewport((prev) => ({
          ...prev,
          x: prev.x - e.deltaX,
          y: prev.y - e.deltaY,
        }));
      }
    };

    // Attach non-passive event listeners to container element
    containerEl.addEventListener("wheel", handleWheel, { passive: false });
    containerEl.addEventListener("gesturestart", handleGestureStart, {
      passive: false,
    });
    containerEl.addEventListener("gesturechange", handleGestureChange, {
      passive: false,
    });
    containerEl.addEventListener("gestureend", handleGestureEnd, {
      passive: false,
    });

    // Window level listeners to intercept ctrl+wheel / gesture when hovering over component
    const handleWindowWheel = (e: WheelEvent) => {
      if ((e.ctrlKey || e.metaKey) && isHoveringRef.current) {
        e.preventDefault();
      }
    };

    const handleWindowGesture = (e: Event) => {
      if (isHoveringRef.current) {
        e.preventDefault();
      }
    };

    window.addEventListener("wheel", handleWindowWheel, { passive: false });
    window.addEventListener("gesturestart", handleWindowGesture, {
      passive: false,
    });
    window.addEventListener("gesturechange", handleWindowGesture, {
      passive: false,
    });

    return () => {
      containerEl.removeEventListener("wheel", handleWheel);
      containerEl.removeEventListener("gesturestart", handleGestureStart);
      containerEl.removeEventListener("gesturechange", handleGestureChange);
      containerEl.removeEventListener("gestureend", handleGestureEnd);

      window.removeEventListener("wheel", handleWindowWheel);
      window.removeEventListener("gesturestart", handleWindowGesture);
      window.removeEventListener("gesturechange", handleWindowGesture);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isPanning) {
        setViewport((prev) => ({
          ...prev,
          x: e.clientX - panStart.x,
          y: e.clientY - panStart.y,
        }));
        return;
      }

      if (draggingId) {
        const nextX = e.clientX / viewport.zoom - dragOffset.x;
        const nextY = e.clientY / viewport.zoom - dragOffset.y;
        updateSticker(draggingId, {
          x: Math.round(nextX),
          y: Math.round(nextY),
        });
        return;
      }

      if (resizingId) {
        const deltaX = (e.clientX - resizeStart.x) / viewport.zoom;
        const deltaY = (e.clientY - resizeStart.y) / viewport.zoom;

        const nextWidth = Math.max(120, resizeStart.width + deltaX);
        const nextHeight = Math.max(80, resizeStart.height + deltaY);

        updateSticker(resizingId, {
          width: Math.round(nextWidth),
          height: Math.round(nextHeight),
        });
      }
    };

    const handleMouseUp = () => {
      setIsPanning(false);
      setDraggingId(null);
      setResizingId(null);
    };

    if (isPanning || draggingId || resizingId) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    isPanning,
    panStart,
    draggingId,
    dragOffset,
    resizingId,
    resizeStart,
    viewport.zoom,
    updateSticker,
  ]);

  const resetTemplate = () => {
    setStickers(INITIAL_STICKERS);
    setSelectedId("sticker-1");
    setViewport({ x: 0, y: 0, zoom: 1 });
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => {
        isHoveringRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveringRef.current = false;
      }}
      className="relative w-full h-[680px] rounded-2xl border border-border bg-page overflow-hidden shadow-lg select-none"
    >
      {/* 1. Main Interactive Canvas Area (Fills 100% of container height) */}
      <div
        ref={canvasRef}
        id="canvas-grid"
        onMouseMove={handleCanvasMouseMove}
        onMouseDown={handleCanvasMouseDown}
        style={{
          cursor: isPanning ? "grabbing" : "grab",
        }}
        className="absolute inset-0 w-full h-full overflow-hidden bg-page transition-colors select-none"
      >
        {/* Canvas World Container transformed by Pan & Zoom */}
        <div
          style={{
            transform: `translate3d(${viewport.x}px, ${viewport.y}px, 0) scale(${viewport.zoom})`,
            transformOrigin: "0 0",
          }}
          className="absolute inset-0 pointer-events-none"
        >
          {/* Dot Grid Background */}
          <div
            aria-hidden="true"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(161, 161, 170, 0.35) 1.2px, transparent 1.2px)",
              backgroundSize: "24px 24px",
            }}
            className="absolute -inset-[5000px] pointer-events-none"
          />

          {/* Stickers */}
          {stickers.map((sticker, layerIndex) => {
            const isSelected = sticker.id === selectedId;

            return (
              <div
                key={sticker.id}
                onMouseDown={(e) => handleStickerMouseDown(e, sticker)}
                style={{
                  transform: `translate3d(${sticker.x}px, ${sticker.y}px, 0)`,
                  width: `${sticker.width}px`,
                  height: `${sticker.height}px`,
                  backgroundColor: sticker.bgColor,
                  color: sticker.textColor,
                  zIndex: layerIndex + 1,
                  borderRadius: "0.25rem",
                  boxShadow: isSelected
                    ? "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
                    : "2px 4px 10px rgba(0, 0, 0, 0.12)",
                }}
                className={`absolute pointer-events-auto flex flex-col p-3 transition-shadow border border-black/10 ${
                  isSelected
                    ? "border-amber-400 ring-2 ring-amber-400/50"
                    : "hover:border-black/30"
                }`}
              >
                {/* Sticky Note Dog-Eared Fold Accent Flap */}
                <div
                  aria-hidden="true"
                  className="absolute right-0 bottom-0 w-4 h-4 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.12) 50%)",
                  }}
                />

                {/* Top Drag Handle Bar */}
                <div
                  aria-label="Drag note handle"
                  className="w-full h-3 flex items-center justify-between cursor-move shrink-0 mb-1 opacity-40 hover:opacity-100 transition-opacity"
                >
                  <div className="w-6 h-1 rounded-full bg-current opacity-30 mx-auto" />
                </div>

                {/* Editable Text Area */}
                <div className="w-full flex-1 flex">
                  <textarea
                    value={sticker.text}
                    onChange={(e) =>
                      updateSticker(sticker.id, { text: e.target.value })
                    }
                    onFocus={() => setSelectedId(sticker.id)}
                    style={{
                      color: sticker.textColor,
                      fontSize: `${sticker.fontSize}px`,
                      lineHeight: 1.35,
                    }}
                    placeholder="Type your notes here..."
                    className="w-full h-full bg-transparent resize-none outline-none font-body font-medium placeholder-current/40 border-none p-0 overflow-y-auto"
                  />
                </div>

                {/* Resizable Corner Handle (Bottom Right) */}
                {isSelected && (
                  <div
                    onMouseDown={(e) => handleResizeMouseDown(e, sticker)}
                    aria-label="Resize note handle"
                    title="Drag to resize"
                    className="absolute -right-2 -bottom-2 w-5 h-5 rounded-full bg-amber-400 border-2 border-white shadow-md cursor-se-resize flex items-center justify-center z-30 transition-transform hover:scale-125"
                  >
                    <Maximize2 size={10} className="text-zinc-950 rotate-90" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Fixed Floating Top Header & Action Controls Toolbar */}
      <div className="absolute top-3 left-3 right-3 z-30 flex flex-col gap-2 pointer-events-none">
        {/* Main Action Bar */}
        <div className="pointer-events-auto flex flex-wrap items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border border-border bg-card/85 backdrop-blur-md shadow-md">
          {/* Brand Title */}
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-amber-400 text-amber-950 font-bold shadow-xs">
              <Sparkles size={16} />
            </div>
            <div>
              <h3 className="font-display font-bold text-xs tracking-tight text-text-primary m-0">
                Miro Sticky Canvas
              </h3>
              <p className="text-[10px] text-text-tertiary m-0 hidden sm:block">
                Fixed overlay controls • Pointer-anchored zoom
              </p>
            </div>
          </div>

          {/* Action Controls Toolbar */}
          <div className="flex items-center gap-1.5 bg-page/90 border border-border p-1 rounded-lg shadow-xs">
            {/* Add Sticker Button */}
            <button
              type="button"
              onClick={() =>
                addSticker(Math.floor(Math.random() * BG_PALETTES.length))
              }
              aria-label="Add sticky note sticker"
              title="Add Sticky Note"
              className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-300 hover:bg-amber-400 text-amber-950 text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Plus size={14} />
              <span>Add Sticker</span>
            </button>

            <div className="w-px h-4 bg-border mx-1" />

            {/* Zoom Controls */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => zoomByMultiplier(0.85)}
                aria-label="Zoom Out"
                title="Zoom Out"
                className="p-1 rounded text-text-secondary hover:bg-card transition-colors cursor-pointer"
              >
                <ZoomOut size={14} />
              </button>
              <span className="text-[11px] font-mono font-medium text-text-secondary w-9 text-center select-none">
                {Math.round(viewport.zoom * 100)}%
              </span>
              <button
                type="button"
                onClick={() => zoomByMultiplier(1.15)}
                aria-label="Zoom In"
                title="Zoom In"
                className="p-1 rounded text-text-secondary hover:bg-card transition-colors cursor-pointer"
              >
                <ZoomIn size={14} />
              </button>
            </div>

            <div className="w-px h-4 bg-border mx-1" />

            {/* Reset Template */}
            <button
              type="button"
              onClick={resetTemplate}
              aria-label="Reset Miro canvas template"
              title="Reset Canvas Template"
              className="p-1 rounded text-text-secondary hover:bg-card transition-colors cursor-pointer"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>

        {/* Floating Contextual Formatting Toolbar (Floats overlay below header when sticker is selected) */}
        {selectedSticker && (
          <div className="pointer-events-auto flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 bg-zinc-900/95 text-white rounded-xl border border-zinc-700/60 shadow-xl backdrop-blur-md text-xs transition-all animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-3 overflow-x-auto py-0.5">
              {/* Sticker Background Color Palette */}
              <div className="flex items-center gap-1.5">
                <span className="text-zinc-400 font-medium text-[11px] flex items-center gap-1">
                  <Palette size={12} /> Note Color:
                </span>
                <div className="flex items-center gap-1">
                  {BG_PALETTES.map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() =>
                        updateSticker(selectedSticker.id, {
                          bgColor: p.bg,
                          textColor: p.text,
                        })
                      }
                      aria-label={`Set background color to ${p.name}`}
                      title={p.name}
                      style={{ backgroundColor: p.bg }}
                      className={`w-5 h-5 rounded-full border transition-transform hover:scale-110 cursor-pointer ${
                        selectedSticker.bgColor === p.bg
                          ? "ring-2 ring-amber-400 scale-110 border-white"
                          : "border-black/20"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="w-px h-4 bg-zinc-700 mx-1" />

              {/* Text Color Picker */}
              <div className="flex items-center gap-1.5">
                <span className="text-zinc-400 font-medium text-[11px] flex items-center gap-1">
                  <Type size={12} /> Text Color:
                </span>
                <div className="flex items-center gap-1">
                  {TEXT_COLORS.map((tc) => (
                    <button
                      key={tc.name}
                      type="button"
                      onClick={() =>
                        updateSticker(selectedSticker.id, {
                          textColor: tc.value,
                        })
                      }
                      aria-label={`Set text color to ${tc.name}`}
                      title={tc.name}
                      style={{ backgroundColor: tc.value }}
                      className={`w-5 h-5 rounded-full border border-white/20 transition-transform hover:scale-110 cursor-pointer ${
                        selectedSticker.textColor === tc.value
                          ? "ring-2 ring-amber-400 scale-110 border-white"
                          : ""
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="w-px h-4 bg-zinc-700 mx-1" />

              {/* Font Size Presets */}
              <div className="flex items-center gap-1.5">
                <span className="text-zinc-400 font-medium text-[11px]">
                  Size:
                </span>
                <div className="flex items-center gap-1 bg-zinc-800 p-0.5 rounded-md">
                  {FONT_SIZES.map((fs) => (
                    <button
                      key={fs.label}
                      type="button"
                      onClick={() =>
                        updateSticker(selectedSticker.id, {
                          fontSize: fs.value,
                        })
                      }
                      aria-label={`Set font size to ${fs.value}px`}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                        selectedSticker.fontSize === fs.value
                          ? "bg-amber-400 text-zinc-950"
                          : "text-zinc-300 hover:bg-zinc-700"
                      }`}
                    >
                      {fs.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Action Icons: Clean Layer Controls & Actions */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono text-zinc-400 px-1">
                Layer {selectedIndex + 1}/{stickers.length}
              </span>

              <div className="flex items-center gap-0.5 bg-zinc-800 p-0.5 rounded-md">
                <button
                  type="button"
                  onClick={() => bringToFront(selectedSticker.id)}
                  disabled={selectedIndex === stickers.length - 1}
                  aria-label="Bring note to front layer"
                  title="Bring to Top Layer"
                  className="p-1 rounded text-zinc-300 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-300 transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronsUp size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => bringForward(selectedSticker.id)}
                  disabled={selectedIndex === stickers.length - 1}
                  aria-label="Bring note forward 1 level"
                  title="Bring Forward (+1)"
                  className="p-1 rounded text-zinc-300 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-300 transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronUp size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => sendBackward(selectedSticker.id)}
                  disabled={selectedIndex === 0}
                  aria-label="Send note backward 1 level"
                  title="Send Backward (-1)"
                  className="p-1 rounded text-zinc-300 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-300 transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronDown size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => sendToBack(selectedSticker.id)}
                  disabled={selectedIndex === 0}
                  aria-label="Send note to bottom layer"
                  title="Send to Bottom Layer"
                  className="p-1 rounded text-zinc-300 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-300 transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronsDown size={14} />
                </button>
              </div>

              <div className="w-px h-4 bg-zinc-700 mx-1" />

              <button
                type="button"
                onClick={duplicateSticker}
                aria-label="Duplicate selected note"
                title="Duplicate Note"
                className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                <Copy size={14} />
              </button>
              <button
                type="button"
                onClick={() => deleteSticker(selectedSticker.id)}
                aria-label="Delete selected note"
                title="Delete Note"
                className="p-1.5 rounded-md hover:bg-red-900/60 text-red-400 hover:text-red-200 transition-colors cursor-pointer"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. Floating Bottom Footer Info bar */}
      <div className="absolute bottom-3 left-3 right-3 z-20 pointer-events-none">
        <div className="pointer-events-auto flex items-center justify-between px-3 py-1.5 rounded-lg border border-border/80 bg-card/75 backdrop-blur-md text-[11px] text-text-tertiary shadow-xs">
          <div className="flex items-center gap-4">
            <span>
              Stickers:{" "}
              <strong className="text-text-primary">{stickers.length}</strong>
            </span>
            <span className="hidden sm:inline">
              • Click note to edit & format
            </span>
            <span className="hidden md:inline">
              • Drag corner handle to resize
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span>Pointer-anchored zoom • 2-finger swipe to pan</span>
          </div>
        </div>
      </div>
    </div>
  );
}

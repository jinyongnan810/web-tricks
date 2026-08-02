import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router";
import type { Category } from "../App";
import TrickCard from "../components/TrickCard";
import { tricks } from "../data/tricks";

const GALLERY_SCROLL_POSITION_KEY = "gallery-scroll-position";

const categories: { label: string; value: Category }[] = [
  { label: "All", value: "All" },
  { label: "CSS", value: "CSS" },
  { label: "JavaScript", value: "JS" },
  { label: "React", value: "React" },
];

export default function Gallery() {
  const location = useLocation();
  const [filter, setFilter] = useState<Category>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus search input on pressing '/' or 'Cmd+K' / 'Ctrl+K'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName;
      const isInputActive = activeTag === "INPUT" || activeTag === "TEXTAREA";

      if (
        (e.key === "/" && !isInputActive) ||
        ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Restore scroll position if returning from trick detail
  useLayoutEffect(() => {
    if (location.state?.restoreGalleryScroll !== true) {
      return;
    }

    const savedScrollPosition = window.sessionStorage.getItem(
      GALLERY_SCROLL_POSITION_KEY,
    );

    if (!savedScrollPosition) {
      return;
    }

    window.scrollTo({ top: Number(savedScrollPosition), left: 0 });
    window.sessionStorage.removeItem(GALLERY_SCROLL_POSITION_KEY);
  }, [location.key, location.state]);

  // Filter tricks by category and search query (title, category, technologies tag, description keywords)
  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return tricks.filter((trick) => {
      // Category filter match
      if (filter !== "All" && trick.category !== filter) {
        return false;
      }

      if (!query) {
        return true;
      }

      // 1. Title match
      if (trick.title.toLowerCase().includes(query)) {
        return true;
      }

      // 2. Category match
      if (trick.category.toLowerCase().includes(query)) {
        return true;
      }
      if (query === "javascript" && trick.category === "JS") {
        return true;
      }

      // 3. Technologies tag match
      if (
        trick.technologies.some((tech) => tech.toLowerCase().includes(query))
      ) {
        return true;
      }

      // 4. Description keywords match
      if (trick.description.toLowerCase().includes(query)) {
        return true;
      }

      // 5. KeyPoint explanation keywords match
      if (trick.keyPoint?.explanation?.toLowerCase().includes(query)) {
        return true;
      }

      return false;
    });
  }, [filter, searchQuery]);

  return (
    <main>
      {/* Hero Section with Search & Category Filters */}
      <section className="flex flex-col items-center gap-6 px-4 pt-10 pb-10 sm:px-6 sm:pt-14 sm:pb-12 lg:px-20 lg:pt-16 lg:pb-14">
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="m-0 font-display text-3xl font-black tracking-[-1px] text-text-primary sm:text-4xl lg:text-5xl lg:tracking-[-2px]">
            Tiny tricks, big impact.
          </h1>
          <p className="m-0 max-w-[600px] font-body text-base leading-relaxed text-text-secondary sm:text-lg">
            A collection of CSS, JS/TS &amp; React snippets.
          </p>
        </div>

        {/* Search Input Box & Controls */}
        <div className="w-full max-w-xl flex flex-col gap-4">
          <div className="relative flex items-center w-full">
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, category, technologies, or keywords..."
              aria-label="Search tricks"
              className="w-full rounded-2xl border border-border bg-card py-3.5 pl-11 pr-12 font-body text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-all focus:border-text-primary focus:ring-1 focus:ring-text-primary"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  inputRef.current?.focus();
                }}
                aria-label="Clear search"
                className="absolute right-3.5 flex items-center justify-center h-7 w-7 rounded-full bg-page border border-border text-text-secondary hover:text-text-primary transition-colors text-xs font-semibold cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setFilter(cat.value)}
                className={`font-body text-xs sm:text-sm font-medium cursor-pointer rounded-full px-4 py-1.5 transition-all border ${
                  filter === cat.value
                    ? "bg-text-primary text-text-inverted border-text-primary shadow-sm"
                    : "bg-card text-text-secondary border-border hover:text-text-primary hover:border-text-secondary"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid Section */}
      <section className="flex flex-col gap-6 px-4 pb-12 sm:px-6 sm:pb-16 lg:px-20 lg:pb-20">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="m-0 font-display text-xl font-extrabold tracking-tight text-text-primary sm:text-2xl">
              {filter === "All" ? "Browse Tricks" : filter}
            </h2>
            {searchQuery && (
              <span className="font-body text-xs bg-card border border-border text-text-secondary px-3 py-1 rounded-full flex items-center gap-1.5">
                Matching &quot;{searchQuery}&quot;
                <button
                  onClick={() => setSearchQuery("")}
                  className="hover:text-text-primary cursor-pointer font-bold ml-0.5"
                  aria-label="Clear search query filter"
                >
                  ✕
                </button>
              </span>
            )}
          </div>
          <span className="font-body text-sm text-text-tertiary">
            {filtered.length} {filtered.length === 1 ? "trick" : "tricks"}
          </span>
        </div>

        {/* Tricks Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 xl:gap-6">
          {filtered.map((trick) => (
            <TrickCard key={trick.id} trick={trick} />
          ))}
        </div>

        {/* Empty Search / Filter State */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center border border-dashed border-border rounded-2xl bg-card/40 px-4">
            <h3 className="m-0 font-display text-lg font-bold text-text-primary">
              No matching tricks found
            </h3>
            <p className="m-0 max-w-md font-body text-sm text-text-secondary">
              No tricks match &quot;{searchQuery}&quot;
              {filter !== "All" ? ` in category "${filter}"` : ""}. Try
              searching for title, category, technologies, or keywords.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setFilter("All");
              }}
              className="mt-2 font-body text-xs font-semibold text-text-primary bg-page border border-border px-4 py-2 rounded-xl hover:bg-card transition-colors cursor-pointer"
            >
              Clear search &amp; filters
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

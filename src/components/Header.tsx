import { Link } from "react-router";
import GithubIcon from "./GithubIcon";

export default function Header() {
  return (
    <header className="flex items-center justify-between border-b border-border px-4 py-4 sm:px-6 lg:px-20 lg:py-5">
      <Link
        to="/"
        aria-label="Web Tricks - Back to all tricks"
        className="flex items-center gap-3 no-underline"
      >
        <img
          src="/favicon.svg"
          alt="Web Tricks Logo"
          className="h-8 w-8 shrink-0 rounded-lg object-contain"
        />
        <span className="font-display text-xl font-extrabold tracking-tight text-text-primary">
          Web Tricks
        </span>
      </Link>

      <a
        href="https://github.com/jinyongnan810/web-tricks"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub repository"
        className="shrink-0 text-text-primary transition-colors hover:text-text-secondary"
      >
        <GithubIcon size={20} />
      </a>
    </header>
  );
}

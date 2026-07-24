# Web Tricks

This folder contains a React app that showcases small, practical web development tricks in a clean gallery format.
Deployed on: https://web-tricks.vercel.app

## What this folder does

- Displays a gallery of bite-sized CSS, JavaScript, and React demos.
- Lets users filter demos by category on the home page.
- Opens each demo on a dedicated detail route with:
  - a live interactive example
  - a short explanation
  - a link to the source file on GitHub
- Uses lazy-loading for demo components so pages load faster.

## Core tech used in this project

- React 19
- React Router 7
- TypeScript 5
- Vite 8
- Tailwind CSS 4
- ESLint 9 + `typescript-eslint` + React Hooks/Refresh plugins
- Prettier
- Fontsource (`@fontsource/inter`, `@fontsource/outfit`)
- Icon libraries (`lucide-react`, `simple-icons`)
- `iframe`-based embedding for migrated legacy demos served from `public/legacy-tricks`

## Scripts

- `pnpm dev` - start local development server
- `pnpm build` - type-check build and generate production bundle
- `pnpm preview` - preview production build locally
- `pnpm lint` - run lint checks
- `pnpm typecheck` - run TypeScript checks
- `pnpm format` - format project files
- `pnpm test:e2e` - run all Playwright end-to-end tests
- `pnpm test:e2e:specs` - run hand-written Playwright specs from `e2e/specs`
- `pnpm test:e2e:md` - run Markdown-authored Playwright scenarios from `e2e/markdown`
- `pnpm test:e2e:mcp` - start the app and execute pure natural-language scenarios through `codex exec` with Playwright MCP
- `pnpm test:e2e:mcp:prompt` - print the generated MCP prompt without executing it
- `pnpm test:e2e:ui` - open the Playwright UI runner

## E2E testing

The E2E suite is split by test style:

- `e2e/specs` - hand-written Playwright specs
- `e2e/markdown` - Markdown scenarios and their Playwright runner
- `e2e/mcp` - pure natural-language scenarios for Playwright MCP execution

This project now includes Playwright E2E coverage for:

- gallery filtering and navigation into trick detail pages
- invalid trick routes
- `useLocalStorage` persistence across reloads
- IME composition behavior in the composition search demo
- automatic screenshots captured for each Playwright test run and attached to the HTML report

Install the Playwright test runner and browser once:

- `pnpm install`
- `pnpm exec playwright install chromium`

## Markdown-driven scenarios

You can also author executable browser scenarios in Markdown at [e2e/markdown/scenarios.md](e2e/markdown/scenarios.md).

Current supported step patterns are:

- `Visit \`/path\``
- `Click button \`...\``or`Click link \`...\``
- `Fill textbox \`...\` with \`...\``
- `Expect heading|text|link|button|textbox \`...\``
- `Expect no link \`...\``
- `Expect label \`...\` equals \`...\``
- `Reload page`
- `Take screenshot \`name\``

Those Markdown steps are executed by [e2e/markdown/markdown.spec.ts](e2e/markdown/markdown.spec.ts) and [e2e/markdown/runner.ts](e2e/markdown/runner.ts), which keeps them inside the normal Playwright runner and report flow.

## MCP natural-language scenarios

For a looser, agent-driven workflow, author pure natural-language scenarios in
[e2e/mcp/scenarios.md](e2e/mcp/scenarios.md).

This method is intended for a Codex or ChatGPT session that has Playwright MCP
available. It is not executed directly by the Playwright test runner.

To execute the scenarios end to end:

- `pnpm test:e2e:mcp`

That command:

- starts the local Vite app on `127.0.0.1:4173`
- builds an MCP instruction prompt from `e2e/mcp/scenarios.md`
- invokes `codex exec` non-interactively
- expects the configured Playwright MCP server to execute the scenarios
- writes screenshots to `test-results/mcp/` using descriptive numbered filenames chosen by the agent
- writes the final agent summary to `test-results/mcp/summary.md`
- writes the full run transcript to `test-results/mcp/transcript.log`
- fails the run if `summary.md` is missing or empty

If you only want to inspect the generated prompt, use:

- `pnpm test:e2e:mcp:prompt`

Supporting scripts:

- [scripts/run-mcp-e2e.mjs](scripts/run-mcp-e2e.mjs)
- [scripts/generate-mcp-e2e-prompt.mjs](scripts/generate-mcp-e2e-prompt.mjs)
- [scripts/mcp-e2e-lib.mjs](scripts/mcp-e2e-lib.mjs)

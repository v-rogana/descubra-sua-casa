# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Qual Casa" is a single-page React app for a psychology teaching lab ("Casas da Allos"). It features a personality quiz that sorts users into one of three "houses" (Prisma, Macondo, Marmoris), each representing a different clinical psychology sensibility. After the quiz, users can explore a "Universo Cultural" section with curated cultural content for each house.

The app is in Portuguese (Brazilian).

## Commands

- `npm run dev` — Start Vite dev server with HMR
- `npm run build` — Production build to `dist/`
- `npm run preview` — Preview production build locally
- `npm run lint` — Run ESLint
- `npm run deploy` — Build and deploy to GitHub Pages via `gh-pages`

## Architecture

This is a minimal single-file React app — almost all logic lives in `src/App.jsx`:

- **Data constants** (`HOUSES`, `QUIZ_QUESTIONS`, `CULTURAL_UNIVERSE`): house definitions (colors, manifesto, values), quiz questions with scoring, and curated cultural content (books, films, music, etc.)
- **Components**: All defined inline in App.jsx — `LandingPage`, `QuizSection`, `QuizResult`, `CulturalUniverse`, `HouseCard`, `MediaCard`, etc.
- **State machine**: The app uses a `section` state (`"landing"` | `"quiz"` | `"result"` | `"cultural"`) to navigate between views
- **Styling**: All CSS is inline via JavaScript style objects — no separate CSS files

## Deployment

Deployed to GitHub Pages at the path `/descubra-sua-casa/` (configured in `vite.config.js` via `base`). The `homepage` in `package.json` points to `https://v-rogana.github.io/descubra-sua-casa`.

## ESLint

Custom rule: `no-unused-vars` ignores variables starting with uppercase or underscore (`varsIgnorePattern: '^[A-Z_]'`).

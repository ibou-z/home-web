# Liquid Glass Dashboard

A futuristic, highly polished personal desktop dashboard and application launcher built with genuine optical Liquid Glass design aesthetics.

Built with React 19, TypeScript, Tailwind CSS, and Vite. Designed to run smoothly at 60 FPS in modern desktop browsers across all platforms.

---

## ✨ Features

- **Optical Liquid Glass Floating Clock**:
  - Floating typography rendered directly over the animated ambient gradient background (no surrounding cards or panels).
  - Physical optical glass translucency, subtle micro-bevel edge contours, and natural Fresnel refraction.
  - 100% accurate custom color rendering without unwanted white patches or tint clashing.
  - Triple-mode color controls: Full-Spectrum Picker, Custom HEX input, and Discrete R/G/B (0-255) channel inputs.
  - Fully independent controls for Main Glass, Specular Highlights, Optical Reflections, and Outer Glow/Caustics.
  - Master toggles to enable or disable highlights, reflections, and glow independently.
  - 8 curated crystalline glass presets + custom color designer.
  - Adjustable font weights, proportions, digit tracking, blur, and animations (12h/24h toggle, seconds toggle).

- **Customisable Animated Ambient Glow**:
  - Multi-stop fluid ambient gradient animation.
  - Ambient presets: *Northern Aurora*, *Cyber Neon*, *Cosmic Violet*, *Electric Ocean*, *Pink Twilight*, *Midnight Obsidian*.
  - Full custom 4-color gradient designer with adjustable intensity and animation speed.

- **Modular Liquid Glass Sidebar Dock**:
  - Dockable to either the **Left** or **Right** screen edge with smooth transitions.
  - Seamlessly collapsible into a compact 56px icon dock strip or expandable to the full 336px modular panel.
  - State persistence in browser `localStorage`.
  - **Overview**: At-a-glance weather, notes preview, pending to-dos, and recently launched apps.
  - **Web Shortcuts (Full CRUD)**: Pre-configured shortcuts, plus add, edit, delete, and reorder favourite websites.
  - **Quick Notes Scratchpad**: Auto-saving text area with word/character counter and one-click copy.
  - **Interactive To-Do List**: Task management with completion toggles and counts.
  - **Interactive Mini Calendar**: Month/year view with navigation and today quick jump.
  - **Live Weather Widget**: Dynamic weather status with editable city and °C / °F toggle.

- **Rearrangeable Application Dock & Launcher**:
  - 10 productivity apps: YouTube, 7reels, Glow RRMumify, Google Classroom, Microsoft Teams, Google, Microsoft Copilot, ChatGPT, Claude, Humanize AI.
  - Drag-and-drop layout rearrangement with live state persistence.
  - Add custom apps (with custom URLs, titles, categories, icons, and accent colors).
  - Edit or remove any app shortcut at any time.

- **Quick Search Launcher**:
  - Fast search overlay triggered via `Ctrl+K`, `⌘K`, or `/` with instant keyword filtering and keyboard arrow navigation.

- **Privacy & Performance**:
  - Zero server requirements; all settings, custom apps, and preferences persist locally in browser `localStorage`.
  - One-click factory reset and layout restoration.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm, pnpm, or yarn

### Installation

1. Clone this repository or download and extract the ZIP:
   ```bash
   git clone https://github.com/YOUR_USERNAME/liquid-glass-dashboard.git
   cd liquid-glass-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. Build for production:
   ```bash
   npm run build
   ```
   The compiled static website will be in the `dist` directory, ready to deploy to any static hosting provider (Vercel, Netlify, Cloudflare Pages, GitHub Pages).

---

## 🛠️ Tech Stack

- **Framework**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Build Tool**: Vite

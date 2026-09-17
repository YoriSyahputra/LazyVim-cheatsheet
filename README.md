# LazyVim-Cheetsheat<div align="center">

  <img src="views/assets/icon.svg" alt="LazyVim Cheatsheet Logo" width="120" height="120" />

# LazyVim Cheatsheet

### Interactive desktop reference and keymap companion for LazyVim.

Built with Electron, Tokyo Night theme, and JetBrains Mono typography.

[![Release](https://img.shields.io/github/v/release/YoriSyahputra/LazyVim-Cheatsheet?style=flat-square&color=7aa2f7&logo=github)](https://github.com/YoriSyahputra/LazyVim-Cheatsheet/releases)
[![Platform](https://img.shields.io/badge/Platform-Linux%20%7C%20AppImage-7dcfff?style=flat-square&logo=linux&logoColor=white)](https://github.com/YoriSyahputra/LazyVim-Cheatsheet/releases)
[![License](https://img.shields.io/badge/License-MIT-9ece6a?style=flat-square)](LICENSE)
[![Tokyo Night](https://img.shields.io/badge/Theme-Tokyo%20Night-bb9af7?style=flat-square)](https://github.com/folke/tokyonight.nvim)

  <br />

[Overview](#overview) •
[Features](#features) •
[Installation](#installation) •
[Usage](#usage) •
[Project Architecture](#project-architecture) •
[Development](#development) •
[Contributing](#contributing) •
[License](#license)

</div>

---

## Overview

LazyVim Cheatsheet is a standalone, lightweight Linux desktop application designed for fast keymap reference. It packages 112+ curated default keymaps across editing, LSP code intelligence, Neo-tree operations, Telescope fuzzy finders, buffer/window management, and Git tooling into a responsive, single-binary application.

The binary runs across all major Linux distributions out-of-the-box via AppImage without requiring a background web server or runtime configuration.

---

## Features

- **Tokyo Night Color Palette:** Complete visual alignment with the Tokyo Night theme and JetBrains Mono typography.
- **Multi-Field Fuzzy Search:** Real-time query matching across shortcut chords (`<leader>`, `<C-s>`), modes (`Normal`, `Visual`), action titles, and technical descriptions with dynamic substring highlights.
- **Keyboard Hotkeys:** Focus search immediately with `/` or `Ctrl+K` / `Cmd+K`.
- **Multi-Language Support (i18n):** Client-side dictionary switching across 9 languages with `localStorage` state persistence:
  - English (`en`)
  - Indonesian (`id`)
  - Spanish (`es`)
  - German (`de`)
  - Chinese Simplified (`zh-CN`)
  - Chinese Traditional (`zh-HK`)
  - Japanese (`ja`)
  - Korean (`ko`)
  - Russian (`ru`)
- **Desktop & CLI Integration:** Standard `.desktop` desktop entry and shell symlinks (`lazyvim-cs` and `nvim-cs`).

---

## Installation

### Automated Installer (Recommended)

Run this one-line command to download the latest AppImage, configure executable permissions, register PATH symlinks, and install the `.desktop` launcher:

```bash
curl -sSL [https://raw.githubusercontent.com/YoriSyahputra/LazyVim-Cheatsheet/main/scripts/install.sh](https://raw.githubusercontent.com/YoriSyahputra/LazyVim-Cheatsheet/main/scripts/install.sh) | bash
```

### Manual Download

If you prefer to manage binaries manually without running the install script:

1. Download the latest `.AppImage` file from the [Releases Page](https://github.com/YoriSyahputra/LazyVim-Cheatsheet/releases).
2. Move the file to your preferred application directory (e.g., `~/Applications` or `~/.local/bin`):
   ```bash
   mkdir -p ~/Applications
   mv ~/Downloads/LazyVim-Cheatsheet-*.AppImage ~/Applications/LazyVim-Cheatsheet.AppImage
   ```
3. Grant execute permission:
   ```bash
   chmod +x ~/Applications/LazyVim-Cheatsheet.AppImage
   ```
4. Run the application:
   ```bash
   ~/Applications/LazyVim-Cheatsheet.AppImage
   ```
5. _(Optional)_ Create a terminal symlink to run it with a short command:
   ```bash
   sudo ln -sf "$HOME/Applications/LazyVim-Cheatsheet.AppImage" /usr/local/bin/lazyvim-cs
   sudo ln -sf "$HOME/Applications/LazyVim-Cheatsheet.AppImage" /usr/local/bin/nvim-cs
   ```

---

## Usage

### Launch Options

Run via terminal command:

```bash
lazyvim-cs
# or
nvim-cs
```

Or search for **LazyVim Cheatsheet** in your desktop application launcher (GNOME Shell, KDE Plasma, Rofi, Wofi, etc.).

### Navigation Shortcuts

| Key               | Action                                                    |
| :---------------- | :-------------------------------------------------------- |
| `/` or `Ctrl + K` | Focus the global search bar                               |
| `Esc`             | Clear search input / Return to active category view       |
| `Click Tabs`      | Filter by category (Editing, Navigation, Telescope, etc.) |

---

## Project Architecture

```text
LazyVim-Cheatsheet/
├── .github/
│   └── workflows/
│       └── release.yml          # CI/CD: Compiles & publishes AppImage on tag push
├── assets/
│   └── icon.svg                 # Vector source asset
├── views/
│   ├── assets/
│   │   └── icon.png             # 512x512 raster application icon
│   ├── css/
│   │   └── style.css            # Stylesheet, Tokyo Night CSS variables, layout
│   ├── js/
│   │   ├── app.js               # Main orchestration, tab navigation, and event loop
│   │   ├── data.js              # 112+ keymap datasets and translation dictionaries
│   │   ├── i18n.js              # Localization state engine and storage sync
│   │   └── search.js            # Fuzzy matching and substring highlighting logic
│   └── index.html               # Main application layout
├── scripts/
│   └── install.sh               # POSIX installer script
├── main.js                      # Electron process lifecycle and window runner
├── package.json                 # Project dependencies and electron-builder configuration
└── .gitignore
```

---

## Development

Prerequisites: Node.js (v18+) and npm.

```bash
# Clone the repository
git clone [https://github.com/YoriSyahputra/LazyVim-Cheatsheet.git](https://github.com/YoriSyahputra/LazyVim-Cheatsheet.git)
cd LazyVim-Cheatsheet

# Install dependencies
npm install

# Run application in development mode
npm start

# Build Linux AppImage locally
npm run build:linux
```

Build outputs will be generated in the `dist/` directory.

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/keymap-update`
3. Commit your changes: `git commit -m 'feat: update telescope keymaps'`
4. Push to branch: `git push origin feat/keymap-update`
5. Open a Pull Request

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

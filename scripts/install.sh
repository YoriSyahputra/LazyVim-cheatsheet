#!/usr/bin/env bash
set -e

REPO="YoriSyahputra/LazyVim-Cheatsheet"
INSTALL_DIR="/opt/lazyvim-cheatsheet"
BIN_LINK="/usr/local/bin/lazyvim-cs"
NVIM_CS_LINK="/usr/local/bin/nvim-cs"
DESKTOP_DIR="/usr/share/applications"
ICON_DIR="/usr/share/icons/hicolor/512x512/apps"

echo "==> Fetching latest release..."
LATEST_URL=$(curl -s "https://api.github.com/repos/$REPO/releases/latest" |
  grep "browser_download_url.*AppImage" |
  cut -d '"' -f 4)

if [ -z "$LATEST_URL" ]; then
  echo "Error: No published AppImage release found on GitHub."
  exit 1
fi

echo "==> Creating installation directories..."
sudo mkdir -p "$INSTALL_DIR"
sudo mkdir -p "$ICON_DIR"
sudo mkdir -p "$DESKTOP_DIR"

echo "==> Downloading and installing AppImage..."
sudo curl -L "$LATEST_URL" -o "$INSTALL_DIR/lazyvim-cheatsheet.AppImage"
sudo chmod +x "$INSTALL_DIR/lazyvim-cheatsheet.AppImage"

# Create symlinks in PATH
echo "==> Creating CLI symlinks (/usr/local/bin)..."
sudo ln -sf "$INSTALL_DIR/lazyvim-cheatsheet.AppImage" "$BIN_LINK"
sudo ln -sf "$INSTALL_DIR/lazyvim-cheatsheet.AppImage" "$NVIM_CS_LINK"

echo "==> Registering Desktop launcher and icon..."
curl -sL "https://raw.githubusercontent.com/$REPO/main/views/assets/icon.png" | sudo tee "$ICON_DIR/lazyvim-cs.png" >/dev/null

cat <<'EOF' | sudo tee "$DESKTOP_DIR/lazyvim-cheatsheet.desktop" >/dev/null
[Desktop Entry]
Name=LazyVim Cheatsheet
Comment=Interactive LazyVim Cheatsheet Desktop Application
Exec=lazyvim-cs %U
Icon=lazyvim-cs
Terminal=false
Type=Application
Categories=Development;Utility;TextEditor;
StartupWMClass=LazyVim Cheatsheet
EOF

# Update desktop application database if available
if command -v update-desktop-database >/dev/null; then
  sudo update-desktop-database
fi

echo "==> Done! You can now launch the application via:"
echo "    - Terminal: 'lazyvim-cs' or 'nvim-cs'"
echo "    - Desktop Menu: Search for 'LazyVim Cheatsheet'"

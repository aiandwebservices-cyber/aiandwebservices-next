# Colony Desktop

Tauri v2 wrapper around the Colony web app at `https://colony.aiandwebservices.com`.

## Prerequisites

- [Node.js](https://nodejs.org) 20+
- [Rust](https://rustup.rs) stable (`rustup toolchain install stable`)
- **macOS:** Xcode command-line tools (`xcode-select --install`)
- **Linux (Ubuntu/Debian):**
  ```bash
  sudo apt-get install -y libwebkit2gtk-4.1-dev libappindicator3-dev librsvg2-dev patchelf libssl-dev pkg-config
  ```
- **Windows:** Microsoft C++ Build Tools (via Visual Studio Installer)

## Development

```bash
cd desktop
npm install
npm run tauri:dev
```

This opens a native window loading `https://colony.aiandwebservices.com/colony`. The Rust backend recompiles on save; the webview reflects the live Vercel deployment.

## Building

```bash
cd desktop
npm install
npm run tauri:build
```

Artifacts land in `desktop/src-tauri/target/release/bundle/`.

## Icons

To regenerate icons from the source PNG:

```bash
cd desktop
npx tauri icon ../public/colony-icon-512.png
```

Output goes to `src-tauri/icons/`.

## Release

Releases are automated via `.github/workflows/release-desktop.yml`. Push a tag matching `desktop-v*` to trigger a multi-platform build (macOS, Linux, Windows) and draft a GitHub Release:

```bash
git tag desktop-v0.1.0
git push origin desktop-v0.1.0
```

### Signing (auto-updater)

The updater requires a signing key pair. Generate one and store in GitHub Secrets:

```bash
# Generate key pair (run once)
npx tauri signer generate -w ~/.tauri/colony.key

# Add to GitHub repo secrets:
#   TAURI_SIGNING_PRIVATE_KEY   → contents of colony.key
#   TAURI_SIGNING_PRIVATE_KEY_PASSWORD → passphrase used above
```

The public key must match `pubkey` in `src-tauri/tauri.conf.json` under `plugins.updater`.

## Deep-link auth

Colony Desktop registers the `colony://` scheme. After signing in via the web, the browser redirects to `colony://auth?token=<clerk_jwt>`, which the app intercepts and injects into the webview session.

The callback page lives at `https://colony.aiandwebservices.com/desktop/auth-callback`.

## Architecture

```
desktop/
├── package.json          # Tauri CLI wrapper
└── src-tauri/
    ├── tauri.conf.json   # App metadata, window config, updater, deep-link
    ├── Cargo.toml        # Rust dependencies
    ├── build.rs          # tauri-build
    ├── capabilities/
    │   └── default.json  # Tauri 2 permission grants
    └── src/
        ├── main.rs       # Entry point, plugin registration
        ├── menu.rs       # Native menu bar
        ├── tray.rs       # System tray icon + menu
        ├── notifications.rs  # 60 s poll loop → native notifications
        └── auth.rs       # deep-link colony://auth handler
```

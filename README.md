# Sprite Locker

Fortnite Sprite collection tracker PWA. Scan your TV with your phone camera, tick off variants manually, and compare collections with a trade partner. Same architecture as PokéTracker / MTGTracker / BarbieTracker: React + Vite, IndexedDB, no backend, no accounts.

## Run

```bash
npm install
npm run dev      # local dev
npm run build    # production build -> dist/
```

## Deploy (Cloudflare Pages)

Push to GitHub, connect the repo in Pages. Build command `npm run build`, output directory `dist`. Nothing else needed — the app is fully static.

## Features

- **Locker** — every sprite grouped with its variant chips. Tap a chip to toggle owned. Collected chips glow in rarity color; missing ones stay as dark silhouettes (mirrors the in-game locker). Filters for owned/missing, rarity, and search. Unreleased entries (Storm Scout) show dashed and can't be toggled until you flip their flag in the dataset.
- **Scan** — photograph your Sprite collection screen. Drag 4 handles onto the grid corners, set visible rows × columns, and the app perspective-warps the photo flat, slices tiles, and classifies each by color saturation/brightness (collected = colorful, missing = grey silhouette). You review everything — adjustable sensitivity, tap to flip a tile, per-tile sprite reassignment — before it adds anything. Scanning only ever adds, never removes.
- **Trade** — your whole collection compresses to a ~38-char share code (`SPR1|<dataset version>|<bitfield>`). Paste a friend's code to get "You can get" / "You can give" lists — the trade matches — plus a count of sprites you're both hunting. Codes also double as device-to-device transfer via "Merge this code into my locker".

## Updating for game patches

Everything lives in `src/data/sprites.js`:

1. Add new sprites at the end of `SPRITES`, or flip `u: true` off a variant when it releases.
2. Never reorder existing entries within a version — entry order is the share-code bit layout.
3. Bump `DATASET_VERSION`. Codes from older versions still decode; the app just warns about the mismatch.

Current dataset: 2026-08-24 — Chapter 7 Season 4 "Override". 11 released sprites, 33 released entries (Rare 12 / Epic 12 / Legendary 3 / Mythic 6), plus Storm Scout (Rare) pre-staged as unreleased. Sprites now have three variants — Normal, Gold, Cheat Master — instead of the old 8-variant lineup, and drop into Cheat Code Chests (via Cheat Code Injectors) instead of Sprite Chests. No sprite images are bundled yet for this season — drop new `.webp` files into `public/sprites/` named `{spriteId}-{variantId}.webp` (e.g. `sonic-gold.webp`); until then entries fall back to an emoji glyph.

## Scan tips

- Fill the frame with the grid, as square-on as possible.
- Kill lamps reflecting off the TV; glare washes out the saturation signal.
- If a page shows partial rows, set rows/cols to what's actually visible and use "First tile in this shot is" to offset.

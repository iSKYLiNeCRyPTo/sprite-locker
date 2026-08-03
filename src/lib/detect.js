// Slice the warped grid into tiles and classify each as collected (colorful,
// glowing icon) vs missing (dim grey silhouette). Works on color statistics
// only — robust to TV glare and moiré, no model download needed.

export const TILE_PX = 96;

/** Slice a warped canvas (cols*TILE_PX x rows*TILE_PX) into tile canvases. */
export function sliceTiles(warpedCanvas, rows, cols) {
  const tiles = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const t = document.createElement("canvas");
      t.width = TILE_PX;
      t.height = TILE_PX;
      t.getContext("2d").drawImage(
        warpedCanvas,
        c * TILE_PX, r * TILE_PX, TILE_PX, TILE_PX,
        0, 0, TILE_PX, TILE_PX
      );
      tiles.push(t);
    }
  }
  return tiles;
}

/**
 * Score a tile 0..1. Higher = more likely collected.
 * Uses mean saturation + brightness of the central region (edges hold the
 * tile frame/rarity border, so we skip them).
 */
export function scoreTile(tileCanvas) {
  const ctx = tileCanvas.getContext("2d");
  const m = Math.round(TILE_PX * 0.2); // 20% margin
  const size = TILE_PX - m * 2;
  const data = ctx.getImageData(m, m, size, size).data;
  let satSum = 0;
  let valSum = 0;
  const n = data.length / 4;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    valSum += max / 255;
    satSum += max === 0 ? 0 : (max - min) / max;
  }
  const sat = satSum / n;
  const val = valSum / n;
  // Silhouettes: low saturation, low-mid brightness. Collected: colorful and lit.
  return Math.min(1, sat * 1.6 * 0.7 + val * 0.3);
}

export const DEFAULT_THRESHOLD = 0.3;

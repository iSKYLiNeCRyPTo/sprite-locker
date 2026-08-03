// Perspective correction for TV/monitor phone photos.
// Maps the tapped quad (TL, TR, BR, BL in source-image pixels) onto a flat
// output canvas via a homography, sampled with bilinear interpolation.

function solve8(A, b) {
  // Gaussian elimination with partial pivoting on an 8x8 system.
  const n = 8;
  const M = A.map((row, i) => [...row, b[i]]);
  for (let col = 0; col < n; col++) {
    let pivot = col;
    for (let r = col + 1; r < n; r++) {
      if (Math.abs(M[r][col]) > Math.abs(M[pivot][col])) pivot = r;
    }
    if (Math.abs(M[pivot][col]) < 1e-12) throw new Error("Degenerate quad");
    [M[col], M[pivot]] = [M[pivot], M[col]];
    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const f = M[r][col] / M[col][col];
      for (let c = col; c <= n; c++) M[r][c] -= f * M[col][c];
    }
  }
  return M.map((row, i) => row[n] / row[i]);
}

// Homography h mapping (x,y) -> (X,Y) given 4 correspondences.
export function homography(src, dst) {
  const A = [];
  const b = [];
  for (let i = 0; i < 4; i++) {
    const [x, y] = src[i];
    const [X, Y] = dst[i];
    A.push([x, y, 1, 0, 0, 0, -x * X, -y * X]);
    b.push(X);
    A.push([0, 0, 0, x, y, 1, -x * Y, -y * Y]);
    b.push(Y);
  }
  return solve8(A, b); // [h0..h7], h8 = 1
}

export function applyH(h, x, y) {
  const w = h[6] * x + h[7] * y + 1;
  return [(h[0] * x + h[1] * y + h[2]) / w, (h[3] * x + h[4] * y + h[5]) / w];
}

/**
 * Warp the quad `corners` ([[x,y] TL, TR, BR, BL]) from sourceCanvas into a
 * new canvas of outW x outH.
 */
export function warpQuad(sourceCanvas, corners, outW, outH) {
  const dstCorners = [
    [0, 0],
    [outW, 0],
    [outW, outH],
    [0, outH],
  ];
  // We need dest -> source to inverse-sample, so solve dst->src.
  const h = homography(dstCorners, corners);

  const srcCtx = sourceCanvas.getContext("2d");
  const srcData = srcCtx.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);
  const sw = srcData.width;
  const sh = srcData.height;
  const sp = srcData.data;

  const out = document.createElement("canvas");
  out.width = outW;
  out.height = outH;
  const outCtx = out.getContext("2d");
  const outData = outCtx.createImageData(outW, outH);
  const op = outData.data;

  for (let y = 0; y < outH; y++) {
    for (let x = 0; x < outW; x++) {
      const w = h[6] * x + h[7] * y + 1;
      const sx = (h[0] * x + h[1] * y + h[2]) / w;
      const sy = (h[3] * x + h[4] * y + h[5]) / w;
      const o = (y * outW + x) * 4;
      if (sx < 0 || sy < 0 || sx >= sw - 1 || sy >= sh - 1) {
        op[o + 3] = 255;
        continue;
      }
      const x0 = Math.floor(sx);
      const y0 = Math.floor(sy);
      const fx = sx - x0;
      const fy = sy - y0;
      const i00 = (y0 * sw + x0) * 4;
      const i10 = i00 + 4;
      const i01 = i00 + sw * 4;
      const i11 = i01 + 4;
      for (let c = 0; c < 3; c++) {
        op[o + c] =
          sp[i00 + c] * (1 - fx) * (1 - fy) +
          sp[i10 + c] * fx * (1 - fy) +
          sp[i01 + c] * (1 - fx) * fy +
          sp[i11 + c] * fx * fy;
      }
      op[o + 3] = 255;
    }
  }
  outCtx.putImageData(outData, 0, 0);
  return out;
}

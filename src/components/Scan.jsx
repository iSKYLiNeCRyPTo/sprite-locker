import { useEffect, useRef, useState } from "react";
import { warpQuad } from "../lib/warp.js";
import { sliceTiles, scoreTile, TILE_PX, DEFAULT_THRESHOLD } from "../lib/detect.js";
import { RELEASED_ENTRIES } from "../data/sprites.js";

const MAX_SIDE = 1600;
const HANDLE_R = 26;
const LABELS = ["TL", "TR", "BR", "BL"];

export default function Scan({ owned, addMany, showToast }) {
  const [step, setStep] = useState("capture"); // capture | corners | review
  const [imgCanvas, setImgCanvas] = useState(null);
  const [corners, setCorners] = useState(null);
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(6);
  const [tiles, setTiles] = useState([]);
  const [threshold, setThreshold] = useState(DEFAULT_THRESHOLD);
  const [overrides, setOverrides] = useState({});
  const [startIdx, setStartIdx] = useState(0);
  const [assigned, setAssigned] = useState([]);

  const stageRef = useRef(null);
  const dragRef = useRef(-1);

  /* ---------- capture ---------- */
  function onFile(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, MAX_SIDE / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * scale);
      c.height = Math.round(img.height * scale);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      const inX = c.width * 0.12;
      const inY = c.height * 0.12;
      setImgCanvas(c);
      setCorners([
        [inX, inY],
        [c.width - inX, inY],
        [c.width - inX, c.height - inY],
        [inX, c.height - inY],
      ]);
      setStep("corners");
    };
    img.onerror = () => showToast("Couldn't read that photo");
    img.src = url;
    e.target.value = "";
  }

  /* ---------- corner stage ---------- */
  useEffect(() => {
    if (step !== "corners" || !imgCanvas || !corners) return;
    const canvas = stageRef.current;
    if (!canvas) return;
    canvas.width = imgCanvas.width;
    canvas.height = imgCanvas.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(imgCanvas, 0, 0);

    ctx.strokeStyle = "#f2c14e";
    ctx.lineWidth = Math.max(2, canvas.width / 400);
    ctx.beginPath();
    corners.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
    ctx.closePath();
    ctx.stroke();

    corners.forEach(([x, y], i) => {
      ctx.fillStyle = "rgba(242,193,78,0.9)";
      ctx.beginPath();
      ctx.arc(x, y, HANDLE_R, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#0b1020";
      ctx.font = `bold ${HANDLE_R}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(LABELS[i], x, y + 2);
    });
  }, [step, imgCanvas, corners]);

  function stagePoint(e) {
    const canvas = stageRef.current;
    const rect = canvas.getBoundingClientRect();
    const sx = canvas.width / rect.width;
    const sy = canvas.height / rect.height;
    return [(e.clientX - rect.left) * sx, (e.clientY - rect.top) * sy];
  }

  function onPointerDown(e) {
    const [x, y] = stagePoint(e);
    let best = -1;
    let bestD = HANDLE_R * 3;
    corners.forEach(([cx, cy], i) => {
      const d = Math.hypot(cx - x, cy - y);
      if (d < bestD) { bestD = d; best = i; }
    });
    dragRef.current = best;
    if (best >= 0) e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e) {
    if (dragRef.current < 0) return;
    const [x, y] = stagePoint(e);
    setCorners((prev) =>
      prev.map((p, i) =>
        i === dragRef.current
          ? [
              Math.max(0, Math.min(imgCanvas.width, x)),
              Math.max(0, Math.min(imgCanvas.height, y)),
            ]
          : p
      )
    );
  }

  function onPointerUp() { dragRef.current = -1; }

  /* ---------- warp + detect ---------- */
  function runDetect() {
    try {
      const warped = warpQuad(imgCanvas, corners, cols * TILE_PX, rows * TILE_PX);
      const tileCanvases = sliceTiles(warped, rows, cols);
      const next = tileCanvases.map((c) => ({
        dataUrl: c.toDataURL("image/jpeg", 0.7),
        score: scoreTile(c),
      }));
      setTiles(next);
      setOverrides({});
      setAssigned(defaultAssignments(next.length, startIdx));
      setStep("review");
    } catch {
      showToast("Corners look collapsed — spread them out");
    }
  }

  function defaultAssignments(count, start) {
    return Array.from({ length: count }, (_, i) => {
      const idx = start + i;
      return idx < RELEASED_ENTRIES.length ? RELEASED_ENTRIES[idx].id : "";
    });
  }

  function onStartChange(v) {
    const idx = Number(v);
    setStartIdx(idx);
    setAssigned(defaultAssignments(tiles.length, idx));
  }

  const isChecked = (i) =>
    overrides[i] !== undefined ? overrides[i] : tiles[i].score >= threshold;

  function apply() {
    const ids = tiles
      .map((_, i) => (isChecked(i) && assigned[i] ? assigned[i] : null))
      .filter(Boolean);
    const fresh = ids.filter((id) => !owned.has(id));
    addMany(ids);
    showToast(
      fresh.length
        ? `Extracted ${fresh.length} new sprite${fresh.length === 1 ? "" : "s"} to your locker`
        : "Nothing new — locker already had those"
    );
    setStep("capture");
    setImgCanvas(null);
    setTiles([]);
  }

  /* ---------- render ---------- */
  if (step === "capture") {
    return (
      <div>
        <div className="panel">
          <h2 className="display">Scan your screen</h2>
          <p className="hint">
            Open your Sprite collection in Fortnite, then photograph the grid
            with your phone. Fill the frame with the grid, square-on as much as
            you can, and avoid direct lamp glare on the TV. You'll fine-tune the
            corners next, so it doesn't need to be perfect.
          </p>
          <label className="btn block" style={{ textAlign: "center" }}>
            Take photo
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={onFile}
              style={{ display: "none" }}
            />
          </label>
          <div style={{ height: 8 }} />
          <label className="btn secondary block" style={{ textAlign: "center" }}>
            Choose from library
            <input type="file" accept="image/*" onChange={onFile} style={{ display: "none" }} />
          </label>
        </div>
        <div className="panel">
          <h2 className="display">How it reads the photo</h2>
          <p className="hint">
            Collected sprites glow in color; missing ones are dark silhouettes.
            The scanner flattens your photo, slices the grid, and checks each
            tile's color — you confirm everything before it touches your locker.
          </p>
        </div>
      </div>
    );
  }

  if (step === "corners") {
    return (
      <div>
        <div className="panel">
          <h2 className="display">Line up the grid</h2>
          <p className="hint">
            Drag the four gold handles onto the corners of the sprite grid on
            your screen (TL = top-left, going clockwise). Then set how many rows
            and columns are visible in this shot.
          </p>
        </div>
        <div
          className="corner-stage"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <canvas ref={stageRef} />
        </div>
        <div className="row wrap" style={{ marginBottom: 12 }}>
          <div>
            <span className="field-label">Rows</span>
            <div className="stepper">
              <button onClick={() => setRows((r) => Math.max(1, r - 1))} aria-label="Fewer rows">−</button>
              <span className="val">{rows}</span>
              <button onClick={() => setRows((r) => Math.min(10, r + 1))} aria-label="More rows">+</button>
            </div>
          </div>
          <div>
            <span className="field-label">Columns</span>
            <div className="stepper">
              <button onClick={() => setCols((c) => Math.max(1, c - 1))} aria-label="Fewer columns">−</button>
              <span className="val">{cols}</span>
              <button onClick={() => setCols((c) => Math.min(12, c + 1))} aria-label="More columns">+</button>
            </div>
          </div>
          <div className="spacer" />
        </div>
        <div className="row">
          <button className="btn secondary" onClick={() => { setStep("capture"); setImgCanvas(null); }}>
            Back
          </button>
          <button className="btn" style={{ flex: 1 }} onClick={runDetect}>
            Flatten & detect
          </button>
        </div>
      </div>
    );
  }

  // review
  const detectedCount = tiles.filter((_, i) => isChecked(i)).length;
  return (
    <div>
      <div className="panel">
        <h2 className="display">Check the results</h2>
        <p className="hint">
          Gold tiles will be marked as collected. Tap a tile to flip it, and use
          the dropdowns to fix which sprite a tile is. Scanning only ever adds —
          it never removes anything you've already marked.
        </p>
        <span className="field-label">First tile in this shot is</span>
        <select value={startIdx} onChange={(e) => onStartChange(e.target.value)}>
          {RELEASED_ENTRIES.map((e, i) => (
            <option key={e.id} value={i}>{e.label}</option>
          ))}
        </select>
        <div style={{ height: 10 }} />
        <span className="field-label">
          Detection sensitivity — {detectedCount}/{tiles.length} read as collected
        </span>
        <input
          type="range"
          min="0.05"
          max="0.7"
          step="0.01"
          value={threshold}
          onChange={(e) => { setThreshold(Number(e.target.value)); setOverrides({}); }}
        />
      </div>

      <div className="tile-grid" style={{ marginBottom: 12 }}>
        {tiles.map((t, i) => {
          const entry = RELEASED_ENTRIES.find((e) => e.id === assigned[i]);
          return (
            <div key={i} className={`tile ${isChecked(i) ? "detected" : ""}`}>
              <img
                src={t.dataUrl}
                alt={entry ? entry.label : "Unassigned tile"}
                onClick={() => setOverrides((o) => ({ ...o, [i]: !isChecked(i) }))}
              />
              <select
                value={assigned[i]}
                onChange={(e) =>
                  setAssigned((a) => a.map((v, j) => (j === i ? e.target.value : v)))
                }
              >
                <option value="">— skip —</option>
                {RELEASED_ENTRIES.map((e) => (
                  <option key={e.id} value={e.id}>{e.label}</option>
                ))}
              </select>
            </div>
          );
        })}
      </div>

      <div className="row">
        <button className="btn secondary" onClick={() => setStep("corners")}>Back</button>
        <button className="btn" style={{ flex: 1 }} onClick={apply} disabled={detectedCount === 0}>
          Add {detectedCount} to locker
        </button>
      </div>
    </div>
  );
}

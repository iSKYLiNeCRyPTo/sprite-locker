import { useEffect, useRef, useState } from "react";
import Locker from "./components/Locker.jsx";
import Scan from "./components/Scan.jsx";
import Trade from "./components/Trade.jsx";
import {
  loadCollection,
  setEntry,
  setManyOwned,
  setManyMastered,
  clearCollection,
} from "./lib/db.js";
import { RELEASED_ENTRIES } from "./data/sprites.js";

const TABS = [
  { id: "locker", label: "Locker" },
  { id: "scan", label: "Scan" },
  { id: "trade", label: "Trade" },
];

export default function App() {
  const [tab, setTab] = useState("locker");
  const [owned, setOwnedState] = useState(new Set());
  const [mastered, setMasteredState] = useState(new Set());
  const [lost, setLostState] = useState(new Set());
  const [toast, setToast] = useState("");
  const toastTimer = useRef(null);

  useEffect(() => {
    loadCollection().then(({ owned, mastered, lost }) => {
      setOwnedState(owned);
      setMasteredState(mastered);
      setLostState(lost);
    });
  }, []);

  function showToast(msg) {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2600);
  }

  // Tap cycle: none -> owned -> mastered -> lost (buy back) -> none
  function toggle(entryId) {
    const isOwned = owned.has(entryId);
    const isMastered = mastered.has(entryId);
    const isLost = lost.has(entryId);
    let state;
    if (isLost) state = "none";
    else if (!isOwned) state = "owned";
    else if (!isMastered) state = "mastered";
    else state = "lost";

    setOwnedState((prev) => {
      const next = new Set(prev);
      if (state === "owned" || state === "mastered") next.add(entryId);
      else next.delete(entryId);
      return next;
    });
    setMasteredState((prev) => {
      const next = new Set(prev);
      if (state === "mastered") next.add(entryId);
      else next.delete(entryId);
      return next;
    });
    setLostState((prev) => {
      const next = new Set(prev);
      if (state === "lost") next.add(entryId);
      else next.delete(entryId);
      return next;
    });
    setEntry(entryId, state);
  }

  // Scan/merge: adds as owned, never demotes an already-mastered entry, and
  // clears "lost" on anything the scan now sees in-game (i.e. bought back).
  function addMany(entryIds) {
    const fresh = entryIds.filter((id) => !owned.has(id));
    setOwnedState((prev) => {
      const next = new Set(prev);
      for (const id of fresh) next.add(id);
      return next;
    });
    setLostState((prev) => {
      const next = new Set(prev);
      for (const id of fresh) next.delete(id);
      return next;
    });
    setManyOwned(fresh);
  }

  // Trade merge: brings over owned + mastered from a friend/old-device code.
  function mergeCollection(friendOwned, friendMastered) {
    const freshOwned = [...friendOwned].filter(
      (id) => !owned.has(id) && !friendMastered.has(id)
    );
    const freshMastered = [...friendMastered].filter((id) => !mastered.has(id));
    setOwnedState((prev) => {
      const next = new Set(prev);
      for (const id of friendOwned) next.add(id);
      for (const id of friendMastered) next.add(id);
      return next;
    });
    setMasteredState((prev) => {
      const next = new Set(prev);
      for (const id of freshMastered) next.add(id);
      return next;
    });
    setLostState((prev) => {
      const next = new Set(prev);
      for (const id of friendOwned) next.delete(id);
      for (const id of friendMastered) next.delete(id);
      return next;
    });
    setManyOwned(freshOwned);
    setManyMastered(freshMastered);
  }

  function resetAll() {
    setOwnedState(new Set());
    setMasteredState(new Set());
    setLostState(new Set());
    clearCollection();
    showToast("Locker cleared");
  }

  const haveReleased = RELEASED_ENTRIES.filter((e) => owned.has(e.id)).length;
  const masteredReleased = RELEASED_ENTRIES.filter((e) => mastered.has(e.id)).length;
  const lostReleased = RELEASED_ENTRIES.filter((e) => lost.has(e.id)).length;
  const total = RELEASED_ENTRIES.length;
  const pct = total ? Math.round((haveReleased / total) * 100) : 0;

  return (
    <div className="app">
      <header className="header">
        <div className="header-row">
          <h1 className="brand display">
            Sprite <span className="accent">Locker</span>
          </h1>
          <div className="completion">
            <div className="big">{haveReleased} / {total}</div>
            <div className="sub">
              {pct}% extracted · ★ {masteredReleased} mastered
              {lostReleased > 0 && <span className="lost-flag"> · ⚠ {lostReleased} lost</span>}
            </div>
          </div>
        </div>
        <div className="progress-track" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </header>

      {tab === "locker" && (
        <Locker owned={owned} mastered={mastered} lost={lost} toggle={toggle} resetAll={resetAll} />
      )}
      {tab === "scan" && <Scan owned={owned} addMany={addMany} showToast={showToast} />}
      {tab === "trade" && (
        <Trade
          owned={owned}
          mastered={mastered}
          mergeCollection={mergeCollection}
          showToast={showToast}
        />
      )}

      <nav className="tabbar">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={tab === t.id ? "on" : ""}
            onClick={() => setTab(t.id)}
            aria-current={tab === t.id ? "page" : undefined}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import Locker from "./components/Locker.jsx";
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

  // Ownership tap cycle: none -> owned, then owned <-> lost (buy back) from
  // then on. Mastery is a separate, persistent flag (see toggleMastered) that
  // this never touches — losing a mastered sprite and buying it back keeps
  // it mastered. Use "Reset collection" to fully clear an entry to "none".
  function toggle(entryId) {
    const isOwned = owned.has(entryId);
    const state = isOwned ? "lost" : "owned";

    setOwnedState((prev) => {
      const next = new Set(prev);
      if (state === "owned") next.add(entryId);
      else next.delete(entryId);
      return next;
    });
    setLostState((prev) => {
      const next = new Set(prev);
      if (state === "lost") next.add(entryId);
      else next.delete(entryId);
      return next;
    });
    setEntry(entryId, state, mastered.has(entryId));
  }

  // Separate control: mark/unmark mastered without touching owned/lost.
  // Only meaningful once an entry has some history (owned or lost).
  function toggleMastered(entryId) {
    if (!owned.has(entryId) && !lost.has(entryId)) return;
    const next = !mastered.has(entryId);
    setMasteredState((prev) => {
      const nextSet = new Set(prev);
      if (next) nextSet.add(entryId);
      else nextSet.delete(entryId);
      return nextSet;
    });
    setEntry(entryId, lost.has(entryId) ? "lost" : "owned", next);
  }

  // Full per-entry reset back to "none" — owned, lost, and mastered all
  // clear. For undoing a mis-tap without wiping the whole collection.
  function clearEntry(entryId) {
    setOwnedState((prev) => {
      const next = new Set(prev);
      next.delete(entryId);
      return next;
    });
    setLostState((prev) => {
      const next = new Set(prev);
      next.delete(entryId);
      return next;
    });
    setMasteredState((prev) => {
      const next = new Set(prev);
      next.delete(entryId);
      return next;
    });
    setEntry(entryId, "none");
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
    setManyOwned(freshOwned, mastered);
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
        <Locker
          owned={owned}
          mastered={mastered}
          lost={lost}
          toggle={toggle}
          toggleMastered={toggleMastered}
          clearEntry={clearEntry}
          resetAll={resetAll}
        />
      )}
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

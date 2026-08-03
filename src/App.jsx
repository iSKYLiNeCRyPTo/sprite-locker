import { useEffect, useRef, useState } from "react";
import Locker from "./components/Locker.jsx";
import Scan from "./components/Scan.jsx";
import Trade from "./components/Trade.jsx";
import { loadCollection, setOwned, setManyOwned, clearCollection } from "./lib/db.js";
import { RELEASED_ENTRIES } from "./data/sprites.js";

const TABS = [
  { id: "locker", label: "Locker" },
  { id: "scan", label: "Scan" },
  { id: "trade", label: "Trade" },
];

export default function App() {
  const [tab, setTab] = useState("locker");
  const [owned, setOwnedState] = useState(new Set());
  const [toast, setToast] = useState("");
  const toastTimer = useRef(null);

  useEffect(() => {
    loadCollection().then(setOwnedState);
  }, []);

  function showToast(msg) {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2600);
  }

  function toggle(entryId) {
    setOwnedState((prev) => {
      const next = new Set(prev);
      const nowOwned = !next.has(entryId);
      if (nowOwned) next.add(entryId);
      else next.delete(entryId);
      setOwned(entryId, nowOwned);
      return next;
    });
  }

  function addMany(entryIds) {
    setOwnedState((prev) => {
      const next = new Set(prev);
      for (const id of entryIds) next.add(id);
      return next;
    });
    setManyOwned(entryIds);
  }

  function resetAll() {
    setOwnedState(new Set());
    clearCollection();
    showToast("Locker cleared");
  }

  const haveReleased = RELEASED_ENTRIES.filter((e) => owned.has(e.id)).length;
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
            <div className="sub">{pct}% extracted</div>
          </div>
        </div>
        <div className="progress-track" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </header>

      {tab === "locker" && <Locker owned={owned} toggle={toggle} resetAll={resetAll} />}
      {tab === "scan" && <Scan owned={owned} addMany={addMany} showToast={showToast} />}
      {tab === "trade" && <Trade owned={owned} addMany={addMany} showToast={showToast} />}

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

import { useMemo, useState } from "react";
import { BUYBACK, BUYBACK_CURRENCY, ENTRIES, RARITIES, RELEASED_ENTRIES } from "../data/sprites.js";

const STATUS = ["All", "Owned", "Missing", "Lost"];

export default function Locker({ owned, mastered, lost, toggle, toggleMastered, clearEntry, resetAll }) {
  const [status, setStatus] = useState("All");
  const [rarity, setRarity] = useState(null);
  const [query, setQuery] = useState("");
  const [sortMastered, setSortMastered] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [detailId, setDetailId] = useState(null); // entry id or null
  const [showHint, setShowHint] = useState(false);

  const rarityTotals = useMemo(() => {
    const t = {};
    for (const key of Object.keys(RARITIES)) t[key] = { have: 0, max: 0, total: 0, lost: 0 };
    for (const e of RELEASED_ENTRIES) {
      t[e.sprite.rarity].total++;
      if (owned.has(e.id)) t[e.sprite.rarity].have++;
      if (mastered.has(e.id)) t[e.sprite.rarity].max++;
      if (lost.has(e.id)) t[e.sprite.rarity].lost++;
    }
    return t;
  }, [owned, mastered, lost]);

  // Owned sprites sort to the top, then lost (buy-back) ones, then never-owned.
  // Unreleased entries always sink to the very end. Order is stable within
  // each group, so dataset order still applies as the tiebreaker.
  function groupRank(e) {
    if (!e.released) return 3;
    if (owned.has(e.id)) return 0;
    if (lost.has(e.id)) return 1;
    return 2;
  }

  const visibleEntries = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = ENTRIES.filter((e) => {
      if (rarity && e.sprite.rarity !== rarity) return false;
      if (q && !e.sprite.name.toLowerCase().includes(q) && !e.label.toLowerCase().includes(q)) {
        return false;
      }
      if (!e.released) return status === "All";
      if (status === "Owned") return owned.has(e.id);
      if (status === "Missing") return !owned.has(e.id) && !lost.has(e.id);
      if (status === "Lost") return lost.has(e.id);
      return true;
    });
    return [...list].sort((a, b) => {
      if (sortMastered) {
        const am = mastered.has(a.id) ? 0 : 1;
        const bm = mastered.has(b.id) ? 0 : 1;
        if (am !== bm) return am - bm;
      }
      return groupRank(a) - groupRank(b);
    });
  }, [status, rarity, query, owned, lost, mastered, sortMastered]);

  const detailEntry = detailId ? ENTRIES.find((e) => e.id === detailId) : null;
  const detailBuyback = detailEntry ? BUYBACK[detailEntry.sprite.rarity] : null;
  const detailPrice = detailBuyback
    ? (detailEntry.variant.id === "normal" ? detailBuyback.normal : detailBuyback.special)
    : null;
  const detailHasStatus = detailEntry && (owned.has(detailEntry.id) || lost.has(detailEntry.id));

  function clearDetail() {
    clearEntry(detailEntry.id);
    setDetailId(null);
  }

  return (
    <div>
      <div className="rarity-stats">
        {Object.entries(RARITIES).map(([key, r]) => (
          <div className="rarity-stat" key={key}>
            <div className="label" style={{ color: r.color }}>{r.name}</div>
            <div className="nums">
              {rarityTotals[key].have}/{rarityTotals[key].total}
              {rarityTotals[key].max > 0 && (
                <span className="nums-max"> ★{rarityTotals[key].max}</span>
              )}
              {rarityTotals[key].lost > 0 && (
                <span className="nums-lost"> ⚠{rarityTotals[key].lost}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <input
        className="search"
        type="text"
        placeholder="Search sprites…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="filters">
        {STATUS.map((s) => (
          <button
            key={s}
            className={`chip ${status === s ? "on" : ""} ${s === "Lost" ? "chip-lost" : ""}`}
            onClick={() => setStatus(s)}
          >
            {s}
          </button>
        ))}
        {Object.entries(RARITIES).map(([key, r]) => (
          <button
            key={key}
            className={`chip rarity-${key} ${rarity === key ? "on" : ""}`}
            onClick={() => setRarity(rarity === key ? null : key)}
          >
            {r.name}
          </button>
        ))}
        <button
          className={`chip ${sortMastered ? "on" : ""}`}
          onClick={() => setSortMastered((v) => !v)}
          aria-pressed={sortMastered}
        >
          ★ Mastered first
        </button>
        <button
          className={`chip hint-toggle ${showHint ? "on" : ""}`}
          onClick={() => setShowHint((v) => !v)}
          aria-pressed={showHint}
          aria-label="How this works"
        >
          ⓘ
        </button>
      </div>

      {showHint && (
        <p className="hint" style={{ margin: "0 0 10px" }}>
          Owned sprites sort to the top. Tap the image for details. Tap the
          status to toggle owned ↔ lost (buy back) — the ★ star marks mastery
          separately and stays put even if you lose the sprite and buy it
          back. Toggle "★ Mastered first" to bring mastered sprites to the
          top of their group.
        </p>
      )}

      {visibleEntries.length === 0 && (
        <div className="empty">No sprites match. Clear a filter to see more.</div>
      )}

      <div className="entry-grid">
        {visibleEntries.map((e) => {
          const soon = !e.released;
          const isOwned = owned.has(e.id);
          const isLost = lost.has(e.id);
          const isMastered = mastered.has(e.id);
          const state = soon ? "none" : isLost ? "lost" : isOwned ? "owned" : "none";
          const color = RARITIES[e.sprite.rarity].color;
          const statusLabel = soon
            ? "Soon"
            : isLost
              ? "Lost — buy back"
              : isOwned
                ? isMastered ? "★ Mastered" : "Owned"
                : "Not owned";
          const canMaster = !soon && (isOwned || isLost);
          return (
            <div
              className={`entry-card state-${state} ${soon ? "soon" : ""} ${isMastered ? "is-mastered" : ""}`}
              key={e.id}
              style={{ "--glow": color }}
            >
              <button
                className="entry-media"
                onClick={() => setDetailId(e.id)}
                aria-label={`${e.label} details`}
              >
                {isMastered && <span className="entry-crown" aria-hidden="true">👑</span>}
                <img
                  className="entry-img"
                  src={e.img}
                  alt=""
                  loading="lazy"
                  onError={(ev) => { ev.currentTarget.outerHTML = `<span class="entry-emoji">${e.sprite.emoji}</span>`; }}
                />
              </button>
              <div className="entry-body">
                <div className="entry-name" title={e.label}>{e.label}</div>
                <div className="entry-meta">
                  <span className="rarity-pill sm" style={{ background: color }}>
                    {RARITIES[e.sprite.rarity].name}
                  </span>
                  <span className="entry-drop">{soon ? "soon" : e.drop === "0%" ? "—" : e.drop}</span>
                </div>
              </div>
              <div className="entry-actions">
                <button
                  className={`entry-status ${state}`}
                  disabled={soon}
                  onClick={() => toggle(e.id)}
                  aria-label={`${e.label} — ${statusLabel}. Tap to change.`}
                >
                  {statusLabel}
                </button>
                <button
                  className={`entry-master ${isMastered ? "on" : ""}`}
                  disabled={!canMaster}
                  onClick={() => toggleMastered(e.id)}
                  aria-label={`${e.label} — ${isMastered ? "mastered, tap to unmark" : "mark as mastered"}`}
                  title={isMastered ? "Mastered — tap to unmark" : "Mark as mastered"}
                >
                  ★
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {detailEntry && (
        <div className="modal-overlay" onClick={() => setDetailId(null)}>
          <div
            className="modal"
            onClick={(ev) => ev.stopPropagation()}
            style={{ "--glow": RARITIES[detailEntry.sprite.rarity].color }}
          >
            <button className="modal-close" onClick={() => setDetailId(null)} aria-label="Close">×</button>
            <div className="modal-hero">
              {mastered.has(detailEntry.id) && (
                <span className="modal-crown" aria-hidden="true">👑</span>
              )}
              <img
                className="modal-img"
                src={detailEntry.img}
                alt=""
                onError={(ev) => { ev.currentTarget.outerHTML = `<span class="modal-emoji">${detailEntry.sprite.emoji}</span>`; }}
              />
            </div>
            <div className="modal-title-row">
              <h3 className="display modal-name">{detailEntry.label}</h3>
              <span
                className="rarity-pill"
                style={{ background: RARITIES[detailEntry.sprite.rarity].color }}
              >
                {RARITIES[detailEntry.sprite.rarity].name}
              </span>
            </div>
            <div className="sprite-detail">
              <div className="detail-card">
                <span className="detail-label">Ability</span>
                <span className="detail-value">{detailEntry.sprite.ability}</span>
              </div>
              {detailEntry.variant.bonus && (
                <div className="detail-card">
                  <span className="detail-label">{detailEntry.variant.name} bonus</span>
                  <span className="detail-value">{detailEntry.variant.bonus}</span>
                </div>
              )}
              <div className="detail-card">
                <span className="detail-label">Location</span>
                <span className="detail-value">{detailEntry.sprite.where}</span>
              </div>
              <div className="detail-card-row">
                <div className="detail-card">
                  <span className="detail-label">Drop chance</span>
                  <span className="detail-value big">
                    {detailEntry.drop === "0%" ? "Not in chests" : detailEntry.drop}
                    {!detailEntry.released ? " (soon)" : ""}
                  </span>
                </div>
                {detailBuyback && (
                  <div className="detail-card">
                    <span className="detail-label">Buy-back (tbc)</span>
                    <span className="detail-value big">
                      {detailPrice.toLocaleString()} <small>{BUYBACK_CURRENCY}</small>
                    </span>
                  </div>
                )}
              </div>
              {detailHasStatus && (
                <button className="btn secondary block modal-clear" onClick={clearDetail}>
                  Mark as not owned
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="panel" style={{ marginTop: 16 }}>
        {!confirmReset ? (
          <button className="btn secondary block" onClick={() => setConfirmReset(true)}>
            Reset collection
          </button>
        ) : (
          <div className="row">
            <button className="btn danger" onClick={() => { resetAll(); setConfirmReset(false); }}>
              Yes, clear everything
            </button>
            <button className="btn secondary" onClick={() => setConfirmReset(false)}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

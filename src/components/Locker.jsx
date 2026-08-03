import { useMemo, useState } from "react";
import { ENTRIES, RARITIES, RELEASED_ENTRIES, VARIANTS } from "../data/sprites.js";

const STATUS = ["All", "Owned", "Missing", "Lost"];

const STATE_LABEL = {
  none: "Not owned",
  owned: "Owned",
  mastered: "★ Mastered",
  lost: "Lost — buy back",
};

export default function Locker({ owned, mastered, lost, toggle, resetAll }) {
  const [status, setStatus] = useState("All");
  const [rarity, setRarity] = useState(null);
  const [query, setQuery] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);
  const [detailId, setDetailId] = useState(null); // sprite id or null

  function stateOf(entryId) {
    if (lost.has(entryId)) return "lost";
    if (mastered.has(entryId)) return "mastered";
    if (owned.has(entryId)) return "owned";
    return "none";
  }

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
    // Unreleased entries sink to the end (display only — dataset order untouched).
    return [...list].sort((a, b) => (a.released ? 0 : 1) - (b.released ? 0 : 1));
  }, [status, rarity, query, owned, lost]);

  const detailSprite = detailId ? ENTRIES.find((e) => e.sprite.id === detailId)?.sprite : null;

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
      </div>

      <p className="hint" style={{ margin: "0 0 10px" }}>
        Tap the image for details. Tap the status to cycle: owned → ★ mastered → lost (buy back) → clear.
      </p>

      {visibleEntries.length === 0 && (
        <div className="empty">No sprites match. Clear a filter to see more.</div>
      )}

      <div className="entry-grid">
        {visibleEntries.map((e) => {
          const soon = !e.released;
          const state = soon ? "none" : stateOf(e.id);
          const color = RARITIES[e.sprite.rarity].color;
          return (
            <div
              className={`entry-card state-${state} ${soon ? "soon" : ""}`}
              key={e.id}
              style={{ "--glow": color }}
            >
              <button
                className="entry-media"
                onClick={() => setDetailId(e.sprite.id)}
                aria-label={`${e.label} details`}
              >
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
              <button
                className={`entry-status ${state}`}
                disabled={soon}
                onClick={() => toggle(e.id)}
                aria-label={`${e.label} — ${soon ? "coming soon" : STATE_LABEL[state]}. Tap to change.`}
              >
                {soon ? "Soon" : STATE_LABEL[state]}
              </button>
            </div>
          );
        })}
      </div>

      {detailSprite && (
        <div className="modal-overlay" onClick={() => setDetailId(null)}>
          <div className="modal" onClick={(ev) => ev.stopPropagation()}>
            <button className="modal-close" onClick={() => setDetailId(null)} aria-label="Close">×</button>
            <h3 className="display" style={{ marginTop: 0 }}>{detailSprite.name}</h3>
            <div className="sprite-detail">
              <div className="detail-row">
                <span className="detail-label">Ability</span>
                <span>{detailSprite.ability}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Location</span>
                <span>{detailSprite.where}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Drop chances</span>
                <span className="detail-drops">
                  {detailSprite.variants.map((v) => {
                    const variant = VARIANTS.find((x) => x.id === v.v);
                    return (
                      <span className="drop-line" key={v.v}>
                        <span>{variant.name}{v.u ? " (soon)" : ""}</span>
                        <b>{v.d === "0%" ? "not in chests" : v.d}</b>
                      </span>
                    );
                  })}
                </span>
              </div>
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

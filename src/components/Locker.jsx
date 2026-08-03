import { useMemo, useState } from "react";
import { SPRITES, RARITIES, RELEASED_ENTRIES, VARIANTS, spriteImg } from "../data/sprites.js";

const STATUS = ["All", "Owned", "Missing"];

export default function Locker({ owned, mastered, toggle, resetAll }) {
  const [status, setStatus] = useState("All");
  const [rarity, setRarity] = useState(null);
  const [query, setQuery] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);
  const [expanded, setExpanded] = useState(null); // sprite id or null

  const rarityTotals = useMemo(() => {
    const t = {};
    for (const key of Object.keys(RARITIES)) t[key] = { have: 0, max: 0, total: 0 };
    for (const e of RELEASED_ENTRIES) {
      t[e.sprite.rarity].total++;
      if (owned.has(e.id)) t[e.sprite.rarity].have++;
      if (mastered.has(e.id)) t[e.sprite.rarity].max++;
    }
    return t;
  }, [owned, mastered]);

  const visibleSprites = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = SPRITES.filter((s) => {
      if (rarity && s.rarity !== rarity) return false;
      if (q && !s.name.toLowerCase().includes(q)) return false;
      const released = s.variants.filter((v) => !v.u);
      if (released.length === 0 && status !== "All") return false;
      const haveCount = released.filter((v) => owned.has(`${s.id}:${v.v}`)).length;
      if (status === "Owned") return haveCount > 0;
      if (status === "Missing") return haveCount < released.length;
      return true;
    });
    // Fully-unreleased sprites sink to the end (display only — dataset order untouched).
    return [...list].sort(
      (a, b) => (a.variants.every((v) => v.u) ? 1 : 0) - (b.variants.every((v) => v.u) ? 1 : 0)
    );
  }, [status, rarity, query, owned]);

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
            className={`chip ${status === s ? "on" : ""}`}
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
        Tap a variant to cycle: owned → ★ mastered → clear.
      </p>

      {visibleSprites.length === 0 && (
        <div className="empty">No sprites match. Clear a filter to see more.</div>
      )}

      {visibleSprites.map((s) => {
        const released = s.variants.filter((v) => !v.u);
        const haveCount = released.filter((v) => owned.has(`${s.id}:${v.v}`)).length;
        const color = RARITIES[s.rarity].color;
        const isOpen = expanded === s.id;
        return (
          <div className="sprite-card" key={s.id}>
            <button
              className="sprite-head"
              onClick={() => setExpanded(isOpen ? null : s.id)}
              aria-expanded={isOpen}
            >
              <img
                className="sprite-img"
                src={spriteImg(s.id)}
                alt=""
                loading="lazy"
                onError={(e) => { e.currentTarget.outerHTML = `<div class="sprite-emoji">${s.emoji}</div>`; }}
              />
              <div className="sprite-title">
                <h3 className="name display">{s.name}</h3>
                <div className="meta" title={s.ability}>{s.ability}</div>
              </div>
              <span className="rarity-pill" style={{ background: color }}>
                {RARITIES[s.rarity].name}
              </span>
              <span className="sprite-count">
                {haveCount}/{released.length || "—"}
                {released.some((v) => mastered.has(`${s.id}:${v.v}`)) && (
                  <span className="nums-max"> ★{released.filter((v) => mastered.has(`${s.id}:${v.v}`)).length}</span>
                )}
              </span>
            </button>
            {isOpen && (
              <div className="sprite-detail">
                <div className="detail-row">
                  <span className="detail-label">Ability</span>
                  <span>{s.ability}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Location</span>
                  <span>{s.where}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Drop chances</span>
                  <span className="detail-drops">
                    {s.variants.map((v) => {
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
            )}
            <div className="variant-row">
              {[...s.variants].sort((a, b) => (a.u ? 1 : 0) - (b.u ? 1 : 0)).map((v) => {
                const id = `${s.id}:${v.v}`;
                const isMastered = mastered.has(id);
                const isOwned = owned.has(id);
                const soon = !!v.u;
                return (
                  <button
                    key={id}
                    className={`variant-chip ${isOwned ? "owned" : ""} ${isMastered ? "mastered" : ""} ${soon ? "soon" : ""}`}
                    style={{ "--glow": color }}
                    disabled={soon}
                    onClick={() => toggle(id)}
                    aria-label={`${v.v} ${s.name}${soon ? " (coming soon)" : isMastered ? " — mastered" : isOwned ? " — owned" : " — not owned"}. Tap to change.`}
                  >
                    <img
                      className="v-img"
                      src={spriteImg(s.id, v.v)}
                      alt=""
                      loading="lazy"
                      onError={(e) => { e.currentTarget.outerHTML = `<span class="v-emoji">${s.emoji}</span>`; }}
                    />
                    <span className="v-name">{soon ? "Soon" : isMastered ? "★ MAX" : v.v}</span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

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

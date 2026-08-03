import { useMemo, useState } from "react";
import { SPRITES, RARITIES, RELEASED_ENTRIES } from "../data/sprites.js";

const STATUS = ["All", "Owned", "Missing"];

export default function Locker({ owned, toggle, resetAll }) {
  const [status, setStatus] = useState("All");
  const [rarity, setRarity] = useState(null);
  const [query, setQuery] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);

  const rarityTotals = useMemo(() => {
    const t = {};
    for (const key of Object.keys(RARITIES)) t[key] = { have: 0, total: 0 };
    for (const e of RELEASED_ENTRIES) {
      t[e.sprite.rarity].total++;
      if (owned.has(e.id)) t[e.sprite.rarity].have++;
    }
    return t;
  }, [owned]);

  const visibleSprites = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SPRITES.filter((s) => {
      if (rarity && s.rarity !== rarity) return false;
      if (q && !s.name.toLowerCase().includes(q)) return false;
      const released = s.variants.filter((v) => !v.u);
      if (released.length === 0 && status !== "All") return false;
      const haveCount = released.filter((v) => owned.has(`${s.id}:${v.v}`)).length;
      if (status === "Owned") return haveCount > 0;
      if (status === "Missing") return haveCount < released.length;
      return true;
    });
  }, [status, rarity, query, owned]);

  return (
    <div>
      <div className="rarity-stats">
        {Object.entries(RARITIES).map(([key, r]) => (
          <div className="rarity-stat" key={key}>
            <div className="label" style={{ color: r.color }}>{r.name}</div>
            <div className="nums">
              {rarityTotals[key].have}/{rarityTotals[key].total}
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

      {visibleSprites.length === 0 && (
        <div className="empty">No sprites match. Clear a filter to see more.</div>
      )}

      {visibleSprites.map((s) => {
        const released = s.variants.filter((v) => !v.u);
        const haveCount = released.filter((v) => owned.has(`${s.id}:${v.v}`)).length;
        const color = RARITIES[s.rarity].color;
        return (
          <div className="sprite-card" key={s.id}>
            <div className="sprite-head">
              <div className="sprite-emoji" aria-hidden="true">{s.emoji}</div>
              <div className="sprite-title">
                <h3 className="name display">{s.name}</h3>
                <div className="meta" title={s.ability}>{s.ability}</div>
              </div>
              <span className="rarity-pill" style={{ background: color }}>
                {RARITIES[s.rarity].name}
              </span>
              <span className="sprite-count">{haveCount}/{released.length || "—"}</span>
            </div>
            <div className="variant-row">
              {s.variants.map((v) => {
                const id = `${s.id}:${v.v}`;
                const isOwned = owned.has(id);
                const soon = !!v.u;
                return (
                  <button
                    key={id}
                    className={`variant-chip ${isOwned ? "owned" : ""} ${soon ? "soon" : ""}`}
                    style={{ "--glow": color }}
                    disabled={soon}
                    onClick={() => toggle(id)}
                    aria-pressed={isOwned}
                    aria-label={`${v.v} ${s.name}${soon ? " (coming soon)" : ""}`}
                  >
                    <span className="v-emoji" aria-hidden="true">{s.emoji}</span>
                    <span className="v-name">{soon ? "Soon" : v.v}</span>
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

import { useMemo, useState } from "react";
import { encodeCollection, decodeCollection } from "../lib/code.js";
import { RELEASED_ENTRIES, RARITIES } from "../data/sprites.js";

export default function Trade({ owned, mastered, mergeCollection, showToast }) {
  const [pasted, setPasted] = useState("");
  const [friend, setFriend] = useState(null); // { owned, mastered, versionMismatch }
  const [error, setError] = useState("");

  const myCode = useMemo(() => encodeCollection(owned, mastered), [owned, mastered]);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(myCode);
      showToast("Code copied — send it to your trade partner");
    } catch {
      showToast("Copy blocked — long-press the code to copy it");
    }
  }

  function compare() {
    setError("");
    try {
      setFriend(decodeCollection(pasted));
    } catch {
      setFriend(null);
      setError("That doesn't look like a Sprite Locker code. Ask them to copy it again.");
    }
  }

  const diff = useMemo(() => {
    if (!friend) return null;
    const youGive = [];
    const youGet = [];
    let bothMissing = 0;
    for (const e of RELEASED_ENTRIES) {
      const mine = owned.has(e.id);
      const theirs = friend.owned.has(e.id);
      if (mine && !theirs) youGive.push(e);
      else if (!mine && theirs) youGet.push(e);
      else if (!mine && !theirs) bothMissing++;
    }
    return { youGive, youGet, bothMissing };
  }, [friend, owned]);

  function importAsMine() {
    if (!friend) return;
    mergeCollection(friend.owned, friend.mastered);
    showToast("Merged into your locker");
  }

  const List = ({ items, emptyText }) => (
    items.length === 0 ? (
      <div className="empty">{emptyText}</div>
    ) : (
      <ul className="trade-list">
        {items.map((e) => (
          <li key={e.id}>
            <span className="dot" style={{ background: RARITIES[e.sprite.rarity].color }} />
            <img className="trade-img" src={e.img} alt="" loading="lazy"
              onError={(ev) => { ev.currentTarget.outerHTML = `<span>${e.sprite.emoji}</span>`; }} />
            <span>{e.label}</span>
          </li>
        ))}
      </ul>
    )
  );

  return (
    <div>
      <div className="panel">
        <h2 className="display">Your locker code</h2>
        <p className="hint">
          One short code holds your whole collection. Send it over Discord or
          text — your trade partner pastes it into their Sprite Locker (and you
          paste theirs below).
        </p>
        <div className="code-box">{myCode}</div>
        <button className="btn block" onClick={copyCode}>Copy my code</button>
      </div>

      <div className="panel">
        <h2 className="display">Compare with a friend</h2>
        <span className="field-label">Paste their code</span>
        <textarea
          rows={3}
          value={pasted}
          onChange={(e) => setPasted(e.target.value)}
          placeholder="SPR1|…"
        />
        {error && <p className="hint" style={{ color: "var(--danger)", marginTop: 6 }}>{error}</p>}
        <div style={{ height: 8 }} />
        <button className="btn block" onClick={compare} disabled={!pasted.trim()}>
          Find trades
        </button>
      </div>

      {friend && diff && (
        <>
          {friend.versionMismatch && (
            <div className="panel">
              <p className="hint" style={{ margin: 0 }}>
                Heads up: their code was made on dataset {friend.version}. Newer
                sprites may be missing from the comparison — worth both updating
                the app.
              </p>
            </div>
          )}

          <div className="match-banner">
            <div className="big display">
              {Math.min(diff.youGive.length, diff.youGet.length) > 0
                ? `Trade on! ${diff.youGive.length} you can give · ${diff.youGet.length} you can get`
                : diff.youGet.length > 0
                  ? `They have ${diff.youGet.length} you need — but you've got nothing they're missing`
                  : diff.youGive.length > 0
                    ? `You have ${diff.youGive.length} they need — but nothing for you here`
                    : "Dead even — no trades to make"}
            </div>
            <p className="hint" style={{ margin: "4px 0 0" }}>
              {diff.bothMissing} sprites neither of you has yet — hunt those together.
            </p>
          </div>

          <div className="panel">
            <h2 className="display">You can get ({diff.youGet.length})</h2>
            <p className="hint">They own these; you don't.</p>
            <List items={diff.youGet} emptyText="Nothing they have that you're missing." />
          </div>

          <div className="panel">
            <h2 className="display">You can give ({diff.youGive.length})</h2>
            <p className="hint">You own these; they don't.</p>
            <List items={diff.youGive} emptyText="You've got nothing they're missing." />
          </div>

          <div className="panel">
            <h2 className="display">Other tools</h2>
            <p className="hint">
              Moving to a new phone? Paste your own code from the old device and
              merge it into this locker.
            </p>
            <button className="btn secondary block" onClick={importAsMine}>
              Merge this code into my locker
            </button>
          </div>
        </>
      )}
    </div>
  );
}

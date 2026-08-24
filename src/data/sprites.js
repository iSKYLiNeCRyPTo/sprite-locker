// Fortnite Sprite dataset — Chapter 7 Season 4 "Override"
// Update this file per game patch, then bump DATASET_VERSION.
//
// Override replaced the old Sprite Chest / 8-variant system entirely:
// Sprite Chests are now Cheat Code Chests (find a Cheat Code Injector,
// enter a directional sequence, get a guaranteed Sprite), and every Sprite
// now has just three variants — Normal, Gold and Cheat Master — instead of
// the old Gold/Gummy/Galaxy/Gem/Holofoil/Cube/Quack lineup. Because the
// system changed, the whole Chapter 7 Season 3 roster (Water, Earth,
// Batman, Grim Reaper, etc.) and its sprite images have been removed
// rather than carried forward.
//
// Best-effort compiled 2026-08-24 from fortnite.gg (roster, rarities, the
// Normal/Gold/Cheat Master variant split, and live drop %) plus press
// coverage for ability/location text, since fortnite.gg itself hadn't
// published drop rates yet (every entry showed "0%" in-app) — reconfirm
// abilities/locations and swap in real drop %s once fortnite.gg has them.
// Launch roster: Rare 5 (4 released + Storm Scout unreleased), Epic 4,
// Legendary 1, Mythic 2 = 12 sprites, 33 released entries.

export const DATASET_VERSION = "2026-08-24.1";

// Every variant stacks its bonus on top of the sprite's own ability.
export const VARIANTS = [
  { id: "normal", name: "Normal", tag: "N", bonus: null },
  { id: "gold", name: "Gold", tag: "AU", bonus: "+3× XP from eliminations." },
  {
    id: "cheatmaster",
    name: "Cheat Master",
    tag: "CM",
    bonus: "Cheat Code sequences accept any directional input — mash your way through them.",
  },
];

export const RARITIES = {
  rare: { name: "Rare", color: "#3fa9f5" },
  epic: { name: "Epic", color: "#b14cf0" },
  legendary: { name: "Legendary", color: "#f5923f" },
  mythic: { name: "Mythic", color: "#f2c14e" },
};

// Interim buy-back (resummon) costs by rarity, carried over unchanged from
// last season's user-supplied placeholders — swap in real Override numbers
// once confirmed. "normal" is the Normal variant's cost; "special" covers
// Gold and Cheat Master. Shown in the Locker's detail modal as "tbc".
export const BUYBACK_CURRENCY = "Sprite Dust";
export const BUYBACK = {
  rare: { normal: 100, special: 2700 },
  epic: { normal: 2700, special: 4000 },
  legendary: { normal: 4500, special: 6750 },
  mythic: { normal: 6750, special: 10000 },
};

// Images live in public/sprites/{spriteId}-{variantId}.webp (from fortnite.gg).
// v: variant id, u: true if not yet released ("coming soon"),
// d: Sprite Chest drop chance per fortnite.gg ("0%" = not currently in chests)
const S = (id, name, emoji, rarity, ability, where, variants) => ({
  id,
  name,
  emoji,
  rarity,
  ability,
  where,
  variants,
});

export const SPRITES = [
  S("bush", "Bush", "🌳", "rare",
    "Spawns a bush disguise you can hide inside.",
    "Cheat Code Chests across the map — blue codes.",
    [{ v: "normal", d: "0%" }, { v: "gold", d: "0%" }, { v: "cheatmaster", d: "0%" }]),
  S("adventure", "Adventure", "🧭", "rare",
    "Upgrades a random item you're holding each level.",
    "Cheat Code Chests across the map — blue codes.",
    [{ v: "normal", d: "0%" }, { v: "gold", d: "0%" }, { v: "cheatmaster", d: "0%" }]),
  S("jonesy", "Jonesy", "😎", "rare",
    "Heals you after you take damage.",
    "Cheat Code Chests across the map — blue codes.",
    [{ v: "normal", d: "0%" }, { v: "gold", d: "0%" }, { v: "cheatmaster", d: "0%" }]),
  S("8bit", "8-Bit", "🎮", "rare",
    "Places an 8-Bit Shotgun in your first Chest each match, with a score multiplier.",
    "Cheat Code Chests across the map — blue codes.",
    [{ v: "normal", d: "0%" }, { v: "gold", d: "0%" }, { v: "cheatmaster", d: "0%" }]),
  S("stormscout", "Storm Scout", "🌩️", "rare",
    "Ability not yet revealed.",
    "Not yet available.",
    [{ v: "normal", d: "0%", u: true }, { v: "gold", d: "0%", u: true }, { v: "cheatmaster", d: "0%", u: true }]),
  S("sonic", "Sonic", "🦔", "epic",
    "Sprint faster.",
    "Cheat Code Chests across the map — purple codes.",
    [{ v: "normal", d: "0%" }, { v: "gold", d: "0%" }, { v: "cheatmaster", d: "0%" }]),
  S("tails", "Tails", "🦊", "epic",
    "Lets you hover.",
    "Cheat Code Chests across the map — purple codes.",
    [{ v: "normal", d: "0%" }, { v: "gold", d: "0%" }, { v: "cheatmaster", d: "0%" }]),
  S("shadow", "Shadow", "🌑", "epic",
    "Automatically reloads your weapons over time, including ones you're not holding.",
    "Cheat Code Chests across the map — purple codes.",
    [{ v: "normal", d: "0%" }, { v: "gold", d: "0%" }, { v: "cheatmaster", d: "0%" }]),
  S("killswitch", "Killswitch", "🎯", "epic",
    "Activates Hangtime with improved accuracy.",
    "Cheat Code Chests across the map — purple codes.",
    [{ v: "normal", d: "0%" }, { v: "gold", d: "0%" }, { v: "cheatmaster", d: "0%" }]),
  S("jackrabbit", "Jackrabbit", "🐰", "legendary",
    "Grants an extra mid-air jump.",
    "Cheat Code Chests across the map — gold codes.",
    [{ v: "normal", d: "0%" }, { v: "gold", d: "0%" }, { v: "cheatmaster", d: "0%" }]),
  S("klombo", "Klombo", "🦖", "mythic",
    "Grants a random item on level-up, better loot at higher levels. Levels up by using Health or Shield items.",
    "Cheat Code Chests across the map.",
    [{ v: "normal", d: "0%" }, { v: "gold", d: "0%" }, { v: "cheatmaster", d: "0%" }]),
  S("crown", "Crown", "👑", "mythic",
    "Grants extra Crown Wins after a Victory Royale. Levels up by winning matches.",
    "Awarded for winning a match (Victory Royale).",
    [{ v: "normal", d: "0%" }, { v: "gold", d: "0%" }, { v: "cheatmaster", d: "0%" }]),
];

const BASE = (import.meta.env && import.meta.env.BASE_URL) || "/";
export const spriteImg = (spriteId, variantId = "normal") =>
  `${BASE}sprites/${spriteId}-${variantId}.webp`;

// Flat entry list in fixed dataset order. Entry order is the contract for
// share codes and scan mapping — append new entries at the sprite level and
// bump DATASET_VERSION; never reorder within a version.
export const ENTRIES = SPRITES.flatMap((s) =>
  s.variants.map((vv) => {
    const variant = VARIANTS.find((x) => x.id === vv.v);
    return {
      id: `${s.id}:${vv.v}`,
      sprite: s,
      variant,
      released: !vv.u,
      drop: vv.d,
      img: spriteImg(s.id, vv.v),
      label: vv.v === "normal" ? s.name : `${variant.name} ${s.name}`,
    };
  })
);

export const ENTRY_INDEX = new Map(ENTRIES.map((e, i) => [e.id, i]));
export const RELEASED_ENTRIES = ENTRIES.filter((e) => e.released);

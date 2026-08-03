// Fortnite Sprite dataset — Chapter 7 Season 3
// Update this file per game patch, then bump DATASET_VERSION.
// Released totals as of 2026-08-02: Rare 29, Epic 27, Legendary 30, Mythic 23 = 109.
// Unreleased entries (Gem "coming soon" variants, Ironmouse) are included with
// released:false so they appear as silhouettes and slot in on release without
// breaking saved data or share codes.

export const DATASET_VERSION = "2026-08-02.1";

export const VARIANTS = [
  { id: "normal", name: "Normal", tag: "N" },
  { id: "gold", name: "Gold", tag: "AU" },
  { id: "gummy", name: "Gummy", tag: "GU" },
  { id: "galaxy", name: "Galaxy", tag: "GX" },
  { id: "gem", name: "Gem", tag: "GM" },
  { id: "holofoil", name: "Holofoil", tag: "HF" },
  { id: "cube", name: "Cube", tag: "CB" },
  { id: "quack", name: "Quack", tag: "QK" },
];

export const RARITIES = {
  rare: { name: "Rare", color: "#3fa9f5" },
  epic: { name: "Epic", color: "#b14cf0" },
  legendary: { name: "Legendary", color: "#f5923f" },
  mythic: { name: "Mythic", color: "#f2c14e" },
};

// Interim buy-back (resummon) costs by rarity, from user-supplied numbers —
// swap in the fortnite.gg/sprites values once confirmed. "normal" is the
// Normal variant's cost; "special" covers every other variant (Gold, Gummy,
// Galaxy, Gem, Holofoil, Cube, Quack). Shown in the Locker's detail modal.
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
  S("water", "Water", "💧", "rare",
    "Replenishes shields for you and nearby squadmates while in water.",
    "Near lakes, rivers and the coastline.",
    [{ v: "normal", d: "0%" }, { v: "gold", d: "0.53%" }, { v: "gummy", d: "0.53%" }, { v: "galaxy", d: "0.43%" }, { v: "gem", u: true, d: "0.37%" }, { v: "holofoil", d: "0.53%" }, { v: "quack", d: "0%" }]),
  S("earth", "Earth", "🌿", "rare",
    "Chance for extra rare items from chests.",
    "Forests and wooded areas.",
    [{ v: "normal", d: "0%" }, { v: "gold", d: "0.53%" }, { v: "gummy", d: "0.53%" }, { v: "galaxy", d: "0.43%" }, { v: "gem", u: true, d: "0.37%" }, { v: "cube", d: "0.21%" }, { v: "quack", d: "0%" }]),
  S("fire", "Fire", "🔥", "rare",
    "Releases a fiery burst after you deal enough damage.",
    "City and built-up POIs.",
    [{ v: "normal", d: "0%" }, { v: "gold", d: "0.53%" }, { v: "gummy", d: "0.53%" }, { v: "galaxy", d: "0.43%" }, { v: "holofoil", d: "0.53%" }, { v: "cube", d: "0.21%" }, { v: "quack", d: "0%" }]),
  S("fishy", "Fishy", "🐟", "rare",
    "Faster swimming, plus a brief speed boost when you take damage.",
    "Chests across the map.",
    [{ v: "normal", d: "0%" }, { v: "gold", d: "0.64%" }, { v: "gummy", d: "0.53%" }, { v: "galaxy", d: "0.43%" }, { v: "cube", d: "0.21%" }]),
  S("air", "Air", "🌀", "rare",
    "Sprint faster, jump higher while sprinting, no fall damage.",
    "Chests, Rare Chests and Sprite Chests map-wide.",
    [{ v: "normal", d: "0%" }, { v: "gold", d: "0.53%" }, { v: "gummy", d: "0.53%" }, { v: "galaxy", d: "0.43%" }, { v: "holofoil", d: "0.53%" }]),
  S("duck", "Duck", "🦆", "epic",
    "Emoting or jamming replenishes your shields.",
    "Sprite Chests across the map.",
    [{ v: "normal", d: "6.48%" }, { v: "gold", d: "0.62%" }, { v: "gummy", d: "0.37%" }, { v: "galaxy", d: "0.25%" }, { v: "gem", u: true, d: "0.1%" }]),
  S("ghost", "Ghost", "👻", "epic",
    "Cloaks you on reload.",
    "Only spawns at night.",
    [{ v: "normal", d: "5.25%" }, { v: "gold", d: "0.62%" }, { v: "gummy", d: "0.37%" }, { v: "galaxy", d: "0.25%" }, { v: "holofoil", d: "1.23%" }]),
  S("demon", "Demon", "😈", "epic",
    "Siphons health and shields on eliminations.",
    "Sprite Chests across the map.",
    [{ v: "normal", d: "6.48%" }, { v: "gold", d: "0.62%" }, { v: "gummy", d: "0.37%" }, { v: "galaxy", d: "0.25%" }, { v: "gem", u: true, d: "0.1%" }]),
  S("king", "King", "👑", "epic",
    "Your pickaxe deals more damage.",
    "Sprite Chests across the map.",
    [{ v: "normal", d: "5.25%" }, { v: "gold", d: "0.62%" }, { v: "gummy", d: "0.37%" }, { v: "galaxy", d: "0.25%" }, { v: "holofoil", d: "1.23%" }]),
  S("aura", "Aura", "✨", "epic",
    "Grants a Shock Rock charge after you deal enough damage.",
    "Chests and Supply Drops across the map.",
    [{ v: "normal", d: "6.48%" }, { v: "gold", d: "0.62%" }, { v: "gummy", d: "0.37%" }, { v: "galaxy", d: "0.25%" }, { v: "gem", u: true, d: "0.08%" }]),
  S("striker", "Striker", "⚽", "epic",
    "Triggers Overdrive when you mantle, hurdle or wall scramble.",
    "Score a goal at the Soccer Pitch.",
    [{ v: "normal", d: "5.25%" }, { v: "gold", d: "0.62%" }, { v: "gummy", d: "0.37%" }, { v: "galaxy", d: "0.25%" }, { v: "holofoil", d: "1.23%" }]),
  S("dream", "Dream", "🌙", "legendary",
    "Grants a random item each level; legendary loot at max level.",
    "Chests only — a rarer spawn.",
    [{ v: "normal", d: "4.45%" }, { v: "gold", d: "0.43%" }, { v: "gummy", d: "0.26%" }, { v: "galaxy", d: "0.17%" }, { v: "cube", d: "0.04%" }]),
  S("punk", "Punk", "🎸", "legendary",
    "Chance of infinite ammo.",
    "Chests only — a rarer spawn.",
    [{ v: "normal", d: "4.45%" }, { v: "gold", d: "0.43%" }, { v: "gummy", d: "0.26%" }, { v: "galaxy", d: "0.17%" }, { v: "gem", u: true, d: "0%" }, { v: "cube", d: "0.04%" }]),
  S("boss", "Boss", "💪", "legendary",
    "Boosts your maximum Health and Shield.",
    "Drops from any Boss you defeat.",
    [{ v: "normal", d: "4.45%" }, { v: "gold", d: "0.43%" }, { v: "gummy", d: "0.26%" }, { v: "galaxy", d: "0.17%" }, { v: "cube", d: "0.04%" }]),
  S("seven", "Seven", "🛰️", "legendary",
    "Makes enemy footsteps visible to your whole squad.",
    "Sprite Chests in unranked BR and Zero Build.",
    [{ v: "normal", d: "3.63%" }, { v: "gold", d: "0.43%" }, { v: "gummy", d: "0.26%" }, { v: "galaxy", d: "0.17%" }, { v: "holofoil", d: "0.85%" }]),
  S("peely", "Peeky Peely", "🍌", "legendary",
    "Marks rare sprite variants and their carriers nearby — but reveals you too.",
    "High ground — mountainous areas.",
    [{ v: "normal", d: "4.62%" }, { v: "gold", d: "0.43%" }, { v: "gummy", d: "0.26%" }, { v: "galaxy", d: "0.17%" }, { v: "holofoil", d: "0.85%" }]),
  S("llama", "Lootin' Llama", "🦙", "legendary",
    "Chance of a weapon upgrade when you open an ammo box.",
    "Relic Chests; Sprite/Rare Chests at Golden Grove and Calamari Canyon.",
    [{ v: "normal", d: "4.45%" }, { v: "gold", d: "0.43%" }, { v: "gummy", d: "0.26%" }, { v: "galaxy", d: "0.17%" }, { v: "gem", d: "0%" }]),
  S("batman", "Batman", "🦇", "mythic",
    "Bat Cape glide, and better odds of rare Sprites in chests.",
    "Beat Catwoman / Harley / Poison Ivy NPCs, DC quests, or Sprite Chests.",
    [{ v: "normal", d: "1.44%" }, { v: "gold", d: "0.17%" }, { v: "gummy", d: "0.1%" }, { v: "galaxy", d: "0.07%" }, { v: "holofoil", d: "0.34%" }, { v: "cube", d: "0.02%" }]),
  S("grimreaper", "Grim Reaper", "💀", "mythic",
    "Anyone who attacks you gets marked.",
    "Chests across the map.",
    [{ v: "normal", d: "0.15%" }, { v: "gold", d: "0.01%" }, { v: "gummy", d: "0.01%" }, { v: "galaxy", d: "0.01%" }, { v: "gem", u: true, d: "0.00099%" }, { v: "holofoil", d: "0%" }, { v: "cube", d: "0%" }]),
  S("zeropoint", "Zero Point", "🔷", "mythic",
    "Spawns a Shield Bubble Jr. when you self-heal.",
    "Vault / keycard Sprite Chests — the rarest spawn.",
    [{ v: "normal", d: "0%" }, { v: "gold", d: "0.00014%" }, { v: "gummy", d: "0.000085%" }, { v: "galaxy", d: "0.000056%" }, { v: "gem", u: true, d: "0.00001%" }, { v: "holofoil", d: "0.00028%" }, { v: "cube", d: "0.000014%" }, { v: "quack", d: "0%" }]),
  S("burntpeanut", "Burnt Peanut", "🥜", "mythic",
    "Chance of extra loot on eliminations; mythic loot when maxed.",
    "Relic Chests (~1.5% chance).",
    [{ v: "normal", d: "2.14%" }]),
  S("vinijr", "Vini Jr.", "🇧🇷", "mythic",
    "Sprint slidekick that damages enemies and boosts fire rate + reload.",
    "Sprite Chests and Rare Chests.",
    [{ v: "normal", d: "2.14%" }]),
  S("pollo", "Pollo", "🐔", "mythic",
    "Squad regenerates shields after an elimination.",
    "Sprite Chests and Rare Chests — or trade for it.",
    [{ v: "normal", d: "2.14%" }]),
  S("johnwick", "John Wick", "🕴️", "mythic",
    "Reveals nearby enemies after you knock or eliminate a player.",
    "The Simpsons Reload map — carries over to Battle Royale.",
    [{ v: "normal", d: "0%" }]),
  S("ironmouse", "Ironmouse", "🐭", "mythic",
    "Not yet revealed.",
    "Not yet available.",
    [{ v: "normal", u: true, d: "2.14%" }]),
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

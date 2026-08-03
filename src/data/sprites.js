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

// v: variant id, u: true if not yet released ("coming soon")
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
    [{ v: "normal" }, { v: "gold" }, { v: "gummy" }, { v: "galaxy" }, { v: "gem", u: true }, { v: "holofoil" }, { v: "quack" }]),
  S("earth", "Earth", "🌿", "rare",
    "Chance for extra rare items from chests.",
    "Forests and wooded areas.",
    [{ v: "normal" }, { v: "gold" }, { v: "gummy" }, { v: "galaxy" }, { v: "gem", u: true }, { v: "cube" }, { v: "quack" }]),
  S("fire", "Fire", "🔥", "rare",
    "Releases a fiery burst after you deal enough damage.",
    "City and built-up POIs.",
    [{ v: "normal" }, { v: "gold" }, { v: "gummy" }, { v: "galaxy" }, { v: "holofoil" }, { v: "cube" }, { v: "quack" }]),
  S("fishy", "Fishy", "🐟", "rare",
    "Faster swimming, plus a brief speed boost when you take damage.",
    "Chests across the map.",
    [{ v: "normal" }, { v: "gold" }, { v: "gummy" }, { v: "galaxy" }, { v: "cube" }]),
  S("air", "Air", "🌀", "rare",
    "Sprint faster, jump higher while sprinting, no fall damage.",
    "Chests, Rare Chests and Sprite Chests map-wide.",
    [{ v: "normal" }, { v: "gold" }, { v: "gummy" }, { v: "galaxy" }, { v: "holofoil" }]),
  S("duck", "Duck", "🦆", "epic",
    "Emoting or jamming replenishes your shields.",
    "Sprite Chests across the map.",
    [{ v: "normal" }, { v: "gold" }, { v: "gummy" }, { v: "galaxy" }, { v: "gem", u: true }]),
  S("ghost", "Ghost", "👻", "epic",
    "Cloaks you on reload.",
    "Only spawns at night.",
    [{ v: "normal" }, { v: "gold" }, { v: "gummy" }, { v: "galaxy" }, { v: "holofoil" }]),
  S("demon", "Demon", "😈", "epic",
    "Siphons health and shields on eliminations.",
    "Sprite Chests across the map.",
    [{ v: "normal" }, { v: "gold" }, { v: "gummy" }, { v: "galaxy" }, { v: "gem", u: true }]),
  S("king", "King", "👑", "epic",
    "Your pickaxe deals more damage.",
    "Sprite Chests across the map.",
    [{ v: "normal" }, { v: "gold" }, { v: "gummy" }, { v: "galaxy" }, { v: "holofoil" }]),
  S("aura", "Aura", "✨", "epic",
    "Grants a Shock Rock charge after you deal enough damage.",
    "Chests and Supply Drops across the map.",
    [{ v: "normal" }, { v: "gold" }, { v: "gummy" }, { v: "galaxy" }, { v: "gem", u: true }]),
  S("striker", "Striker", "⚽", "epic",
    "Triggers Overdrive when you mantle, hurdle or wall scramble.",
    "Score a goal at the Soccer Pitch.",
    [{ v: "normal" }, { v: "gold" }, { v: "gummy" }, { v: "galaxy" }, { v: "holofoil" }]),
  S("dream", "Dream", "🌙", "legendary",
    "Grants a random item each level; legendary loot at max level.",
    "Chests only — a rarer spawn.",
    [{ v: "normal" }, { v: "gold" }, { v: "gummy" }, { v: "galaxy" }, { v: "cube" }]),
  S("punk", "Punk", "🎸", "legendary",
    "Chance of infinite ammo.",
    "Chests only — a rarer spawn.",
    [{ v: "normal" }, { v: "gold" }, { v: "gummy" }, { v: "galaxy" }, { v: "gem", u: true }, { v: "cube" }]),
  S("boss", "Boss", "💪", "legendary",
    "Boosts your maximum Health and Shield.",
    "Drops from any Boss you defeat.",
    [{ v: "normal" }, { v: "gold" }, { v: "gummy" }, { v: "galaxy" }, { v: "cube" }]),
  S("seven", "Seven", "🛰️", "legendary",
    "Makes enemy footsteps visible to your whole squad.",
    "Sprite Chests in unranked BR and Zero Build.",
    [{ v: "normal" }, { v: "gold" }, { v: "gummy" }, { v: "galaxy" }, { v: "holofoil" }]),
  S("peely", "Peeky Peely", "🍌", "legendary",
    "Marks rare sprite variants and their carriers nearby — but reveals you too.",
    "High ground — mountainous areas.",
    [{ v: "normal" }, { v: "gold" }, { v: "gummy" }, { v: "galaxy" }, { v: "holofoil" }]),
  S("llama", "Lootin' Llama", "🦙", "legendary",
    "Chance of a weapon upgrade when you open an ammo box.",
    "Relic Chests; Sprite/Rare Chests at Golden Grove and Calamari Canyon.",
    [{ v: "normal" }, { v: "gold" }, { v: "gummy" }, { v: "galaxy" }, { v: "gem" }]),
  S("batman", "Batman", "🦇", "mythic",
    "Bat Cape glide, and better odds of rare Sprites in chests.",
    "Beat Catwoman / Harley / Poison Ivy NPCs, DC quests, or Sprite Chests.",
    [{ v: "normal" }, { v: "gold" }, { v: "gummy" }, { v: "galaxy" }, { v: "holofoil" }, { v: "cube" }]),
  S("grimreaper", "Grim Reaper", "💀", "mythic",
    "Anyone who attacks you gets marked.",
    "Chests across the map.",
    [{ v: "normal" }, { v: "gold" }, { v: "gummy" }, { v: "galaxy" }, { v: "gem", u: true }, { v: "holofoil" }, { v: "cube" }]),
  S("zeropoint", "Zero Point", "🔷", "mythic",
    "Spawns a Shield Bubble Jr. when you self-heal.",
    "Vault / keycard Sprite Chests — the rarest spawn.",
    [{ v: "normal" }, { v: "gold" }, { v: "gummy" }, { v: "galaxy" }, { v: "gem", u: true }, { v: "holofoil" }, { v: "cube" }, { v: "quack" }]),
  S("burntpeanut", "Burnt Peanut", "🥜", "mythic",
    "Chance of extra loot on eliminations; mythic loot when maxed.",
    "Relic Chests (~1.5% chance).",
    [{ v: "normal" }]),
  S("vinijr", "Vini Jr.", "🇧🇷", "mythic",
    "Sprint slidekick that damages enemies and boosts fire rate + reload.",
    "Sprite Chests and Rare Chests.",
    [{ v: "normal" }]),
  S("pollo", "Pollo", "🐔", "mythic",
    "Squad regenerates shields after an elimination.",
    "Sprite Chests and Rare Chests — or trade for it.",
    [{ v: "normal" }]),
  S("johnwick", "John Wick", "🕴️", "mythic",
    "Reveals nearby enemies after you knock or eliminate a player.",
    "The Simpsons Reload map — carries over to Battle Royale.",
    [{ v: "normal" }]),
  S("ironmouse", "Ironmouse", "🐭", "mythic",
    "Not yet revealed.",
    "Not yet available.",
    [{ v: "normal", u: true }]),
];

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
      label: vv.v === "normal" ? s.name : `${variant.name} ${s.name}`,
    };
  })
);

export const ENTRY_INDEX = new Map(ENTRIES.map((e, i) => [e.id, i]));
export const RELEASED_ENTRIES = ENTRIES.filter((e) => e.released);

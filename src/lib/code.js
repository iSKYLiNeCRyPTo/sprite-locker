// Share codes: SPR1|<dataset version>|<base64url bitfield>
// Bit i corresponds to ENTRIES[i] in fixed dataset order.
import { ENTRIES, DATASET_VERSION } from "../data/sprites.js";

const B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

function bytesToB64url(bytes) {
  let out = "";
  for (let i = 0; i < bytes.length; i += 3) {
    const a = bytes[i];
    const b = i + 1 < bytes.length ? bytes[i + 1] : 0;
    const c = i + 2 < bytes.length ? bytes[i + 2] : 0;
    out += B64[a >> 2] + B64[((a & 3) << 4) | (b >> 4)];
    if (i + 1 < bytes.length) out += B64[((b & 15) << 2) | (c >> 6)];
    if (i + 2 < bytes.length) out += B64[c & 63];
  }
  return out;
}

function b64urlToBytes(str) {
  const idx = new Map([...B64].map((ch, i) => [ch, i]));
  const bits = [];
  for (const ch of str) {
    const v = idx.get(ch);
    if (v === undefined) throw new Error("bad char");
    bits.push(v);
  }
  const bytes = [];
  for (let i = 0; i < bits.length; i += 4) {
    const a = bits[i], b = bits[i + 1], c = bits[i + 2], d = bits[i + 3];
    if (b === undefined) break;
    bytes.push(((a << 2) | (b >> 4)) & 255);
    if (c !== undefined) bytes.push(((b << 4) | (c >> 2)) & 255);
    if (d !== undefined) bytes.push(((c << 6) | d) & 255);
  }
  return new Uint8Array(bytes);
}

export function encodeCollection(ownedSet) {
  const bytes = new Uint8Array(Math.ceil(ENTRIES.length / 8));
  ENTRIES.forEach((e, i) => {
    if (ownedSet.has(e.id)) bytes[i >> 3] |= 1 << (i & 7);
  });
  return `SPR1|${DATASET_VERSION}|${bytesToB64url(bytes)}`;
}

// Returns { owned:Set<entryId>, versionMismatch:boolean } or throws on garbage.
export function decodeCollection(code) {
  const parts = String(code).trim().split("|");
  if (parts.length !== 3 || parts[0] !== "SPR1") throw new Error("Not a Sprite Locker code");
  const [, version, payload] = parts;
  const bytes = b64urlToBytes(payload);
  const owned = new Set();
  ENTRIES.forEach((e, i) => {
    if (i >> 3 < bytes.length && (bytes[i >> 3] >> (i & 7)) & 1) owned.add(e.id);
  });
  return { owned, versionMismatch: version !== DATASET_VERSION, version };
}

// GRASP Protected Variations: repair ownership and costs stay in upgrade definitions.
export const upgrades = [
  {
    id: "pond", guardian: "Ripplefin", symbol: "water", name: "Repair Pond",
    color: "#55c6e1", softColor: "#dffaff", focus: { x: 414, y: 548 },
    story: "Fresh water rushes into the old pond. Fish return, reeds stand tall, and Ripplefin's blue light dances across every ripple.",
    cost: { "Water Seal": 1 }
  },
  {
    id: "garden", guardian: "HeartBloom", symbol: "bloom", name: "Repair Garden",
    color: "#ee87ad", softColor: "#ffe6ef", focus: { x: 660, y: 555 },
    story: "HeartBloom wakes the sleeping garden. Flowers open, vines climb a rose arch, and pollinators flutter between the petals.",
    cost: { "Bloom Bundle": 1 }
  },
  {
    id: "path", guardian: "PebbleBack", symbol: "stone", name: "Repair Stone Path",
    color: "#b58a58", softColor: "#f2dfbf", focus: { x: 545, y: 438 },
    story: "PebbleBack fits every stone into place. Fossil markers and tiny crystals now guide guardians safely toward the shrine.",
    cost: { "Stone Core": 1 }
  },
  {
    id: "shrine", guardian: "ZapScale", symbol: "spark", name: "Restore Shrine",
    color: "#f3d84f", softColor: "#fff4b7", focus: { x: 550, y: 335 },
    story: "Six elemental lights circle the restored shrine. Its center stone shines again, bringing every guardian's color into harmony.",
    cost: { "Storm Battery": 1, "Sky Charm": 1, "Ember Lantern": 1 }
  },
  {
    id: "library", guardian: "Nimbus Coil", symbol: "story", name: "Build Storybook Library",
    color: "#8bcce9", softColor: "#e8f8ff", focus: { x: 710, y: 370 },
    story: "A cozy book nook rises beside the shrine. A gentle breeze turns glowing pages so every discovered lesson can be read again.",
    cost: { "Storybook Ink": 1 }
  }
];

export const upgradeById = Object.fromEntries(upgrades.map((upgrade) => [upgrade.id, upgrade]));

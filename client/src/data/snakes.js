const guardianAsset = (name) => `/guardians/${name}.png`;

// GRASP Protected Variations: gameplay, UI, and rendering consume one guardian definition.
export const snakes = {
  Ripplefin: {
    element: "Water", elementKey: "water", ability: "Water Surge", harvestAction: "Water Surge", abilityType: "collect", evolution: "Fallspring",
    color: 0x4da9d7, accent: 0xc8f2ef, cream: 0xf5ead4, speed: 225, detail: "fin",
    spriteKey: "guardian-ripplefin", evolvedSpriteKey: "guardian-fallspring",
    sprite: guardianAsset("ripplefin"), evolvedSprite: guardianAsset("fallspring"),
    theme: { primary: "#36aee8", soft: "#dff8ff", ink: "#165f83" },
    personality: "Gentle, curious, and happiest near moving water.",
    lesson: "Healthy rivers connect many habitats and carry fresh water downstream."
  },
  "Nimbus Coil": {
    element: "Air", elementKey: "air", ability: "Gust Dash", harvestAction: "Wind Pull", abilityType: "dash", evolution: "Whirlscale",
    color: 0x8fc8df, accent: 0xf8fcf3, cream: 0xeef1e8, speed: 245, detail: "cloud", dashDistance: 115,
    spriteKey: "guardian-nimbus-coil", evolvedSpriteKey: "guardian-whirlscale",
    sprite: guardianAsset("nimbus-coil"), evolvedSprite: guardianAsset("whirlscale"),
    theme: { primary: "#78bde4", soft: "#eef8ff", ink: "#436f9b" },
    personality: "Playful and quick, with a crown shaped like a tiny breeze.",
    lesson: "Wind moves clouds, weather, pollen, and seeds."
  },
  PebbleBack: {
    element: "Earth", elementKey: "earth", ability: "Stone Shield", harvestAction: "Burrow Break", abilityType: "collect", evolution: "Bouldercoil",
    color: 0x9c7751, accent: 0xd5b98d, cream: 0xd8c4a4, speed: 200, detail: "rocks",
    spriteKey: "guardian-pebbleback", evolvedSpriteKey: "guardian-bouldercoil",
    sprite: guardianAsset("pebbleback"), evolvedSprite: guardianAsset("bouldercoil"),
    theme: { primary: "#a77845", soft: "#f3dfbd", ink: "#674524" },
    personality: "Patient, steady, and always listening to old stones.",
    lesson: "Rocks and fossils preserve clues about Earth's long history."
  },
  Emberling: {
    element: "Fire", elementKey: "fire", ability: "Burn Clear", harvestAction: "Burn Clear", abilityType: "collect", evolution: "Blazetail",
    color: 0xe96f32, accent: 0xffc14f, cream: 0xf7ead8, speed: 230, detail: "flame",
    spriteKey: "guardian-emberling", evolvedSpriteKey: "guardian-blazetail",
    sprite: guardianAsset("emberling"), evolvedSprite: guardianAsset("blazetail"),
    theme: { primary: "#f37b25", soft: "#fff0c8", ink: "#9b3e18" },
    personality: "Brave and warm-hearted, never careless with a spark.",
    lesson: "Some ecosystems regrow after fire when soil and seeds survive."
  },
  ZapScale: {
    element: "Lightning", elementKey: "lightning", ability: "Thunder Blink", harvestAction: "Charge Node", abilityType: "dash", evolution: "Voltcoil",
    color: 0xe5b629, accent: 0xfff08a, cream: 0xf5df79, speed: 260, detail: "bolt", dashDistance: 155,
    spriteKey: "guardian-zapscale", evolvedSpriteKey: "guardian-voltcoil",
    sprite: guardianAsset("zapscale"), evolvedSprite: guardianAsset("voltcoil"),
    theme: { primary: "#f2c514", soft: "#fff6b3", ink: "#735a08" },
    personality: "Bold, bright, and fascinated by every ancient machine.",
    lesson: "Electric current flows when a circuit forms a complete path."
  },
  HeartBloom: {
    element: "Nature", elementKey: "nature", ability: "Healing Bloom", harvestAction: "Healing Bloom", abilityType: "collect", evolution: "Rosetail",
    color: 0xca7185, accent: 0xf3b2be, cream: 0xded9ca, speed: 220, detail: "flower",
    spriteKey: "guardian-heartbloom", evolvedSpriteKey: "guardian-rosetail",
    sprite: guardianAsset("heartbloom"), evolvedSprite: guardianAsset("rosetail"),
    theme: { primary: "#e77fa4", soft: "#ffe4ef", ink: "#8c3f61" },
    personality: "Kind and encouraging, leaving little blossoms wherever she rests.",
    lesson: "Pollinators help flowering plants make fruits and seeds."
  }
};

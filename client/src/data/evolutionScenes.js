// GRASP Protected Variations: each evolution's story, lesson, and requirements are data.
export const evolutionScenes = [
  {
    guardian: "Ripplefin",
    evolution: "Fallspring",
    kind: "water",
    challengeId: "river-flow-restoration",
    challengeName: "Restore the River's Flow",
    craftedItem: "Water Seal",
    craftedAmount: 1,
    story: "Ripplefin feels every restored stream joining the Sanctuary pond. Water moves through rivers, clouds, plants, animals, and people, carrying life wherever it travels.",
    lesson: "The water cycle connects ecosystems through evaporation, condensation, precipitation, and collection."
  },
  {
    guardian: "Nimbus Coil",
    evolution: "Whirlscale",
    kind: "air",
    challengeId: "cloud-guidance",
    challengeName: "Guide the Traveling Clouds",
    craftedItem: "Sky Charm",
    craftedAmount: 1,
    story: "Nimbus Coil rises on a bright spiral of air. Wind carries clouds, seeds, pollen, and weather across the sky, helping water and living things reach new places.",
    lesson: "Air movement shapes weather and helps life spread."
  },
  {
    guardian: "PebbleBack",
    evolution: "Bouldercoil",
    kind: "earth",
    challengeId: "cave-bridge-rebuild",
    challengeName: "Rebuild the Cave Bridge",
    craftedItem: "Stone Core",
    craftedAmount: 1,
    story: "PebbleBack listens as the rebuilt bridge hums with ancient memories. Stones, soil, minerals, and fossils hold clues from Earth's long and changing history.",
    lesson: "Rocks and fossils teach us about the past."
  },
  {
    guardian: "Emberling",
    evolution: "Blazetail",
    kind: "fire",
    challengeId: "ash-sprout-protection",
    challengeName: "Protect the New Sprouts",
    craftedItem: "Ember Lantern",
    craftedAmount: 1,
    story: "Emberling's careful lantern glows beside the protected sprouts. Fire must be respected, but safe warmth and nutrient-rich ash can sometimes help new growth begin.",
    lesson: "Safe fire practices protect life, and some ecosystems can regrow after fire."
  },
  {
    guardian: "ZapScale",
    evolution: "Voltcoil",
    kind: "lightning",
    challengeId: "storm-circuit",
    challengeName: "Complete the Storm Circuit",
    craftedItem: "Storm Battery",
    craftedAmount: 1,
    story: "ZapScale watches golden light travel through every restored storm node. Energy can move, change form, and be stored, but electricity flows only when its path is complete.",
    lesson: "Circuits need complete connections."
  },
  {
    guardian: "HeartBloom",
    evolution: "Rosetail",
    kind: "nature",
    challengeId: "garden-bloom-restoration",
    challengeName: "Wake the Wilted Flowers",
    craftedItem: "Bloom Bundle",
    craftedAmount: 1,
    story: "HeartBloom hears the restored garden buzzing with life. Flowers feed pollinators, pollinators carry pollen, and fertilized flowers can grow the seeds of a new generation.",
    lesson: "Pollination helps plants reproduce."
  }
];

export const evolutionSceneByGuardian = Object.fromEntries(
  evolutionScenes.map((scene) => [scene.guardian, scene])
);

export const EVOLUTION_GROWTH_MESSAGE = "Growth comes from helping the world around you.";

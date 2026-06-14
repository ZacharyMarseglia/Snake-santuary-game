// GRASP Protected Variations: habitat content and unlock sources are data, not renderer branches.
export const habitats = [
  {
    id: "ripplefin-pond-cave",
    guardian: "Ripplefin",
    name: "Pond Cave",
    kind: "water",
    x: 390,
    y: 168,
    radius: 88,
    challengeId: "river-flow-restoration",
    targetCount: 3,
    upgradeIds: ["pond"],
    unlockHint: "Restore the River Path or repair the Sanctuary pond.",
    lore: "Ripplefin listens to every tiny ripple here. The pond cave remembers the path water takes home.",
    facts: [
      "Wetlands can filter water and soften floods.",
      "River reeds shelter fish, insects, and young animals.",
      "Moving water carries nutrients through an ecosystem."
    ]
  },
  {
    id: "nimbus-cloud-perch",
    guardian: "Nimbus Coil",
    name: "Cloud Perch",
    kind: "air",
    x: 735,
    y: 160,
    radius: 88,
    challengeId: "cloud-guidance",
    targetCount: 3,
    upgradeIds: ["library"],
    unlockHint: "Guide the clouds or build the Storybook Library.",
    lore: "Nimbus Coil curls into the softest cloud and sends page-turning breezes through the Sanctuary.",
    facts: [
      "Clouds are made of tiny water droplets or ice crystals.",
      "Wind can move clouds, pollen, and seeds.",
      "Differences in air pressure help create wind."
    ]
  },
  {
    id: "pebbleback-stone-den",
    guardian: "PebbleBack",
    name: "Stone Den",
    kind: "earth",
    x: 865,
    y: 570,
    radius: 88,
    challengeId: "cave-bridge-rebuild",
    targetCount: 3,
    upgradeIds: ["path"],
    unlockHint: "Rebuild the cave bridge or repair the stone path.",
    lore: "PebbleBack keeps a careful collection of stones, crystals, and fossils that tell the Sanctuary's oldest stories.",
    facts: [
      "Fossils are clues about life from long ago.",
      "Rocks and minerals form over very long periods.",
      "Strong stone shapes can support paths and bridges."
    ]
  },
  {
    id: "emberling-ember-nest",
    guardian: "Emberling",
    name: "Ember Nest",
    kind: "fire",
    x: 690,
    y: 620,
    radius: 82,
    challengeId: "ash-sprout-protection",
    targetCount: 3,
    upgradeIds: ["shrine"],
    unlockHint: "Protect the Ash Field sprouts or restore the elemental shrine.",
    lore: "Emberling tends safe lanterns beside new green sprouts, proving that careful warmth can protect growing life.",
    facts: [
      "Fire needs heat, fuel, and oxygen.",
      "Fire must always be handled carefully and safely.",
      "Some ecosystems can regrow from surviving roots and seeds."
    ]
  },
  {
    id: "zapscale-storm-tower",
    guardian: "ZapScale",
    name: "Storm Tower",
    kind: "lightning",
    x: 225,
    y: 570,
    radius: 86,
    challengeId: "storm-circuit",
    targetCount: 4,
    upgradeIds: ["shrine"],
    unlockHint: "Complete the Storm Gate circuit or restore the elemental shrine.",
    lore: "ZapScale keeps the tower's glowing lines connected so every spark follows a safe and complete path.",
    facts: [
      "Lightning is electricity in nature.",
      "A circuit needs a complete path to work.",
      "Batteries store energy for later use."
    ]
  },
  {
    id: "heartbloom-flower-room",
    guardian: "HeartBloom",
    name: "Flower Garden Room",
    kind: "nature",
    x: 255,
    y: 250,
    radius: 88,
    challengeId: "garden-bloom-restoration",
    targetCount: 5,
    upgradeIds: ["garden"],
    unlockHint: "Wake the Forest Garden flowers or repair the Sanctuary garden.",
    lore: "HeartBloom's vines make a gentle room where bees, butterflies, and flowers all help one another grow.",
    facts: [
      "Pollinators help many plants make seeds.",
      "Flowers offer nectar and pollen to visiting animals.",
      "Biodiversity means many kinds of living things work together."
    ]
  }
];

export const habitatByGuardian = Object.fromEntries(
  habitats.map((habitat) => [habitat.guardian, habitat])
);

export function createDefaultHabitatStates() {
  return Object.fromEntries(
    habitats.map((habitat) => [habitat.guardian, { unlocked: false }])
  );
}

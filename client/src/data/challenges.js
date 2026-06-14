// GRASP Protected Variations: new restoration challenges are added as data.
export const challenges = [
  {
    id: "river-flow-restoration",
    areaId: "river",
    storyName: "River Path",
    guardian: "Ripplefin",
    title: "Restore the River's Flow",
    objective: "Unblock 3 stream points using Water Surge.",
    action: "Water Surge",
    targetName: "stream point",
    kind: "stream",
    startStory: "Ripplefin hears three places where branches and stones have slowed the stream. Clear them gently so water and nutrients can travel downstream again.",
    lesson: "Flowing rivers carry water and nutrients between habitats.",
    successStory: "The three stream points sparkle together. Fresh water carries nutrients past reeds, stones, fish, and thirsty riverbank plants.",
    reward: { "Clean Water": 2, "River Reed": 1 },
    targets: [
      { id: "upper-stream", label: "Upper stream blockage", x: 500, y: 145 },
      { id: "middle-stream", label: "Middle stream blockage", x: 540, y: 350 },
      { id: "lower-stream", label: "Lower stream blockage", x: 585, y: 555 }
    ]
  },
  {
    id: "cloud-guidance",
    areaId: "cloud",
    storyName: "Cloud Hills",
    guardian: "Nimbus Coil",
    title: "Guide the Traveling Clouds",
    objective: "Guide 3 clouds to dry areas using Wind Pull.",
    action: "Wind Pull",
    targetName: "cloud",
    kind: "cloud",
    startStory: "Nimbus Coil spots three rain clouds drifting away from dry cloud gardens. Use the wind to guide each cloud where its water is needed.",
    lesson: "Wind moves clouds, seeds, pollen, and weather from place to place.",
    successStory: "Soft rain reaches every dry island. Nimbus Coil watches seeds and tiny leaves ride the same helpful breeze.",
    reward: { "Cloud Fluff": 2, "Sky Droplet": 1 },
    targets: [
      { id: "west-cloud", label: "West wandering cloud", x: 315, y: 255 },
      { id: "high-cloud", label: "High wandering cloud", x: 675, y: 245 },
      { id: "east-cloud", label: "East wandering cloud", x: 890, y: 430 }
    ]
  },
  {
    id: "cave-bridge-rebuild",
    areaId: "stone",
    storyName: "Stone Cave",
    guardian: "PebbleBack",
    title: "Rebuild the Cave Bridge",
    objective: "Reveal and place 3 sturdy bridge stones using Burrow Break.",
    action: "Burrow Break",
    targetName: "bridge stone",
    kind: "bridge",
    startStory: "A small cave bridge has lost three support stones. PebbleBack can reveal strong rock and fit each piece into the broken crossing.",
    lesson: "Rocks and minerals can form stable landforms when their shapes and strength support one another.",
    successStory: "The bridge stands firm again. PebbleBack taps each stone and explains how strong shapes spread weight across the crossing.",
    reward: { Pebbles: 2, "Crystal Shard": 1 },
    targets: [
      { id: "bridge-west", label: "West bridge support", x: 450, y: 390 },
      { id: "bridge-center", label: "Center bridge support", x: 565, y: 390 },
      { id: "bridge-east", label: "East bridge support", x: 680, y: 390 }
    ]
  },
  {
    id: "ash-sprout-protection",
    areaId: "ash",
    storyName: "Ash Field",
    guardian: "Emberling",
    title: "Protect the New Sprouts",
    objective: "Clear dead brush safely around 3 sprouts using Burn Clear.",
    action: "Burn Clear",
    targetName: "sprout",
    kind: "sprout",
    startStory: "Three green sprouts are growing beside dry, dead brush. Emberling must use careful, controlled warmth to clear space without harming new life.",
    lesson: "Fire can be dangerous, but surviving roots and seeds can help an ecosystem regrow.",
    successStory: "All three sprouts have safe growing space. Emberling smiles as ash returns nutrients to the soil and fresh leaves reach toward the light.",
    reward: { "Ash Dust": 2, "Heat Flower": 1 },
    targets: [
      { id: "north-sprout", label: "North sheltered sprout", x: 360, y: 220 },
      { id: "center-sprout", label: "Center sheltered sprout", x: 650, y: 365 },
      { id: "south-sprout", label: "South sheltered sprout", x: 845, y: 535 }
    ]
  },
  {
    id: "storm-circuit",
    areaId: "storm",
    storyName: "Storm Gate",
    guardian: "ZapScale",
    title: "Complete the Storm Circuit",
    objective: "Connect 4 storm nodes in order using Charge Node.",
    action: "Charge Node",
    targetName: "storm node",
    kind: "node",
    ordered: true,
    startStory: "Four numbered storm nodes lead toward the ancient gate. ZapScale must charge them in order so electricity has one complete path.",
    lesson: "Electric current flows when a circuit forms a complete path.",
    successStory: "A golden line joins every node from one to four. The completed circuit carries energy safely to the Storm Gate.",
    reward: { "Spark Stone": 2, "Charged Crystal": 1 },
    targets: [
      { id: "node-one", label: "Storm node 1", x: 285, y: 205, order: 1 },
      { id: "node-two", label: "Storm node 2", x: 475, y: 405, order: 2 },
      { id: "node-three", label: "Storm node 3", x: 680, y: 235, order: 3 },
      { id: "node-four", label: "Storm node 4", x: 835, y: 455, order: 4 }
    ]
  },
  {
    id: "garden-bloom-restoration",
    areaId: "forest",
    storyName: "Forest Garden",
    guardian: "HeartBloom",
    title: "Wake the Wilted Flowers",
    objective: "Bloom 5 wilted flowers using Healing Bloom.",
    action: "Healing Bloom",
    targetName: "wilted flower",
    kind: "flower",
    startStory: "Five flowers are too wilted to offer nectar and pollen. HeartBloom can help them recover so pollinators return to the garden.",
    lesson: "Pollinators carry pollen between flowers, helping many plants make seeds.",
    successStory: "Five bright flowers open together. Bees and butterflies return for nectar, carrying pollen that helps the garden make new seeds.",
    reward: { "Heart Petals": 2, Seeds: 1 },
    targets: [
      { id: "rose-bed", label: "Wilted rose bed", x: 300, y: 205 },
      { id: "sunny-bed", label: "Wilted sunny bed", x: 510, y: 175 },
      { id: "pond-bed", label: "Wilted pond bed", x: 765, y: 245 },
      { id: "arch-bed", label: "Wilted arch bed", x: 385, y: 515 },
      { id: "meadow-bed", label: "Wilted meadow bed", x: 825, y: 520 }
    ]
  }
];

export const challengeById = Object.fromEntries(
  challenges.map((challenge) => [challenge.id, challenge])
);

export const challengeByAreaId = Object.fromEntries(
  challenges.map((challenge) => [challenge.areaId, challenge])
);

export const challengeByStoryName = Object.fromEntries(
  challenges.map((challenge) => [challenge.storyName, challenge])
);

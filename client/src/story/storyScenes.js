// GRASP Information Expert: chapter copy and presentation metadata live together.
export const storyScenes = [
  {
    name: "Broken Sanctuary",
    guardian: "Ripplefin",
    title: "A Home Out of Balance",
    art: "/story/broken-sanctuary.jpg",
    story: "The guardians return to a sanctuary of sleeping stones. Its pond is dry, its garden is quiet, and the old purple gate has forgotten its glow.",
    lesson: "An ecosystem is a community of living things and their environment. Water, soil, plants, animals, weather, and energy all work together."
  },
  {
    name: "Forest Garden",
    guardian: "HeartBloom",
    title: "The Pollinator Promise",
    art: "/story/forest-garden.jpg",
    story: "HeartBloom follows a trail of fading petals and discovers a garden waiting for bees, butterflies, and one brave new beginning.",
    lesson: "Bees, butterflies, and other pollinators carry pollen between flowers. This helps many plants make fruits and seeds."
  },
  {
    name: "River Path",
    guardian: "Ripplefin",
    title: "The River's Journey",
    art: "/story/restored-guardians.jpg",
    story: "Ripplefin hears water beneath the stones and follows its song until the blocked river begins to shimmer again.",
    lesson: "Rivers move fresh water and nutrients through habitats. Healthy riverbanks also shelter wildlife and reduce erosion."
  },
  {
    name: "Cloud Hills",
    guardian: "Nimbus Coil",
    title: "How Clouds Travel",
    art: "/story/cloud-hills.jpg",
    story: "Nimbus Coil races the wind over silver-green hills, guiding heavy clouds toward the thirsty sanctuary.",
    lesson: "Clouds form when water vapor cools into tiny droplets. Wind moves clouds and helps carry weather across the land."
  },
  {
    name: "Stone Cave",
    guardian: "PebbleBack",
    title: "Stories Written in Stone",
    art: "/story/guardians-cover.jpg",
    story: "PebbleBack reads rings, cracks, and fossils like pages in an ancient book hidden beneath the hills.",
    lesson: "Rocks change through melting, cooling, pressure, and erosion. Fossils can preserve clues about life from long ago."
  },
  {
    name: "Ash Field",
    guardian: "Emberling",
    title: "New Life After Fire",
    art: "/story/ash-field.jpg",
    story: "Emberling finds green sprouts among the charcoal and learns that careful warmth can make room for a forest to return.",
    lesson: "Wildfire can harm habitats, but some plants survive or need heat to release seeds. Careful regrowth restores shelter and food."
  },
  {
    name: "Storm Gate",
    guardian: "ZapScale",
    title: "A Complete Circuit",
    art: "/story/guardians-cover.jpg",
    story: "ZapScale circles the silent gate, joining one glowing rune to the next until the sanctuary hums with energy.",
    lesson: "Electric current needs a complete circuit. When the path closes, energy can move and power lights or machines."
  }
];

export const storySceneByBiome = Object.fromEntries(
  storyScenes.map((scene) => [scene.name, scene])
);

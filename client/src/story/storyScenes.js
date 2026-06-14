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
    story: "HeartBloom follows a trail of fading petals to a garden waiting for bees and butterflies. \"A garden is a team,\" she says. \"Sunlight, water, soil, air, flowers, and pollinators all help one another.\" As Healing Bloom wakes each flower, nectar feeds visiting pollinators and pollen travels from bloom to bloom.",
    lesson: "Pollinators help many flowering plants make fruits and seeds. Biodiversity means many different living things share an ecosystem and support one another."
  },
  {
    name: "River Path",
    guardian: "Ripplefin",
    title: "The River's Journey",
    art: "/story/restored-guardians.jpg",
    story: "Ripplefin hears water beneath the stones and follows its song until the river shimmers again. \"Water is always traveling,\" she explains. \"It evaporates into the air, condenses into clouds, falls as precipitation, and collects in rivers and oceans.\" Her Water Surge guides the current past reeds and smooth stones.",
    lesson: "Rivers carry water and nutrients through habitats. Wetlands filter water and reduce flooding, while moving water slowly shapes land through erosion."
  },
  {
    name: "Cloud Hills",
    guardian: "Nimbus Coil",
    title: "How Clouds Travel",
    art: "/story/cloud-hills.jpg",
    story: "Nimbus Coil races over the silver-green hills and gathers mist with Wind Pull. \"Clouds may look fluffy, but they are made of tiny water droplets or ice crystals,\" he says. Differences in air pressure set the breeze moving, carrying clouds toward the thirsty sanctuary.",
    lesson: "Wind moves clouds, weather, seeds, and pollen. Plants and animals also depend on clean air."
  },
  {
    name: "Stone Cave",
    guardian: "PebbleBack",
    title: "Stories Written in Stone",
    art: "/story/guardians-cover.jpg",
    story: "PebbleBack reads rings, cracks, crystals, and fossils like pages in an ancient book. \"Stone stories take a long time to form,\" she says while Burrow Break reveals a fossil chip. Nearby, old rock particles mix with water, air, and decayed leaves to begin making soil.",
    lesson: "Soil contains minerals, organic matter, water, and air. Rocks and minerals form over long periods, and fossils preserve clues about life from the past."
  },
  {
    name: "Ash Field",
    guardian: "Emberling",
    title: "New Life After Fire",
    art: "/story/ash-field.jpg",
    story: "Emberling finds green sprouts among the charcoal and clears dead brush with careful warmth. \"Fire needs heat, fuel, and oxygen,\" he says. \"It is powerful, so we always treat it safely.\" Beneath the ash, surviving roots and seeds are ready to grow.",
    lesson: "Fire can be dangerous, but some ecosystems regrow after natural fire. Ash can return nutrients to soil, and some plants use heat as a signal to release seeds."
  },
  {
    name: "Storm Gate",
    guardian: "ZapScale",
    title: "A Complete Circuit",
    art: "/story/guardians-cover.jpg",
    story: "ZapScale circles the silent gate, joining one glowing rune to the next. \"Lightning is electricity in nature,\" she says. \"Here, every circuit needs a complete path.\" Charge Node fills the final gap, and stored energy wakes the ancient gate.",
    lesson: "Energy can move, change form, and be stored. Batteries save energy for later, while a complete circuit lets electric current flow."
  }
];

export const storySceneByBiome = Object.fromEntries(
  storyScenes.map((scene) => [scene.name, scene])
);

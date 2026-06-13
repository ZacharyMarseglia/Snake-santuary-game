// GRASP Protected Variations: new recipes can be added without changing crafting logic or UI.
export const recipes = [
  {
    id: "water-seal",
    name: "Water Seal",
    guardian: "Ripplefin",
    symbol: "water",
    output: { "Water Seal": 1 },
    ingredients: { "Clean Water": 3, "River Reed": 2, "Blue Petal": 1 },
    story: "Ripplefin creates a flowing seal that guides clean water back into the sanctuary pond.",
    lesson: "Wetland plants slow moving water, hold soil in place, and create shelter for small animals."
  },
  {
    id: "bloom-bundle",
    name: "Bloom Bundle",
    guardian: "HeartBloom",
    symbol: "bloom",
    output: { "Bloom Bundle": 1 },
    ingredients: { Seeds: 3, "Heart Petals": 2, "Nectar Drop": 1, "Pollen Dust": 1 },
    story: "HeartBloom wakes the sleeping soil with a bundle of seeds, petals, nectar, and pollen.",
    lesson: "Seeds need the right mix of water, warmth, air, and healthy soil before they can sprout."
  },
  {
    id: "stone-core",
    name: "Stone Core",
    guardian: "PebbleBack",
    symbol: "stone",
    output: { "Stone Core": 1 },
    ingredients: { Pebbles: 4, Clay: 2, "Fossil Chip": 1, "Crystal Shard": 1 },
    story: "PebbleBack presses stones, clay, a fossil, and crystal into a sturdy core for the cracked path.",
    lesson: "Builders combine materials with different strengths. Clay binds while stones provide a firm structure."
  },
  {
    id: "ember-lantern",
    name: "Ember Lantern",
    guardian: "Emberling",
    symbol: "flame",
    output: { "Ember Lantern": 1 },
    ingredients: { "Ash Dust": 2, "Charcoal Bark": 2, "Ember Stone": 1, "Heat Flower": 1 },
    story: "Emberling creates a lantern that holds gentle, safe warmth without letting the flame spread.",
    lesson: "Fire needs heat, fuel, and oxygen. Containing fuel helps people use fire more safely."
  },
  {
    id: "storm-battery",
    name: "Storm Battery",
    guardian: "ZapScale",
    symbol: "spark",
    output: { "Storm Battery": 1 },
    ingredients: { "Spark Stone": 2, "Charged Crystal": 1, "Metal Scrap": 2, "Static Wisp": 1 },
    story: "ZapScale completes a storm battery by joining conductive metal into a closed energy circuit.",
    lesson: "A circuit needs a complete path. Conductive materials let electric charge move through that path."
  },
  {
    id: "sky-charm",
    name: "Sky Charm",
    guardian: "Nimbus Coil",
    symbol: "air",
    output: { "Sky Charm": 1 },
    ingredients: { "Cloud Fluff": 2, "Wind Wisp": 2, "Sky Droplet": 1, "Feather Leaf": 1 },
    story: "Nimbus Coil knots cloud, wind, water, and a feather-light leaf into a charm that keeps air moving.",
    lesson: "Moving air carries water vapor, pollen, seeds, and weather from one habitat to another."
  },
  {
    id: "storybook-ink",
    name: "Storybook Ink",
    guardian: "Nimbus Coil",
    guardianLabel: "All Guardians",
    supportingGuardians: ["Ripplefin", "PebbleBack", "Emberling", "ZapScale", "HeartBloom"],
    symbol: "story",
    output: { "Storybook Ink": 1 },
    ingredients: {
      "Clean Water": 1,
      "Cloud Fluff": 1,
      Pebbles: 1,
      "Ash Dust": 1,
      "Spark Stone": 1,
      "Heart Petals": 1
    },
    story: "The six guardians blend one memory from every biome into ink that preserves their discoveries.",
    lesson: "Scientists keep records so observations can be compared, shared, and used for future learning."
  }
];

export const recipeById = Object.fromEntries(recipes.map((recipe) => [recipe.id, recipe]));
export const craftedItemNames = recipes.flatMap((recipe) => Object.keys(recipe.output));
export const recipeIds = recipes.map((recipe) => recipe.id);

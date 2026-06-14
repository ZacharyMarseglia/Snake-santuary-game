// GRASP Protected Variations: educational copy, quizzes, and rewards are data-driven.
export const elementLessons = [
  {
    id: "water",
    element: "Water",
    guardian: "Ripplefin",
    quote: "Water is always traveling. It rises into clouds, falls as rain, and gathers in rivers like this one.",
    role: "Water connects habitats, carries nutrients, helps living things survive, and slowly shapes the land.",
    facts: [
      "The water cycle moves water through evaporation, condensation, precipitation, and collection.",
      "Rivers carry nutrients and provide homes and drinking water for plants and animals.",
      "Wetlands filter water, hold extra rain, and can reduce flooding."
    ],
    example: "Rainwater can collect in a stream, flow into a river, and eventually reach the ocean.",
    question: "What moves water from clouds back to the ground?",
    answer: "Rain or other precipitation",
    resources: ["Clean Water", "River Reed", "Smooth Stone", "Blue Petal"],
    didYouKnow: "Even gentle moving water can slowly wear away rock. That land-shaping process is called erosion."
  },
  {
    id: "air",
    element: "Air",
    guardian: "Nimbus Coil",
    quote: "A breeze may feel invisible, but look closely. It carries clouds, seeds, pollen, and weather wherever it dances.",
    role: "Air surrounds Earth, supports living things, moves weather, and carries tiny travelers between habitats.",
    facts: [
      "Clouds are made of tiny water droplets or ice crystals floating in the air.",
      "Air moves from areas of higher pressure toward areas of lower pressure, creating wind.",
      "Wind can move clouds, seeds, pollen, and weather."
    ],
    example: "A dandelion seed can ride the wind to a new patch of soil where it may grow.",
    question: "Name one thing wind can move.",
    answer: "Seeds, clouds, pollen, or weather",
    resources: ["Cloud Fluff", "Wind Wisp", "Sky Droplet", "Feather Leaf"],
    didYouKnow: "Plants and animals depend on clean air, even though most of the gases in air are invisible."
  },
  {
    id: "earth",
    element: "Earth",
    guardian: "PebbleBack",
    quote: "Every stone and spoonful of soil holds a very old story. We only need patience to read it.",
    role: "Rocks form the land, minerals become useful materials, and healthy soil supports most plants on land.",
    facts: [
      "Soil contains minerals, organic matter, water, and air.",
      "Fossils are clues that help scientists learn about living things and environments from long ago.",
      "Rocks and minerals form and change over very long periods of time."
    ],
    example: "Fallen leaves can break down into organic matter that enriches garden soil.",
    question: "What can fossils teach us about?",
    answer: "Life and environments from the past",
    resources: ["Pebbles", "Fossil Chip", "Crystal Shard", "Clay"],
    didYouKnow: "Healthy soil has spaces that hold both water and air for plant roots and tiny soil animals."
  },
  {
    id: "fire",
    element: "Fire",
    guardian: "Emberling",
    quote: "A flame deserves care and respect. In the right place, careful warmth can help a forest begin again.",
    role: "Fire releases heat and light. It can be dangerous, but some ecosystems are adapted to recover after natural fires.",
    facts: [
      "Fire needs three things: heat, fuel, and oxygen.",
      "Fire can spread quickly and should only be handled safely by responsible adults.",
      "Some plants resprout after fire, and ash can return nutrients to soil."
    ],
    example: "Some pine cones open after strong heat, allowing their seeds to fall onto newly cleared ground.",
    question: "What three things does fire need?",
    answer: "Heat, fuel, and oxygen",
    resources: ["Ash Dust", "Charcoal Bark", "Ember Stone", "Heat Flower"],
    didYouKnow: "Removing even one part of the fire triangle can stop a fire."
  },
  {
    id: "lightning",
    element: "Lightning / Energy",
    guardian: "ZapScale",
    quote: "Lightning is electricity racing through nature. In our shrine, energy travels best when every path joins together.",
    role: "Energy makes change possible. It can move, change form, and be stored until it is needed.",
    facts: [
      "Lightning is a giant electrical spark in the atmosphere.",
      "An electric circuit needs a complete path before current can flow.",
      "Batteries store energy so it can be used later."
    ],
    example: "A flashlight battery stores chemical energy that changes into electrical energy and then light.",
    question: "What does a circuit need to work?",
    answer: "A complete path",
    resources: ["Spark Stone", "Charged Crystal", "Metal Scrap", "Static Wisp"],
    didYouKnow: "Some materials, including many metals, are conductors that let electric charge move through them."
  },
  {
    id: "nature",
    element: "Nature",
    guardian: "HeartBloom",
    quote: "A garden is a team. Sunlight, water, soil, air, flowers, and pollinators all help one another grow.",
    role: "Living things form connected ecosystems where plants, animals, fungi, and tiny organisms depend on one another.",
    facts: [
      "Pollinators move pollen and help many flowering plants make seeds.",
      "Flowers provide nectar for energy and pollen that contains nutrients.",
      "Biodiversity means many different living things share and support an ecosystem."
    ],
    example: "A bee drinks nectar from a flower and carries pollen to the next flower it visits.",
    question: "What do pollinators help plants make?",
    answer: "Seeds",
    resources: ["Heart Petals", "Seeds", "Nectar Drop", "Pollen Dust"],
    didYouKnow: "Plants need sunlight, water, soil nutrients, and air to make food and grow."
  }
];

export const elementLessonById = Object.fromEntries(
  elementLessons.map((lesson) => [lesson.id, lesson])
);

export const biomeQuizzes = [
  {
    id: "river-water-cycle",
    storyName: "River Path",
    elementId: "water",
    guardian: "Ripplefin",
    question: "What moves water from clouds back to the ground?",
    choices: ["Rain or precipitation", "River stones", "Sunlight"],
    correctChoice: "Rain or precipitation",
    explanation: "That is right! Precipitation includes rain, snow, sleet, and hail. It moves water from clouds back to Earth.",
    retry: "Not quite. Ripplefin reminds us that water falls from clouds as precipitation. Try again!",
    reward: { "Clean Water": 1 }
  },
  {
    id: "cloud-wind-travelers",
    storyName: "Cloud Hills",
    elementId: "air",
    guardian: "Nimbus Coil",
    question: "What can wind move?",
    choices: ["Seeds, clouds, and weather", "Mountains", "The Moon"],
    correctChoice: "Seeds, clouds, and weather",
    explanation: "Exactly! Wind carries clouds and weather, and it can help seeds and pollen travel.",
    retry: "Good try. Nimbus Coil says to watch the light travelers in the sky and garden. Try again!",
    reward: { "Cloud Fluff": 1 }
  },
  {
    id: "cave-fossil-clues",
    storyName: "Stone Cave",
    elementId: "earth",
    guardian: "PebbleBack",
    question: "What can fossils teach us about?",
    choices: ["Life from the past", "Tomorrow's weather", "How fast wind blows"],
    correctChoice: "Life from the past",
    explanation: "Correct! Fossils preserve clues about ancient plants, animals, and environments.",
    retry: "Almost. PebbleBack reads fossils like very old story pages. Try again!",
    reward: { "Fossil Chip": 1 }
  },
  {
    id: "ash-fire-triangle",
    storyName: "Ash Field",
    elementId: "fire",
    guardian: "Emberling",
    question: "What three things does fire need?",
    choices: ["Heat, fuel, and oxygen", "Water, soil, and seeds", "Clouds, wind, and rain"],
    correctChoice: "Heat, fuel, and oxygen",
    explanation: "Correct! Heat, fuel, and oxygen make the fire triangle. Removing one can stop a fire.",
    retry: "Not yet. Emberling safely points to the three sides of the fire triangle. Try again!",
    reward: { "Ash Dust": 1 }
  },
  {
    id: "storm-complete-circuit",
    storyName: "Storm Gate",
    elementId: "lightning",
    guardian: "ZapScale",
    question: "What does a circuit need to work?",
    choices: ["A complete path", "An open gate", "A pile of clouds"],
    correctChoice: "A complete path",
    explanation: "You got it! Electric current can flow when the circuit forms a complete path.",
    retry: "Close. ZapScale says every part of the path must connect. Try again!",
    reward: { "Spark Stone": 1 }
  },
  {
    id: "garden-pollinator-seeds",
    storyName: "Forest Garden",
    elementId: "nature",
    guardian: "HeartBloom",
    question: "What do pollinators help plants make?",
    choices: ["Seeds", "Rocks", "Lightning"],
    correctChoice: "Seeds",
    explanation: "Yes! Moving pollen between flowers helps many plants make fruits and seeds.",
    retry: "Good guess. HeartBloom asks you to think about the baby plants inside seed coats. Try again!",
    reward: { Seeds: 1 }
  }
];

export const biomeQuizByStoryName = Object.fromEntries(
  biomeQuizzes.map((quiz) => [quiz.storyName, quiz])
);

export const resourceFacts = {
  "Clean Water": "Clean water helps plants, animals, and people survive.",
  "River Reed": "Reeds grow near water, hold muddy banks in place, and shelter small animals.",
  "Smooth Stone": "Moving water tumbles stones and slowly smooths their rough edges through erosion.",
  "Blue Petal": "Flower petals help attract pollinators with colors, shapes, and scents.",
  "Cloud Fluff": "Clouds are made of tiny drops of water or ice crystals.",
  "Wind Wisp": "Wind is moving air caused partly by differences in air pressure and temperature.",
  "Sky Droplet": "Water vapor cools and condenses into tiny droplets that can form clouds.",
  "Feather Leaf": "Light leaves and seeds can travel to new places on the wind.",
  Pebbles: "Pebbles are small rock pieces shaped by weathering, water, and time.",
  "Fossil Chip": "Fossils are clues about living things and environments from long ago.",
  "Crystal Shard": "Crystals form when atoms arrange themselves in repeating patterns.",
  Clay: "Clay is made of extremely tiny mineral particles that hold water well.",
  "Ash Dust": "Ash can add some nutrients back into soil after fire.",
  "Charcoal Bark": "Charcoal forms when plant material is heated with very little oxygen.",
  "Ember Stone": "An ember can stay hot after flames fade, so fire areas must be checked carefully.",
  "Heat Flower": "Some plants are adapted to regrow or release seeds after fire.",
  "Spark Stone": "Electricity can travel through materials called conductors.",
  "Charged Crystal": "Electric charge can build up before moving as a spark.",
  "Metal Scrap": "Many metals conduct electricity because electric charge moves through them easily.",
  "Static Wisp": "Static electricity is a buildup of electric charge on an object's surface.",
  "Heart Petals": "Bright petals can guide pollinators toward a flower's nectar and pollen.",
  Seeds: "Seeds carry baby plants inside protective coats.",
  "Nectar Drop": "Nectar is a sugary liquid that gives many pollinators energy.",
  "Pollen Dust": "Pollen carries cells that help flowering plants make seeds."
};

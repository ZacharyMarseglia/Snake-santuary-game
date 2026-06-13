// GRASP Protected Variations: quests declare their guardian without coupling to UI.
export const quests = [
  {
    id: "first-drops",
    guardian: "Ripplefin",
    title: "Ripplefin's River Rescue",
    text: "Choose Ripplefin, enter River Path from the Sanctuary, and use Water Surge near 2 Clean Water.",
    target: { type: "resource", key: "Clean Water", count: 2 },
    reward: { "River Reed": 1 }
  },
  {
    id: "garden-friends",
    guardian: "HeartBloom",
    title: "HeartBloom's Garden Friends",
    text: "Choose HeartBloom, enter Forest Garden, and use Healing Bloom near 2 Heart Petals.",
    target: { type: "resource", key: "Heart Petals", count: 2 },
    reward: { Seeds: 1 }
  },
  {
    id: "home-again",
    guardian: "PebbleBack",
    title: "PebbleBack Builds a Home",
    text: "Harvest in Stone Cave, craft guardian relics at the Workbench, and complete 2 sanctuary upgrades.",
    target: { type: "upgrades", count: 2 },
    reward: { "Spark Stone": 1 }
  },
  {
    id: "guardian-scholar",
    guardian: "Nimbus Coil",
    title: "Nimbus Coil's Skyward Studies",
    text: "Visit each separate area with its matching guardian and discover all 7 science lessons.",
    target: { type: "stories", count: 7 },
    reward: { "Cloud Fluff": 2 }
  },
  {
    id: "restored-sanctuary",
    guardian: "ZapScale",
    supportingGuardian: "Emberling",
    title: "ZapScale and Emberling Restore the Light",
    text: "Harvest across all six biomes, craft every needed relic at the Workbench, then complete all 5 upgrades.",
    target: { type: "upgrades", count: 5 },
    reward: { "Heart Petals": 2 }
  }
];

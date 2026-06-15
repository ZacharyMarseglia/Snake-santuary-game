import { storySceneByBiome } from "../story/storyScenes.js";
import { areaName, t } from "../i18n/localization.js";

export const WORLD_SIZE = { width: 1100, height: 720 };

const biome = (id, name, guardian, element, storyName, colors, spawn = { x: 145, y: 360 }) => ({
  id,
  name,
  guardian,
  element,
  story: storySceneByBiome[storyName],
  colors,
  spawn,
  returnPortal: { x: 72, y: 360, radius: 62 }
});

// GRASP Protected Variations: navigation, access, and presentation metadata live here.
export const areas = {
  sanctuary: {
    id: "sanctuary",
    name: "Sanctuary / Home Base",
    guardian: null,
    element: "Harmony",
    story: storySceneByBiome["Broken Sanctuary"],
    colors: { ground: 0x789f72, path: 0xd8c99a, accent: 0xf1d879, shadow: 0x314b3c },
    spawn: { x: 245, y: 430 },
    workbench: { x: 870, y: 390, radius: 125 },
    gates: [
      { areaId: "river", x: 550, y: 76 },
      { areaId: "cloud", x: 920, y: 150 },
      { areaId: "stone", x: 970, y: 535 },
      { areaId: "ash", x: 550, y: 650 },
      { areaId: "storm", x: 130, y: 535 },
      { areaId: "forest", x: 180, y: 150 }
    ]
  },
  river: biome("river", "River Path", "Ripplefin", "water", "River Path", {
    ground: 0x72a87d, path: 0x68bdd3, accent: 0xc7f1ef, shadow: 0x315c63
  }),
  cloud: biome("cloud", "Cloud Hills", "Nimbus Coil", "air", "Cloud Hills", {
    ground: 0x9fd2d9, path: 0xf4fbf5, accent: 0x79b9e2, shadow: 0x5d7c93
  }),
  stone: biome("stone", "Stone Cave", "PebbleBack", "earth", "Stone Cave", {
    ground: 0x5f625d, path: 0x9c8d77, accent: 0xe1c795, shadow: 0x343631
  }),
  ash: biome("ash", "Ash Field", "Emberling", "fire", "Ash Field", {
    ground: 0x8d6759, path: 0x4c4541, accent: 0xf49a4d, shadow: 0x352d2a
  }),
  storm: biome("storm", "Storm Gate", "ZapScale", "lightning", "Storm Gate", {
    ground: 0x6e6686, path: 0x403950, accent: 0xf2d23e, shadow: 0x292431
  }),
  forest: biome("forest", "Forest Garden", "HeartBloom", "nature", "Forest Garden", {
    ground: 0x6fa260, path: 0xa9cb7a, accent: 0xee8fae, shadow: 0x34543a
  })
};

export const areaList = Object.values(areas);

export function guardianAccessMessage(area, language = "en") {
  if (!area.guardian) return "";
  return t("onlyGuardianEnter", language, {
    guardian: area.guardian,
    area: areaName(area.name, language)
  });
}

const families = {
  river: {
    guardian: "Ripplefin",
    element: "water",
    resources: [
      ["Clean Water", 0x78d7eb, "drop"],
      ["River Reed", 0x8cac58, "reed"],
      ["Smooth Stone", 0xaab9b7, "stone"],
      ["Blue Petal", 0x6aaee8, "flower"]
    ]
  },
  cloud: {
    guardian: "Nimbus Coil",
    element: "air",
    resources: [
      ["Cloud Fluff", 0xf4fbf8, "cloud"],
      ["Wind Wisp", 0x9ee8ee, "wisp"],
      ["Sky Droplet", 0x86c8ed, "drop"],
      ["Feather Leaf", 0xc6e6d0, "leaf"]
    ]
  },
  stone: {
    guardian: "PebbleBack",
    element: "earth",
    resources: [
      ["Pebbles", 0xc2aa82, "stone"],
      ["Fossil Chip", 0xe5d5af, "fossil"],
      ["Crystal Shard", 0x9bd3cf, "crystal"],
      ["Clay", 0xb47758, "clay"]
    ]
  },
  ash: {
    guardian: "Emberling",
    element: "fire",
    resources: [
      ["Ash Dust", 0x726b73, "ash"],
      ["Charcoal Bark", 0x4b4039, "bark"],
      ["Ember Stone", 0xf07736, "ember"],
      ["Heat Flower", 0xf5bd4d, "flower"]
    ]
  },
  storm: {
    guardian: "ZapScale",
    element: "lightning",
    resources: [
      ["Spark Stone", 0xf5df66, "spark"],
      ["Charged Crystal", 0x9eddf0, "crystal"],
      ["Metal Scrap", 0xaeb7bb, "metal"],
      ["Static Wisp", 0xffef7e, "wisp"]
    ]
  },
  forest: {
    guardian: "HeartBloom",
    element: "nature",
    resources: [
      ["Heart Petals", 0xec829f, "flower"],
      ["Seeds", 0xd5b65a, "seed"],
      ["Nectar Drop", 0xf2b84d, "drop"],
      ["Pollen Dust", 0xf4d45d, "pollen"]
    ]
  }
};

const layouts = {
  river: [[300, 170], [680, 135], [850, 250], [410, 310], [725, 420], [910, 560], [345, 585], [580, 515]],
  cloud: [[300, 160], [520, 120], [795, 170], [930, 315], [690, 360], [380, 390], [525, 560], [850, 555]],
  stone: [[285, 170], [480, 130], [760, 190], [930, 270], [385, 360], [650, 390], [860, 500], [500, 570]],
  ash: [[280, 155], [520, 135], [790, 190], [940, 315], [360, 350], [650, 400], [860, 535], [480, 570]],
  storm: [[300, 155], [550, 120], [820, 180], [930, 350], [690, 340], [390, 390], [550, 565], [850, 545]],
  forest: [[285, 155], [510, 130], [790, 170], [930, 315], [350, 350], [640, 395], [850, 545], [485, 570]]
};

export const resourceNames = Object.values(families).flatMap((family) =>
  family.resources.map(([name]) => name)
);

export const resourceSpawnsByArea = Object.fromEntries(
  Object.entries(families).map(([areaId, family]) => {
    const spawns = layouts[areaId].map(([x, y], index) => {
      const [name, color, kind] = family.resources[index % family.resources.length];
      return {
        id: `${areaId}-${index + 1}`,
        areaId,
        guardian: family.guardian,
        element: family.element,
        name,
        color,
        kind,
        x,
        y
      };
    });
    return [areaId, spawns];
  })
);

export const resourceSpawns = Object.values(resourceSpawnsByArea).flat();

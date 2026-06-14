const families = {
  river: {
    guardian: "Ripplefin",
    element: "water",
    spawnCounts: [5, 3, 2, 2],
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
    spawnCounts: [4, 3, 2, 2],
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
    spawnCounts: [6, 2, 2, 3],
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
    spawnCounts: [4, 3, 2, 2],
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
    spawnCounts: [4, 2, 3, 2],
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
    spawnCounts: [4, 4, 2, 2],
    resources: [
      ["Heart Petals", 0xec829f, "flower"],
      ["Seeds", 0xd5b65a, "seed"],
      ["Nectar Drop", 0xf2b84d, "drop"],
      ["Pollen Dust", 0xf4d45d, "pollen"]
    ]
  }
};

const layouts = {
  river: [[280,150],[680,125],[865,220],[310,300],[720,350],[920,470],[300,570],[590,565],[785,585],[970,150],[210,430],[820,430]],
  cloud: [[270,150],[500,115],[790,150],[930,275],[680,330],[345,360],[510,545],[850,550],[980,445],[235,525],[755,460]],
  stone: [[260,145],[465,120],[735,160],[930,235],[355,330],[630,365],[860,475],[475,550],[720,570],[970,555],[240,500],[570,215],[805,300]],
  ash: [[260,140],[500,120],[765,160],[930,275],[335,325],[625,375],[845,510],[455,555],[720,565],[980,480],[230,500]],
  storm: [[275,140],[525,110],[795,150],[930,315],[665,315],[365,365],[525,545],[830,530],[970,520],[240,505],[760,440]],
  forest: [[260,140],[490,115],[765,145],[920,280],[325,325],[615,370],[830,520],[460,550],[710,570],[970,480],[220,505],[790,330]]
};

export const resourceNames = Object.values(families).flatMap((family) =>
  family.resources.map(([name]) => name)
);

export const resourceSpawnsByArea = Object.fromEntries(
  Object.entries(families).map(([areaId, family]) => {
    const spawnTypes = family.spawnCounts.flatMap((count, resourceIndex) =>
      Array.from({ length: count }, () => resourceIndex)
    );
    const spawns = layouts[areaId].map(([x, y], index) => {
      const [name, color, kind] = family.resources[spawnTypes[index]];
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

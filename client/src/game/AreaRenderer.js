import { areas, WORLD_SIZE } from "../data/areas.js";
import { snakes } from "../data/snakes.js";

// GRASP Pure Fabrication: world illustration is isolated from navigation and gameplay rules.
export class AreaRenderer {
  constructor(scene) {
    this.scene = scene;
    this.objects = [];
  }

  add(object) {
    this.objects.push(object);
    return object;
  }

  clear() {
    this.objects.forEach((object) => object?.destroy?.());
    this.objects = [];
  }

  render(area) {
    this.clear();
    const g = this.add(this.scene.add.graphics().setDepth(0));
    g.fillStyle(area.colors.ground).fillRect(0, 0, WORLD_SIZE.width, WORLD_SIZE.height);
    this.drawPaperTexture(g, area.colors.shadow);
    g.lineStyle(7, 0xfff3c7, 0.2).strokeRoundedRect(15, 15, WORLD_SIZE.width - 30, WORLD_SIZE.height - 30, 35);
    g.lineStyle(3, area.colors.shadow, 0.5).strokeRoundedRect(20, 20, WORLD_SIZE.width - 40, WORLD_SIZE.height - 40, 31);

    if (area.id === "sanctuary") this.drawSanctuary(g, area);
    else this[`draw${capitalize(area.id)}`](g, area);

    this.add(this.scene.add.text(35, 28, area.name, {
      fontFamily: "Georgia, serif",
      fontStyle: "bold",
      fontSize: "29px",
      color: "#fff8d9",
      stroke: hex(area.colors.shadow),
      strokeThickness: 7
    }).setDepth(5));

    if (area.id !== "sanctuary") this.drawReturnPortal(g, area);
    return this.obstaclesFor(area.id);
  }

  drawPaperTexture(g, color) {
    for (let i = 0; i < 95; i++) {
      const x = 30 + ((i * 97) % (WORLD_SIZE.width - 60));
      const y = 25 + ((i * 61) % (WORLD_SIZE.height - 50));
      g.lineStyle(1.5, color, 0.1);
      g.beginPath().moveTo(x, y).lineTo(x + 3 + (i % 5), y + 4).strokePath();
    }
  }

  drawSanctuary(g, area) {
    g.fillStyle(0x9abc82, 0.55).fillEllipse(550, 390, 650, 430);
    area.gates.forEach((gate) => {
      g.lineStyle(30, area.colors.path, 0.72).beginPath().moveTo(550, 390).lineTo(gate.x, gate.y).strokePath();
      g.lineStyle(3, 0xffefc0, 0.35).beginPath().moveTo(550, 390).lineTo(gate.x, gate.y).strokePath();
      this.drawGate(g, gate);
    });

    for (let i = 0; i < 30; i++) {
      const x = 80 + ((i * 83) % 940);
      const y = 90 + ((i * 47) % 560);
      g.fillStyle(i % 3 ? 0x668f58 : 0xe3ae72, 0.8).fillCircle(x, y, 3 + (i % 3));
    }

    g.fillStyle(0xf6d96c, 0.2).fillCircle(550, 330, 95);
    g.lineStyle(3, 0xf8e69a, 0.45).strokeCircle(550, 330, 72);
    this.drawWorkbench(g, area.workbench);
  }

  drawWorkbench(g, workbench) {
    const { x, y } = workbench;
    g.fillStyle(0x604330, 0.35).fillEllipse(x, y + 42, 150, 48);
    g.fillStyle(0x8c5d3d).fillRoundedRect(x - 67, y - 25, 134, 62, 12);
    g.lineStyle(5, 0x513b30).strokeRoundedRect(x - 67, y - 25, 134, 62, 12);
    g.fillStyle(0xc58a55).fillRoundedRect(x - 77, y - 38, 154, 25, 8);
    g.lineStyle(4, 0x5b4031).strokeRoundedRect(x - 77, y - 38, 154, 25, 8);
    g.fillStyle(0x674637).fillRoundedRect(x - 52, y + 32, 18, 48, 5).fillRoundedRect(x + 34, y + 32, 18, 48, 5);
    g.fillStyle(0x70cfe0, 0.9).fillTriangle(x - 43, y - 51, x - 29, y - 72, x - 15, y - 51);
    g.fillStyle(0xf1c94d, 0.9).fillTriangle(x - 6, y - 50, x + 5, y - 73, x + 16, y - 50);
    g.fillStyle(0xec8baa, 0.9).fillCircle(x + 42, y - 58, 12);
    g.lineStyle(3, 0xfff0b5, 0.6).strokeCircle(x, y - 10, 22);
    g.fillStyle(0xede0ad).fillRect(x - 17, y - 25, 34, 29);
    g.lineStyle(2, 0x72533c).strokeRect(x - 17, y - 25, 34, 29);
    this.add(this.scene.add.text(x, y + 86, "Guardian Workbench", {
      fontFamily: "Trebuchet MS",
      fontStyle: "bold",
      fontSize: "13px",
      color: "#fff8d9",
      backgroundColor: "#604330ee",
      padding: { x: 8, y: 4 }
    }).setOrigin(0.5).setDepth(4));
  }

  drawGate(g, gate) {
    const target = areas[gate.areaId];
    const guardian = snakes[target.guardian];
    g.fillStyle(target.colors.shadow, 0.86).fillRoundedRect(gate.x - 58, gate.y - 48, 116, 96, 24);
    g.lineStyle(5, guardian.color, 0.9).strokeRoundedRect(gate.x - 58, gate.y - 48, 116, 96, 24);
    g.lineStyle(3, guardian.accent, 0.7).strokeCircle(gate.x, gate.y - 4, 31);
    this.add(this.scene.add.image(gate.x, gate.y - 5, guardian.spriteKey).setDisplaySize(66, 66).setDepth(3));
    this.add(this.scene.add.text(gate.x, gate.y + 48, target.name, {
      fontFamily: "Trebuchet MS",
      fontStyle: "bold",
      fontSize: "12px",
      color: "#fff8d9",
      backgroundColor: "#30483ddd",
      padding: { x: 7, y: 3 }
    }).setOrigin(0.5).setDepth(4));
  }

  drawRiver(g) {
    const river = [
      { x: 430, y: -20 }, { x: 530, y: 100 }, { x: 475, y: 225 },
      { x: 590, y: 345 }, { x: 515, y: 490 }, { x: 650, y: 740 }
    ];
    g.lineStyle(185, 0x45a9c7, 0.92).strokePoints(river, false, false);
    g.lineStyle(125, 0x6ec9dc, 0.9).strokePoints(river, false, false);
    g.lineStyle(7, 0xc8f5f0, 0.5).strokePoints(river, false, false);
    for (let i = 0; i < 16; i++) {
      const x = 260 + ((i * 149) % 700);
      const y = 90 + ((i * 79) % 550);
      g.fillStyle(0x769164).fillEllipse(x, y, 15, 8);
      g.lineStyle(3, 0x557b46).beginPath().moveTo(x, y + 10).lineTo(x + 2, y - 13).strokePath();
    }
    for (let i = 0; i < 7; i++) {
      const x = 425 + (i % 2) * 90 + Math.sin(i) * 15;
      const y = 100 + i * 88;
      g.fillStyle(0xb7aa8e).fillRoundedRect(x, y, 62, 34, 12);
      g.lineStyle(3, 0x6c736a, 0.65).strokeRoundedRect(x, y, 62, 34, 12);
    }
    g.fillStyle(0xe8fbf3, 0.7).fillTriangle(570, 180, 585, 188, 568, 195);
    g.fillTriangle(545, 520, 560, 528, 542, 535);
  }

  drawCloud(g) {
    g.fillStyle(0x78b7d5, 0.3).fillRect(0, 0, WORLD_SIZE.width, WORLD_SIZE.height);
    const islands = [[280,190,190,110],[555,155,220,125],[835,230,190,110],[400,450,210,120],[730,500,240,130],[970,430,150,100]];
    islands.forEach(([x,y,w,h], index) => {
      g.fillStyle(0xf8fcf3, 0.88).fillEllipse(x, y, w, h);
      g.fillStyle(0xdcebef, 0.48).fillEllipse(x, y + 25, w * 0.85, h * 0.55);
      g.lineStyle(3, 0x789db4, 0.45).strokeEllipse(x, y, w, h);
      if (index < islands.length - 1) {
        const next = islands[index + 1];
        g.lineStyle(18, 0xe8f6f3, 0.68).beginPath().moveTo(x + w / 3, y).lineTo(next[0] - next[2] / 3, next[1]).strokePath();
      }
    });
    for (let i = 0; i < 12; i++) {
      const x = 210 + ((i * 131) % 760);
      const y = 95 + ((i * 71) % 520);
      g.lineStyle(3, 0xd9fbff, 0.65).beginPath().arc(x, y, 18 + (i % 3) * 7, 0.2, 5.2).strokePath();
    }
  }

  drawStone(g) {
    g.fillStyle(0x3f433f, 0.52).fillRoundedRect(95, 80, 930, 570, 65);
    g.lineStyle(10, 0x2f332f, 0.7).strokeRoundedRect(95, 80, 930, 570, 65);
    for (let i = 0; i < 26; i++) {
      const x = 130 + ((i * 113) % 850);
      const y = 110 + ((i * 67) % 500);
      const height = 18 + (i % 4) * 13;
      g.fillStyle(i % 3 ? 0x77746b : 0x9b8f7c).fillTriangle(x, y + height, x + 14, y, x + 31, y + height);
      g.lineStyle(2, 0x363a36, 0.6).strokeTriangle(x, y + height, x + 14, y, x + 31, y + height);
    }
    const crystals = [[370,190,0x87d8d3],[720,165,0xb7a1e7],[870,440,0x83cddd],[475,520,0xe3bb78]];
    crystals.forEach(([x,y,color]) => {
      g.fillStyle(color, 0.82).fillTriangle(x, y + 35, x + 14, y - 15, x + 28, y + 35);
      g.fillTriangle(x + 18, y + 35, x + 35, y, x + 48, y + 35);
      g.lineStyle(2, 0xf3f3d5, 0.5).strokeTriangle(x, y + 35, x + 14, y - 15, x + 28, y + 35);
    });
    g.lineStyle(4, 0xd8caa0, 0.7).beginPath().arc(620, 330, 34, 0, Math.PI * 1.8).arc(620, 330, 20, Math.PI * 1.8, 0).strokePath();
  }

  drawAsh(g) {
    for (let i = 0; i < 18; i++) {
      const x = 150 + ((i * 139) % 820);
      const y = 100 + ((i * 79) % 520);
      g.fillStyle(0x57504c, 0.6).fillEllipse(x, y, 90 + (i % 3) * 28, 34);
    }
    for (let i = 0; i < 10; i++) {
      const x = 220 + ((i * 173) % 730);
      const y = 130 + ((i * 97) % 470);
      g.lineStyle(15, 0x493b34, 0.85).beginPath().moveTo(x - 35, y + 12).lineTo(x + 38, y - 8).strokePath();
      g.lineStyle(3, 0x2e2926, 0.7).beginPath().moveTo(x, y).lineTo(x + 20, y - 30).strokePath();
    }
    for (let i = 0; i < 22; i++) {
      const x = 120 + ((i * 101) % 880);
      const y = 105 + ((i * 59) % 520);
      g.lineStyle(4, 0xe36b38, 0.45).beginPath().moveTo(x, y).lineTo(x + 10, y + 14).lineTo(x + 2, y + 28).strokePath();
      if (i % 3 === 0) {
        g.lineStyle(3, 0x75a85b, 0.9).beginPath().moveTo(x + 20, y + 18).lineTo(x + 20, y - 5).strokePath();
        g.fillStyle(0x91c875).fillEllipse(x + 13, y - 4, 14, 7).fillEllipse(x + 27, y - 8, 14, 7);
      }
    }
  }

  drawStorm(g) {
    g.fillStyle(0x40394f, 0.72).fillRoundedRect(105, 85, 890, 540, 50);
    g.lineStyle(8, 0x2c2735, 0.8).strokeRoundedRect(105, 85, 890, 540, 50);
    for (let i = 0; i < 10; i++) {
      const y = 125 + i * 50;
      g.lineStyle(6, i % 2 ? 0x765b99 : 0xe0c843, 0.55).beginPath()
        .moveTo(150, y).lineTo(360 + (i % 3) * 70, y).lineTo(430 + (i % 2) * 120, y + 25)
        .lineTo(880, y + 25).strokePath();
    }
    const nodes = [[280,190],[550,170],[810,215],[370,420],[650,390],[865,500]];
    nodes.forEach(([x,y], index) => {
      g.fillStyle(0x27242e).fillCircle(x, y, 34);
      g.lineStyle(5, 0xf0d649, 0.72).strokeCircle(x, y, 25);
      g.fillStyle(0xf4dd4c, 0.85).fillTriangle(x - 5, y - 22, x + 13, y - 4, x + 3, y - 3);
      g.fillTriangle(x + 3, y - 4, x - 14, y + 23, x - 3, y + 3);
      if (index < nodes.length - 1) g.lineStyle(2, 0xd6c4ff, 0.35).strokeCircle(x, y, 42);
    });
    g.fillStyle(0x17151c).fillRoundedRect(870, 260, 95, 170, 20);
    g.lineStyle(6, 0x9082aa).strokeRoundedRect(870, 260, 95, 170, 20);
  }

  drawForest(g) {
    for (let i = 0; i < 18; i++) {
      const x = 110 + ((i * 137) % 880);
      const y = 90 + ((i * 83) % 550);
      g.fillStyle(0x3d7547, 0.85).fillCircle(x, y, 22 + (i % 3) * 8);
      g.fillStyle(i % 2 ? 0xe989aa : 0xf2cc68).fillCircle(x - 8, y - 5, 7).fillCircle(x + 7, y + 2, 6);
      g.fillStyle(0xffedac).fillCircle(x, y, 3);
    }
    g.lineStyle(14, 0x477f4c, 0.65).beginPath().arc(550, 360, 245, 0.1, 5.9).strokePath();
    for (let i = 0; i < 20; i++) {
      const angle = (Math.PI * 2 * i) / 20;
      const x = 550 + Math.cos(angle) * 245;
      const y = 360 + Math.sin(angle) * 245;
      g.fillStyle(0xe987a7).fillCircle(x, y, 7).fillCircle(x + 7, y + 3, 6).fillCircle(x - 5, y + 5, 6);
      g.fillStyle(0xffde72).fillCircle(x, y + 3, 3);
    }
    for (let i = 0; i < 8; i++) {
      const x = 250 + i * 95;
      const y = 230 + (i % 3) * 120;
      g.fillStyle(0xf2d35f, 0.9).fillEllipse(x, y, 8, 5);
      g.lineStyle(2, 0x4c4430).beginPath().moveTo(x - 7, y).lineTo(x + 7, y).strokePath();
    }
  }

  drawReturnPortal(g, area) {
    const { x, y } = area.returnPortal;
    g.fillStyle(0x2e473b, 0.86).fillCircle(x, y, 47);
    g.lineStyle(6, 0xf4dc82, 0.9).strokeCircle(x, y, 39);
    g.lineStyle(3, area.colors.accent, 0.8).strokeCircle(x, y, 28);
    g.fillStyle(0xfff1b3, 0.9).fillTriangle(x - 12, y, x + 8, y - 15, x + 8, y - 5);
    g.fillTriangle(x + 8, y - 15, x + 8, y + 15, x + 20, y);
    this.add(this.scene.add.text(x, y + 58, "Return to Sanctuary", {
      fontFamily: "Trebuchet MS",
      fontStyle: "bold",
      fontSize: "12px",
      color: "#fff8d9",
      backgroundColor: "#30483ddd",
      padding: { x: 7, y: 3 }
    }).setOrigin(0.5).setDepth(4));
  }

  obstaclesFor(areaId) {
    if (areaId === "sanctuary") {
      return [
        { x: 405, y: 530, w: 205, h: 105 },
        { x: 670, y: 505, w: 145, h: 125 },
        { x: 550, y: 315, w: 105, h: 125 },
        { x: 870, y: 410, w: 150, h: 95 }
      ];
    }
    const common = {
      river: [{ x: 500, y: 350, w: 120, h: 95 }],
      cloud: [{ x: 555, y: 155, w: 150, h: 70 }, { x: 730, y: 500, w: 160, h: 75 }],
      stone: [{ x: 610, y: 330, w: 100, h: 85 }, { x: 850, y: 430, w: 90, h: 120 }],
      ash: [{ x: 520, y: 285, w: 150, h: 45 }, { x: 790, y: 470, w: 145, h: 45 }],
      storm: [{ x: 915, y: 345, w: 110, h: 185 }, { x: 550, y: 170, w: 80, h: 80 }],
      forest: [{ x: 550, y: 360, w: 160, h: 100 }, { x: 800, y: 240, w: 100, h: 100 }]
    };
    return common[areaId] || [];
  }
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function hex(value) {
  return `#${value.toString(16).padStart(6, "0")}`;
}

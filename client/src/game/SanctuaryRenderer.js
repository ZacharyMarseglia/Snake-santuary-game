import { SanctuaryEffects } from "./SanctuaryEffects.js";
import { t } from "../i18n/localization.js";

const ELEMENT_COLORS = [0x55c6e1, 0x8bcce9, 0xb58a58, 0xf07a35, 0xf3d84f, 0xee87ad];

// GRASP Information Expert: this renderer owns every visual state of sanctuary landmarks.
export class SanctuaryRenderer {
  constructor(scene, offsetX = 120) {
    this.scene = scene;
    this.offsetX = offsetX;
    this.graphics = scene.add.graphics().setPosition(offsetX, 0).setDepth(3);
    this.effects = new SanctuaryEffects(scene);
    this.completed = new Set();
  }

  label(key) {
    return t(key, this.scene.save.settings?.language || "en");
  }

  render(upgrades, options = {}) {
    const done = new Set(upgrades);
    const g = this.graphics;
    this.effects.clear();
    g.clear();

    this.drawGround(g, done.size);
    this.drawPath(g, done.has("path"));
    this.drawPond(g, done.has("pond"));
    this.drawGarden(g, done.has("garden"));
    this.drawShrine(g, done.has("shrine"));
    this.drawLibrary(g, done.has("library"));
    this.drawStageDetails(g, done);

    if (done.has("pond")) this.effects.animatePond();
    if (done.has("garden")) this.effects.animateGarden();
    if (done.has("shrine")) this.effects.animateShrine();
    if (done.has("library")) this.effects.animateLibrary();
    if (done.size === 5) this.effects.animateFullyRestored();

    if (options.animate && options.upgradeId) this.effects.celebrate(options.upgradeId);
    this.completed = done;
  }

  drawGround(g, level) {
    const restored = level === 5;
    g.fillStyle(restored ? 0x84b878 : 0x657862, 0.34).fillEllipse(425, 470, 500, 360);
    g.lineStyle(5, restored ? 0xbce392 : 0x4f554b, 0.45).strokeEllipse(425, 470, 500, 360);

    if (level === 0) {
      g.fillStyle(0x6f6d5e, 0.18).fillEllipse(425, 470, 470, 330);
      for (let i = 0; i < 9; i++) {
        const x = 235 + ((i * 73) % 390);
        const y = 315 + ((i * 47) % 275);
        g.lineStyle(3, 0x555548, 0.55).beginPath()
          .moveTo(x, y).lineTo(x + 12, y + 11).lineTo(x + 5, y + 24)
          .moveTo(x + 12, y + 11).lineTo(x + 25, y + 7).strokePath();
      }
    }

    const plantCount = Math.max(0, level * 5);
    for (let i = 0; i < plantCount; i++) {
      const x = 205 + ((i * 79) % 455);
      const y = 295 + ((i * 53) % 330);
      g.lineStyle(2, 0x4f854e, 0.8).beginPath().moveTo(x, y + 8).lineTo(x, y - 3).strokePath();
      g.fillStyle(i % 3 === 0 ? 0xf1bc73 : 0x87b96e, 0.86)
        .fillEllipse(x - 5, y - 3, 9, 5)
        .fillEllipse(x + 5, y - 6, 9, 5);
    }

    if (level >= 3) {
      g.lineStyle(4, 0xf5df8a, 0.34).strokeEllipse(425, 470, 455, 325);
      g.fillStyle(0xffdf74, 0.68).fillCircle(248, 328, 5).fillCircle(610, 310, 5);
    }
  }

  drawPond(g, restored) {
    if (!restored) {
      g.fillStyle(0x5b5547, 0.48).fillEllipse(294, 548, 214, 116);
      g.fillStyle(0x766850, 0.95).fillEllipse(294, 552, 184, 88);
      g.lineStyle(7, 0x4d554d, 0.72).strokeEllipse(294, 548, 210, 112);
      g.lineStyle(3, 0x514b40, 0.75).beginPath()
        .moveTo(235, 545).lineTo(264, 536).lineTo(284, 551).lineTo(314, 536).lineTo(350, 550)
        .moveTo(276, 551).lineTo(267, 570)
        .moveTo(314, 536).lineTo(327, 519).strokePath();
      this.drawReeds(g, 220, 535, 0x5d5945, true);
      this.drawReeds(g, 365, 552, 0x5d5945, true);
      this.effects.addLabel(414, 620, this.label("dryPond"), false, "#7d725a");
      return;
    }

    g.fillStyle(0x496f67, 0.55).fillEllipse(294, 548, 224, 124);
    g.fillStyle(0x45accb, 0.98).fillEllipse(294, 545, 202, 105);
    g.fillStyle(0x76d4e6, 0.9).fillEllipse(294, 536, 175, 76);
    g.lineStyle(7, 0xc5e4ce, 0.82).strokeEllipse(294, 548, 218, 118);
    g.lineStyle(3, 0xd7fbf5, 0.72)
      .strokeEllipse(275, 530, 88, 24)
      .strokeEllipse(325, 561, 50, 15);
    g.fillStyle(0x78a95d).fillEllipse(255, 539, 34, 14).fillEllipse(338, 561, 29, 12);
    g.fillStyle(0xf4a6ba).fillCircle(255, 535, 6);
    g.fillStyle(0xffe386).fillCircle(338, 558, 5);
    this.drawReeds(g, 214, 525, 0x57924f, false);
    this.drawReeds(g, 368, 545, 0x57924f, false);
    g.lineStyle(4, 0x9eeeff, 0.62).strokeEllipse(294, 548, 230, 130);
    this.effects.addLabel(414, 620, this.label("ripplefinPond"), true, "#2589ac");
  }

  drawReeds(g, x, y, color, dead) {
    g.lineStyle(4, color, 0.9).beginPath()
      .moveTo(x, y + 22).lineTo(x - 3, y - 13)
      .moveTo(x + 10, y + 22).lineTo(x + 13, y - 20)
      .moveTo(x + 20, y + 22).lineTo(x + 22, y - 8).strokePath();
    if (dead) {
      g.lineStyle(3, color, 0.9).beginPath().moveTo(x - 3, y - 13).lineTo(x - 15, y - 3).strokePath();
    } else {
      g.fillStyle(0xa4793f).fillEllipse(x - 3, y - 14, 7, 15).fillEllipse(x + 13, y - 20, 7, 15);
    }
  }

  drawGarden(g, restored) {
    if (!restored) {
      g.fillStyle(0x75694f, 0.9).fillRoundedRect(470, 507, 148, 112, 18);
      g.lineStyle(5, 0x515849, 0.7).strokeRoundedRect(470, 507, 148, 112, 18);
      g.lineStyle(3, 0x5d513f, 0.65)
        .beginPath().moveTo(484, 548).lineTo(604, 548)
        .moveTo(484, 582).lineTo(604, 582).strokePath();
      for (let i = 0; i < 4; i++) {
        const x = 492 + i * 34;
        g.lineStyle(3, 0x565244).beginPath()
          .moveTo(x, 590).lineTo(x + 2, 565).lineTo(x - 8, 557)
          .moveTo(x + 2, 565).lineTo(x + 12, 558).strokePath();
      }
      g.lineStyle(5, 0x665443).beginPath().moveTo(473, 505).lineTo(466, 484).lineTo(486, 492).strokePath();
      this.effects.addLabel(660, 626, this.label("wiltedGarden"), false, "#7d725a");
      return;
    }

    g.fillStyle(0x577f48, 0.96).fillRoundedRect(465, 492, 164, 132, 24);
    g.lineStyle(6, 0xa7cc78, 0.82).strokeRoundedRect(465, 492, 164, 132, 24);
    g.fillStyle(0x805c43, 0.62).fillRoundedRect(479, 512, 136, 94, 16);
    const colors = [0xee87ad, 0xf4cc62, 0xa99ce8, 0xffaa73, 0x8ed37d];
    for (let i = 0; i < 15; i++) {
      const x = 493 + (i % 5) * 27;
      const y = 528 + Math.floor(i / 5) * 31;
      this.drawFlower(g, x, y, colors[i % colors.length]);
    }
    g.lineStyle(7, 0x4d8b54, 0.92).beginPath().arc(547, 505, 67, Math.PI, Math.PI * 2).strokePath();
    for (let i = 0; i < 9; i++) {
      const angle = Math.PI + (Math.PI * i) / 8;
      const x = 547 + Math.cos(angle) * 67;
      const y = 505 + Math.sin(angle) * 67;
      g.fillStyle(0xed8dac).fillCircle(x, y, 7).fillCircle(x + 6, y + 3, 5);
    }
    g.fillStyle(0xf7b6ca, 0.78).fillCircle(475, 486, 4).fillCircle(623, 498, 4);
    this.effects.addLabel(660, 632, this.label("heartbloomGarden"), true, "#b95078");
  }

  drawFlower(g, x, y, color) {
    g.lineStyle(2, 0x4f854e).beginPath().moveTo(x, y + 10).lineTo(x, y).strokePath();
    g.fillStyle(color).fillCircle(x - 5, y, 5).fillCircle(x + 5, y, 5).fillCircle(x, y - 5, 5).fillCircle(x, y + 5, 5);
    g.fillStyle(0xffe494).fillCircle(x, y, 3);
  }

  drawPath(g, restored) {
    const stones = [
      [330, 468, -7], [365, 455, 4], [400, 463, -3], [434, 447, 6],
      [466, 457, -5], [495, 438, 4], [520, 416, -4]
    ];
    stones.forEach(([x, y, angle], index) => {
      if (restored) {
        g.fillStyle(index % 2 ? 0xdacba9 : 0xc9b990).fillRoundedRect(x, y, 37, 27, 10);
        g.lineStyle(3, 0x716b5d, 0.72).strokeRoundedRect(x, y, 37, 27, 10);
        g.lineStyle(2, 0xf3e8c4, 0.48).beginPath().moveTo(x + 7, y + 7).lineTo(x + 27, y + 4).strokePath();
      } else {
        const ox = index % 2 ? 10 : -7;
        g.fillStyle(0x77776d).fillRoundedRect(x + ox, y + (index % 3) * 8, 31, 22, 7);
        g.lineStyle(2, 0x53564f, 0.78).strokeRoundedRect(x + ox, y + (index % 3) * 8, 31, 22, 7);
        g.beginPath().moveTo(x + ox + 8, y + 4).lineTo(x + ox + 17, y + 12).lineTo(x + ox + 12, y + 20).strokePath();
      }
      void angle;
    });

    if (!restored) {
      g.fillStyle(0x66675f).fillCircle(350, 505, 9).fillCircle(474, 489, 7).fillCircle(522, 466, 8);
      this.effects.addLabel(555, 505, this.label("brokenPath"), false, "#777064");
      return;
    }

    g.fillStyle(0xa77c4e).fillRoundedRect(322, 437, 25, 42, 8).fillRoundedRect(526, 382, 25, 42, 8);
    g.lineStyle(3, 0x5f513f).strokeRoundedRect(322, 437, 25, 42, 8).strokeRoundedRect(526, 382, 25, 42, 8);
    g.lineStyle(3, 0xe8d8ad).beginPath().arc(335, 454, 8, 0, Math.PI * 1.8).strokePath();
    g.fillStyle(0x8edbd5).fillTriangle(536, 399, 543, 383, 550, 399);
    g.fillStyle(0xd9c99f, 0.88).fillCircle(382, 490, 8).fillCircle(455, 484, 6);
    this.effects.addLabel(555, 505, this.label("guardianStoneway"), true, "#725335");
  }

  drawShrine(g, restored) {
    if (!restored) {
      g.fillStyle(0x555b55).fillRoundedRect(374, 282, 112, 137, 14);
      g.lineStyle(7, 0x3f4540, 0.9).strokeRoundedRect(374, 282, 112, 137, 14);
      g.fillStyle(0x424743).fillRoundedRect(395, 305, 70, 91, 20);
      g.fillStyle(0x4d534f).fillCircle(430, 332, 19);
      g.lineStyle(4, 0x363c38, 0.88).beginPath()
        .moveTo(407, 286).lineTo(419, 307).lineTo(412, 333)
        .moveTo(451, 307).lineTo(438, 326).lineTo(447, 350)
        .moveTo(408, 385).lineTo(430, 366).lineTo(454, 391).strokePath();
      g.fillStyle(0x555951).fillRoundedRect(350, 395, 37, 20, 6).fillRoundedRect(474, 405, 42, 18, 6);
      this.effects.addLabel(550, 430, this.label("silentShrine"), false, "#696b63");
      return;
    }

    g.fillStyle(0x4b3f59, 0.94).fillRoundedRect(365, 265, 130, 158, 20);
    g.lineStyle(8, 0xe7cf7b, 0.9).strokeRoundedRect(365, 265, 130, 158, 20);
    g.fillStyle(0x312b42).fillRoundedRect(386, 289, 88, 108, 28);
    g.lineStyle(4, 0xb99be4, 0.92).strokeRoundedRect(386, 289, 88, 108, 28);
    g.fillStyle(0xf7e17b, 0.24).fillCircle(430, 335, 52);
    g.fillStyle(0xf8e58a, 0.96).fillCircle(430, 335, 22);
    g.lineStyle(5, 0xdab4ff, 0.72).strokeCircle(430, 335, 36);
    g.lineStyle(2, 0xfff6c5, 0.72).strokeCircle(430, 335, 48);
    g.fillStyle(0x6c5980).fillTriangle(351, 277, 376, 243, 401, 277);
    g.fillTriangle(459, 277, 484, 243, 509, 277);
    g.lineStyle(4, 0xe7cf7b).strokeTriangle(351, 277, 376, 243, 401, 277).strokeTriangle(459, 277, 484, 243, 509, 277);
    this.effects.addLabel(550, 438, this.label("elementalShrine"), true, "#72568e");
  }

  drawLibrary(g, restored) {
    if (!restored) {
      g.fillStyle(0x6b6253, 0.5).fillRect(535, 365, 112, 76);
      g.lineStyle(4, 0x554f45, 0.72).beginPath()
        .moveTo(530, 367).lineTo(650, 367)
        .moveTo(548, 365).lineTo(540, 337)
        .moveTo(625, 367).lineTo(650, 343).strokePath();
      g.fillStyle(0x625849).fillRoundedRect(557, 405, 34, 12, 4).fillRoundedRect(612, 420, 30, 10, 4);
      this.effects.addLabel(710, 452, this.label("emptyStoryCorner"), false, "#756b58");
      return;
    }

    g.fillStyle(0x704936).fillRoundedRect(522, 320, 138, 137, 14);
    g.fillStyle(0xa76847).fillTriangle(509, 330, 591, 275, 675, 330);
    g.lineStyle(6, 0x533b31).strokeTriangle(509, 330, 591, 275, 675, 330);
    g.fillStyle(0x3e5e4d).fillRoundedRect(538, 339, 106, 82, 8);
    g.fillStyle(0xd19a5e).fillRect(545, 347, 92, 8).fillRect(545, 381, 92, 8);
    const books = [0x6da6c5, 0xd17972, 0xe1bd5f, 0x8eb56f, 0xa58bc5, 0xe28eaa];
    books.forEach((color, index) => {
      const shelf = index < 3 ? 0 : 1;
      const x = 550 + (index % 3) * 28;
      const y = shelf ? 390 : 356;
      g.fillStyle(color).fillRoundedRect(x, y, 19, 25, 3);
      g.lineStyle(2, 0xffe9b0, 0.65).beginPath().moveTo(x + 5, y + 4).lineTo(x + 5, y + 21).strokePath();
    });
    g.fillStyle(0x855a3f).fillRoundedRect(552, 423, 78, 20, 7);
    g.fillStyle(0xf4e1ad).fillTriangle(560, 425, 590, 418, 590, 440).fillTriangle(590, 418, 622, 425, 590, 440);
    g.lineStyle(2, 0xae784c).beginPath().moveTo(590, 418).lineTo(590, 440).strokePath();
    this.effects.addLabel(710, 466, t("storybookLibrary", this.scene.save.settings?.language || "en"), true, "#76503b");
  }

  drawStageDetails(g, done) {
    if (done.size >= 2) {
      g.fillStyle(0xffe176, 0.62).fillCircle(230, 380, 4).fillCircle(650, 475, 4);
      g.lineStyle(2, 0xfff0a8, 0.55).strokeCircle(230, 380, 9).strokeCircle(650, 475, 9);
    }
    if (done.size >= 3) {
      g.lineStyle(5, 0x82b76a, 0.7).beginPath()
        .moveTo(205, 420).lineTo(190, 392).lineTo(205, 365)
        .moveTo(654, 550).lineTo(674, 523).lineTo(667, 495).strokePath();
    }
    if (done.size === 5) {
      g.lineStyle(6, 0xf8e69a, 0.36).strokeEllipse(425, 470, 525, 385);
      ELEMENT_COLORS.forEach((color, index) => {
        const angle = (Math.PI * 2 * index) / ELEMENT_COLORS.length;
        const x = 425 + Math.cos(angle) * 248;
        const y = 470 + Math.sin(angle) * 180;
        g.fillStyle(color, 0.9).fillCircle(x, y, 7);
        g.lineStyle(3, color, 0.4).strokeCircle(x, y, 15);
      });
    }
  }

  destroy() {
    this.effects.destroy();
    this.graphics.destroy();
  }
}

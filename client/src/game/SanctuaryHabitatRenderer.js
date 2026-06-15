import Phaser from "phaser";
import { snakes } from "../data/snakes.js";
import { content, t } from "../i18n/localization.js";

// GRASP Pure Fabrication: Phaser habitat visuals stay separate from unlock and bond rules.
export class SanctuaryHabitatRenderer {
  constructor(scene, habitats) {
    this.scene = scene;
    this.habitats = habitats;
    this.views = [];
  }

  sync(habitatStates = {}, evolutionStatus = {}) {
    this.clear();
    this.habitats.forEach((habitat, index) => {
      const unlocked = Boolean(habitatStates[habitat.guardian]?.unlocked);
      this.views.push(this.createRoom(habitat, unlocked, Boolean(evolutionStatus[habitat.guardian]), index));
    });
  }

  createRoom(habitat, unlocked, evolved, index) {
    const snake = snakes[habitat.guardian];
    const container = this.scene.add.container(habitat.x, habitat.y).setDepth(4);
    const graphics = this.scene.add.graphics();
    container.add(graphics);

    if (unlocked) this.drawUnlockedRoom(graphics, habitat.kind, snake);
    else this.drawDormantRoom(graphics, snake);

    const texture = evolved ? snake.evolvedSpriteKey : snake.spriteKey;
    const portrait = this.scene.add.image(0, unlocked ? -7 : -4, texture)
      .setDisplaySize(evolved ? 88 : 76, evolved ? 88 : 76)
      .setAlpha(unlocked ? 1 : 0.32);
    if (!unlocked) portrait.setTint(0x77786f);
    container.add(portrait);

    const language = this.scene.save.settings?.language || "en";
    const habitatName = content("habitats", habitat.id, "name", habitat.name, language);
    const label = this.scene.add.text(
      0,
      62,
      unlocked ? habitatName : t("sleepingPrefix", language, { name: habitatName }),
      {
      fontFamily: "Fredoka, sans-serif",
      fontSize: "12px",
      color: unlocked ? snake.theme.ink : "#62665f",
      backgroundColor: unlocked ? `${snake.theme.soft}e8` : "#d8d4c0df",
      padding: { x: 8, y: 4 },
      align: "center"
    }).setOrigin(0.5).setStroke("#fff8dd", 2);
    container.add(label);

    if (unlocked) {
      this.scene.tweens.add({
        targets: portrait,
        y: portrait.y - 5,
        angle: index % 2 ? 2 : -2,
        duration: 1500 + index * 120,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut"
      });
      this.addAmbientMotion(container, habitat.kind, snake, index);
    }

    return { habitat, unlocked, evolved, container, portrait };
  }

  drawDormantRoom(g, snake) {
    g.fillStyle(0x63675d, 0.58).fillEllipse(0, 12, 154, 116);
    g.lineStyle(5, 0x444a43, 0.72).strokeEllipse(0, 12, 154, 116);
    g.fillStyle(0x8a8878, 0.72).fillRoundedRect(-62, -39, 124, 88, 28);
    g.lineStyle(3, snake.color, 0.28).strokeCircle(0, 0, 43);
    g.lineStyle(3, 0x4e514b, 0.75).beginPath()
      .moveTo(-52, 32).lineTo(-38, 19).lineTo(-24, 31)
      .moveTo(27, 33).lineTo(38, 18).lineTo(52, 30)
      .strokePath();
    g.fillStyle(0xe8d886, 0.55).fillCircle(-58, -33, 4).fillCircle(58, -28, 3);
  }

  drawUnlockedRoom(g, kind, snake) {
    g.fillStyle(snake.color, 0.18).fillCircle(0, 4, 78);
    g.lineStyle(4, snake.color, 0.52).strokeCircle(0, 4, 76);

    const draw = {
      water: () => this.drawWaterRoom(g),
      air: () => this.drawAirRoom(g),
      earth: () => this.drawEarthRoom(g),
      fire: () => this.drawFireRoom(g),
      lightning: () => this.drawStormRoom(g),
      nature: () => this.drawNatureRoom(g)
    }[kind];
    draw?.();
  }

  drawWaterRoom(g) {
    g.fillStyle(0x426c70, 0.86).fillRoundedRect(-72, -48, 144, 101, 48);
    g.fillStyle(0x55bfdc, 0.94).fillEllipse(0, 28, 135, 61);
    g.fillStyle(0x91e6ef, 0.8).fillEllipse(-12, 18, 86, 27);
    g.lineStyle(3, 0xd7ffff, 0.75).strokeEllipse(22, 31, 54, 15);
    g.lineStyle(4, 0x549351).beginPath()
      .moveTo(-58, 30).lineTo(-62, -4).moveTo(-50, 33).lineTo(-47, -9)
      .moveTo(56, 34).lineTo(61, 1).moveTo(47, 34).lineTo(44, 6).strokePath();
    g.fillStyle(0xefa6a3).fillTriangle(27, 37, 38, 31, 38, 42);
    g.fillStyle(0xffdc73).fillCircle(23, 36, 4);
  }

  drawAirRoom(g) {
    g.fillStyle(0xb5def1, 0.78).fillEllipse(0, 15, 150, 93);
    [-50, -25, 5, 34, 55].forEach((x, index) => {
      g.fillStyle(0xf7fbf4, 0.96).fillCircle(x, 18 - (index % 2) * 12, 25 - (index % 3) * 3);
    });
    g.fillStyle(0xd5d2b5).fillRoundedRect(-42, 31, 84, 19, 8);
    g.lineStyle(3, 0xffffff, 0.8).beginPath()
      .moveTo(-61, -18).quadraticBezierTo(-37, -36, -17, -17)
      .moveTo(22, -28).quadraticBezierTo(49, -43, 64, -20)
      .strokePath();
  }

  drawEarthRoom(g) {
    g.fillStyle(0x5d5043, 0.94).fillRoundedRect(-73, -49, 146, 105, 38);
    g.fillStyle(0x8c704f).fillEllipse(0, 33, 137, 50);
    [[-58, 31, 16], [-37, 42, 12], [39, 40, 15], [61, 28, 12]].forEach(([x, y, r]) => {
      g.fillStyle(0xb49469).fillCircle(x, y, r);
      g.lineStyle(2, 0x614b37).strokeCircle(x, y, r);
    });
    g.fillStyle(0x78d9dc).fillTriangle(-51, 2, -39, -30, -25, 2);
    g.fillStyle(0xb794e0).fillTriangle(36, 4, 48, -27, 58, 4);
    g.lineStyle(3, 0xe5d2a1).beginPath().arc(0, 38, 13, 0.2, Math.PI * 1.8).strokePath();
  }

  drawFireRoom(g) {
    g.fillStyle(0x6e493d, 0.9).fillEllipse(0, 15, 148, 102);
    g.fillStyle(0x9b6040).fillEllipse(0, 35, 124, 48);
    [-54, 54].forEach((x) => {
      g.fillStyle(0x593f37).fillRoundedRect(x - 8, -23, 16, 43, 6);
      g.fillStyle(0xffcf62, 0.95).fillCircle(x, -27, 9);
      g.fillStyle(0xff8738, 0.9).fillTriangle(x - 7, -25, x, -44, x + 7, -25);
    });
    g.lineStyle(4, 0x4f8647).beginPath()
      .moveTo(-43, 47).lineTo(-43, 27).moveTo(43, 47).lineTo(43, 25).strokePath();
    g.fillStyle(0x7fbd62).fillEllipse(-49, 28, 13, 7).fillEllipse(49, 26, 13, 7);
  }

  drawStormRoom(g) {
    g.fillStyle(0x3f4559, 0.96).fillRoundedRect(-65, -54, 130, 114, 20);
    g.fillStyle(0x616b7d).fillRoundedRect(-44, -43, 88, 94, 12);
    g.lineStyle(4, 0xf3d84f, 0.95).beginPath()
      .moveTo(-42, 36).lineTo(-18, 36).lineTo(-18, 12).lineTo(17, 12).lineTo(17, -17).lineTo(41, -17)
      .strokePath();
    [[-42, 36], [-18, 12], [17, 12], [41, -17]].forEach(([x, y]) => {
      g.fillStyle(0xffe86b).fillCircle(x, y, 6);
      g.lineStyle(2, 0xffffff, 0.75).strokeCircle(x, y, 10);
    });
    g.fillStyle(0xffe35e).fillTriangle(-8, -45, 9, -45, -2, -19).fillTriangle(-2, -19, 17, -19, -13, 16);
  }

  drawNatureRoom(g) {
    g.fillStyle(0x4f7d51, 0.92).fillRoundedRect(-72, -50, 144, 108, 48);
    g.fillStyle(0x76a859).fillEllipse(0, 35, 138, 52);
    g.lineStyle(5, 0x4a8d53).beginPath().arc(0, 14, 64, Math.PI, Math.PI * 2).strokePath();
    [-52, -25, 4, 33, 57].forEach((x, index) => {
      this.drawFlower(g, x, 34 - (index % 2) * 12, index % 2 ? 0xf39ab7 : 0xffd36e);
    });
    g.fillStyle(0xffd85f).fillCircle(-47, -19, 4).fillCircle(52, -12, 4);
    g.lineStyle(2, 0x3a4b39).beginPath()
      .moveTo(-53, -19).lineTo(-58, -24).moveTo(47, -12).lineTo(42, -17).strokePath();
    g.fillStyle(0xf39ab7).fillCircle(-9, -34, 7).fillCircle(9, -34, 7).fillTriangle(-16, -33, 16, -33, 0, -14);
  }

  drawFlower(g, x, y, color) {
    g.lineStyle(2, 0x447a42).beginPath().moveTo(x, y + 10).lineTo(x, y).strokePath();
    g.fillStyle(color).fillCircle(x - 5, y, 5).fillCircle(x + 5, y, 5)
      .fillCircle(x, y - 5, 5).fillCircle(x, y + 5, 5);
    g.fillStyle(0xffeb89).fillCircle(x, y, 3);
  }

  addAmbientMotion(container, kind, snake, index) {
    const particleCount = kind === "lightning" ? 4 : 3;
    for (let i = 0; i < particleCount; i++) {
      const particle = this.scene.add.circle(-45 + i * 35, -45 + (i % 2) * 18, 3 + (i % 2), snake.color, 0.8);
      container.add(particle);
      this.scene.tweens.add({
        targets: particle,
        y: particle.y - 15 - i * 3,
        alpha: 0.18,
        scale: 1.5,
        duration: 1000 + index * 80 + i * 170,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut"
      });
    }
  }

  nearest(x, y) {
    let nearestView = null;
    let nearestDistance = Number.POSITIVE_INFINITY;
    this.views.forEach((view) => {
      const distance = Phaser.Math.Distance.Between(x, y, view.habitat.x, view.habitat.y);
      if (distance <= view.habitat.radius + 42 && distance < nearestDistance) {
        nearestView = view;
        nearestDistance = distance;
      }
    });
    return nearestView;
  }

  promptNear(x, y) {
    const view = this.nearest(x, y);
    const language = this.scene.save.settings?.language || "en";
    if (!view) return "";
    const habitatName = content("habitats", view.habitat.id, "name", view.habitat.name, language);
    return view.unlocked
      ? t("visitHabitatPrompt", language, { guardian: view.habitat.guardian, habitat: habitatName })
      : t("inspectHabitatPrompt", language, { guardian: view.habitat.guardian });
  }

  clear() {
    this.views.forEach((view) => {
      view.container.list.forEach((child) => this.scene.tweens.killTweensOf(child));
      this.scene.tweens.killTweensOf(view.container);
      view.container.destroy(true);
    });
    this.views = [];
  }

  destroy() {
    this.clear();
  }
}

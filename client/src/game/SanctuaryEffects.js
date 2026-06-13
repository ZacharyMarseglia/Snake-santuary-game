import { upgradeById } from "../data/upgrades.js";

const ELEMENT_COLORS = [0x55c6e1, 0x8bcce9, 0xb58a58, 0xf07a35, 0xf3d84f, 0xee87ad];

// GRASP Pure Fabrication: animation lifecycle and camera effects stay out of landmark drawing.
export class SanctuaryEffects {
  constructor(scene) {
    this.scene = scene;
    this.objects = [];
    this.timers = [];
  }

  addLabel(x, y, text, restored, color) {
    const label = this.scene.add.text(x, y, restored ? `Restored: ${text}` : text, {
      fontFamily: "Trebuchet MS",
      fontStyle: "bold",
      fontSize: restored ? "12px" : "11px",
      color: restored ? "#fff9d8" : "#ded6b9",
      backgroundColor: restored ? `${color}ee` : "#494d45dd",
      padding: { x: 7, y: 3 }
    }).setOrigin(0.5).setDepth(6);
    this.objects.push(label);
  }

  animatePond() {
    for (let i = 0; i < 3; i++) {
      const ripple = this.add(
        this.scene.add.circle(375 + i * 36, 530 + (i % 2) * 27, 9, 0x8eeaff, 0)
          .setStrokeStyle(2, 0xd8ffff, 0.85).setDepth(5),
        { scale: 2.6, alpha: 0, duration: 1300 + i * 220, delay: i * 300, repeat: -1 }
      );
      ripple.setAlpha(0.8);
    }
    const fish = this.scene.add.graphics().setPosition(367, 553).setDepth(5);
    fish.fillStyle(0xffd36e).fillEllipse(0, 0, 17, 8).fillTriangle(-8, 0, -16, -7, -16, 7);
    this.add(fish, { x: 458, y: 539, duration: 2400, yoyo: true, repeat: -1, ease: "Sine.inOut" });
  }

  animateGarden() {
    [[610, 500], [694, 537], [636, 585]].forEach(([x, y], index) => {
      const butterfly = this.scene.add.graphics().setPosition(x, y).setDepth(6);
      butterfly.fillStyle(index % 2 ? 0xf6c85f : 0xf39ab8, 0.9)
        .fillEllipse(-5, 0, 9, 13).fillEllipse(5, 0, 9, 13);
      butterfly.fillStyle(0x57493d).fillEllipse(0, 1, 3, 11);
      this.add(butterfly, {
        x: x + 24 + index * 8,
        y: y - 18 - index * 6,
        angle: index % 2 ? 12 : -12,
        duration: 1200 + index * 260,
        yoyo: true,
        repeat: -1,
        ease: "Sine.inOut"
      });
    });
    for (let i = 0; i < 6; i++) {
      const petal = this.scene.add.ellipse(600 + i * 22, 494 + (i % 2) * 20, 8, 4, 0xee8fae, 0.8).setDepth(5);
      this.add(petal, { y: petal.y + 75, x: petal.x + (i % 2 ? 20 : -15), angle: 160, alpha: 0, duration: 1900 + i * 120, delay: i * 180, repeat: -1 });
    }
  }

  animateShrine() {
    const beam = this.scene.add.rectangle(550, 250, 75, 240, 0xffef9b, 0.12).setOrigin(0.5, 1).setDepth(2);
    this.add(beam, { alpha: 0.28, scaleX: 1.4, duration: 1500, yoyo: true, repeat: -1, ease: "Sine.inOut" });
    const orbit = this.scene.add.container(550, 335).setDepth(6);
    ELEMENT_COLORS.forEach((color, index) => {
      const angle = (Math.PI * 2 * index) / ELEMENT_COLORS.length;
      orbit.add(this.scene.add.circle(Math.cos(angle) * 68, Math.sin(angle) * 54, 9, color, 0.95)
        .setStrokeStyle(2, 0xfff5ca, 0.8));
    });
    this.add(orbit, { angle: 360, duration: 12000, repeat: -1 });
    this.add(this.scene.add.circle(550, 335, 25, 0xf8e58a, 0.12).setDepth(5), {
      scale: 2.1, alpha: 0, duration: 1350, repeat: -1
    });
  }

  animateLibrary() {
    const page = this.scene.add.graphics().setPosition(710, 421).setDepth(6);
    page.fillStyle(0xfff0c4, 0.92).fillTriangle(0, 0, 31, 7, 0, 20);
    page.lineStyle(2, 0xb27c4d, 0.7).beginPath().moveTo(0, 0).lineTo(0, 20).strokePath();
    this.add(page, { scaleX: 0.12, angle: -5, duration: 800, yoyo: true, repeat: -1, hold: 900, ease: "Sine.inOut" });
    this.add(this.scene.add.circle(710, 420, 31, 0xf6dc7a, 0.12).setDepth(5), {
      scale: 1.35, alpha: 0.03, duration: 1300, yoyo: true, repeat: -1
    });
  }

  animateFullyRestored() {
    for (let i = 0; i < 14; i++) {
      const angle = (Math.PI * 2 * i) / 14;
      const x = 545 + Math.cos(angle) * (210 + (i % 3) * 38);
      const y = 470 + Math.sin(angle) * (140 + (i % 2) * 35);
      this.add(this.scene.add.circle(x, y, 2 + (i % 3), ELEMENT_COLORS[i % ELEMENT_COLORS.length], 0.72).setDepth(5), {
        y: y - 28, alpha: 0.1, duration: 1200 + i * 90, yoyo: true, repeat: -1, ease: "Sine.inOut"
      });
    }
  }

  celebrate(upgradeId) {
    const upgrade = upgradeById[upgradeId];
    if (!upgrade) return;
    const color = Number.parseInt(upgrade.color.slice(1), 16);
    const { x, y } = upgrade.focus;
    const ring = this.scene.add.circle(x, y, 28, color, 0.28).setDepth(9);
    this.scene.tweens.add({ targets: ring, radius: 135, alpha: 0, duration: 950, onComplete: () => ring.destroy() });
    for (let i = 0; i < 26; i++) {
      const sparkle = this.scene.add.circle(x, y, 3 + (i % 4), ELEMENT_COLORS[i % ELEMENT_COLORS.length], 0.95).setDepth(10);
      const angle = (Math.PI * 2 * i) / 26;
      this.scene.tweens.add({
        targets: sparkle,
        x: x + Math.cos(angle) * (70 + (i % 5) * 17),
        y: y + Math.sin(angle) * (55 + (i % 4) * 15),
        scale: 0.3,
        alpha: 0,
        duration: 750 + (i % 5) * 90,
        ease: "Cubic.out",
        onComplete: () => sparkle.destroy()
      });
    }
    this.scene.cameras.main.flash(320, 255, 239, 168, false);
    if (this.scene.save.settings?.reducedMotion) return;

    const camera = this.scene.cameras.main;
    camera.stopFollow();
    camera.pan(x, y, 430, "Sine.easeInOut");
    camera.zoomTo(1.18, 430, "Sine.easeInOut");
    this.timers.push(this.scene.time.delayedCall(1500, () => {
      camera.pan(this.scene.player.x, this.scene.player.y, 420, "Sine.easeInOut");
      camera.zoomTo(1, 420, "Sine.easeInOut");
      this.timers.push(this.scene.time.delayedCall(440, () => camera.startFollow(this.scene.player, true, 0.12, 0.12)));
    }));
  }

  add(object, config) {
    this.objects.push(object);
    this.scene.tweens.add({ targets: object, ...config });
    return object;
  }

  clear() {
    this.objects.forEach((object) => {
      this.scene.tweens.killTweensOf(object);
      object.destroy();
    });
    this.objects = [];
  }

  destroy() {
    this.timers.forEach((timer) => timer.remove(false));
    this.timers = [];
    this.clear();
    if (this.scene.cameras?.main && this.scene.player) {
      this.scene.cameras.main.setZoom(1);
      this.scene.cameras.main.startFollow(this.scene.player, true, 0.12, 0.12);
    }
  }
}

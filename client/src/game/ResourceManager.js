import Phaser from "phaser";

// GRASP Information Expert: resource proximity, ownership, and harvesting live here.
export class ResourceManager {
  constructor(scene, spawns, collectedIds, onCollect) {
    this.scene = scene;
    this.spawns = spawns;
    this.collectedIds = new Set(collectedIds);
    this.onCollect = onCollect;
    this.pickups = [];
  }

  create() {
    this.spawns.filter((item) => !this.collectedIds.has(item.id)).forEach((item) => {
      const container = this.scene.add.container(item.x, item.y).setDepth(2);
      const glow = this.scene.add.circle(0, 0, 25, item.color, 0.14);
      const shadow = this.scene.add.ellipse(2, 14, 40, 15, 0x263d33, 0.25);
      const shape = this.scene.add.graphics();
      this.drawIcon(shape, item);
      const label = this.scene.add.text(0, 26, item.name, {
        fontFamily: "Trebuchet MS",
        fontSize: "12px",
        color: "#263f34",
        backgroundColor: "#fff8dcdd",
        padding: { x: 5, y: 2 }
      }).setOrigin(0.5, 0);
      container.add([glow, shadow, shape, label]);
      this.scene.tweens.add({
        targets: container,
        y: item.y - 6,
        duration: 900 + (item.x % 300),
        yoyo: true,
        repeat: -1,
        ease: "Sine.inOut"
      });
      this.scene.tweens.add({
        targets: glow,
        scale: 1.25,
        alpha: 0.04,
        duration: 1100,
        yoyo: true,
        repeat: -1
      });
      this.pickups.push({ ...item, gameObject: container });
    });
  }

  nearest(x, y, radius) {
    return this.pickups.reduce((nearest, pickup) => {
      const distance = Phaser.Math.Distance.Between(x, y, pickup.x, pickup.y);
      if (distance > radius || (nearest && nearest.distance <= distance)) return nearest;
      return { pickup, distance };
    }, null)?.pickup || null;
  }

  promptNear(x, y, radius, guardianName) {
    const pickup = this.nearest(x, y, radius);
    if (!pickup) return "";
    if (pickup.guardian !== guardianName) return `Needs ${article(pickup.element)} ${pickup.element} guardian.`;
    return `Press Space to harvest ${pickup.name} with ${guardianName}.`;
  }

  harvestNearest(x, y, radius, guardianName) {
    const pickup = this.nearest(x, y, radius);
    if (!pickup) return { status: "none" };
    if (pickup.guardian !== guardianName) {
      return {
        status: "wrong-guardian",
        item: pickup,
        message: `Needs ${article(pickup.element)} ${pickup.element} guardian.`
      };
    }

    this.pickups = this.pickups.filter((candidate) => candidate.id !== pickup.id);
    this.collectedIds.add(pickup.id);
    this.animateHarvest(pickup, x, y);
    this.onCollect({ id: pickup.id, name: pickup.name, areaId: pickup.areaId });
    return { status: "collected", item: pickup };
  }

  animateHarvest(pickup, x, y) {
    this.scene.tweens.add({
      targets: pickup.gameObject,
      x,
      y,
      scale: 0.2,
      alpha: 0,
      duration: this.scene.save.settings?.reducedMotion ? 60 : 260,
      ease: "Back.in",
      onComplete: () => pickup.gameObject.destroy()
    });
    for (let i = 0; i < 8; i++) {
      const sparkle = this.scene.add.circle(pickup.x, pickup.y, 2 + (i % 3), pickup.color, 0.95).setDepth(7);
      const angle = (Math.PI * 2 * i) / 8;
      this.scene.tweens.add({
        targets: sparkle,
        x: pickup.x + Math.cos(angle) * 42,
        y: pickup.y + Math.sin(angle) * 42,
        alpha: 0,
        duration: 360,
        onComplete: () => sparkle.destroy()
      });
    }
  }

  drawIcon(g, item) {
    g.fillStyle(0xfff4cf, 0.82).fillCircle(0, 0, 21);
    g.lineStyle(2.5, 0x405147, 0.68).strokeCircle(0, 0, 21);
    const color = item.color;

    if (item.kind === "drop") {
      g.fillStyle(color).fillTriangle(0, -17, -11, 4, 11, 4).fillCircle(0, 5, 11);
    } else if (item.kind === "reed") {
      g.lineStyle(4, 0x668b42).beginPath().moveTo(-8, 15).lineTo(-5, -14).moveTo(1, 15).lineTo(4, -17).moveTo(10, 15).lineTo(11, -10).strokePath();
      g.fillStyle(0xa87d3e).fillEllipse(-5, -13, 7, 13).fillEllipse(4, -16, 7, 13).fillEllipse(11, -9, 7, 13);
    } else if (item.kind === "flower") {
      g.fillStyle(color).fillCircle(0, -8, 8).fillCircle(-9, 0, 8).fillCircle(9, 0, 8).fillCircle(0, 9, 8);
      g.fillStyle(0xffe28a).fillCircle(0, 0, 5);
    } else if (item.kind === "cloud") {
      g.fillStyle(color).fillCircle(-10, 4, 10).fillCircle(0, -5, 13).fillCircle(11, 4, 10).fillEllipse(1, 8, 36, 14);
      g.lineStyle(2, 0x78929b, 0.7).strokeCircle(0, -3, 13);
    } else if (item.kind === "wisp") {
      g.lineStyle(5, color, 0.9).beginPath().arc(-2, 1, 13, 0.4, 5.6).strokePath();
      g.fillStyle(color).fillCircle(10, -8, 5).fillCircle(-10, 10, 4);
    } else if (item.kind === "leaf") {
      g.fillStyle(color).fillEllipse(-6, -3, 15, 26).fillEllipse(7, 4, 14, 24);
      g.lineStyle(2, 0x5f805f).beginPath().moveTo(-10, 12).lineTo(10, -13).strokePath();
    } else if (item.kind === "fossil") {
      g.fillStyle(color).fillRoundedRect(-15, -15, 30, 30, 8);
      g.lineStyle(2.5, 0x756b58).strokeRoundedRect(-15, -15, 30, 30, 8);
      g.beginPath().arc(0, 0, 10, 0, Math.PI * 1.75).arc(1, 0, 5, Math.PI * 1.75, 0).strokePath();
    } else if (item.kind === "crystal") {
      g.fillStyle(color).fillTriangle(-12, 14, -2, -17, 7, 14).fillTriangle(0, 14, 10, -10, 17, 14);
      g.lineStyle(2, 0xf5f3d7, 0.7).strokeTriangle(-12, 14, -2, -17, 7, 14);
    } else if (item.kind === "spark") {
      g.fillStyle(color).fillTriangle(-4, -18, 11, -5, 3, -4).fillTriangle(3, -5, -10, 18, -2, 2);
    } else if (item.kind === "seed") {
      g.fillStyle(color).fillEllipse(-7, -4, 10, 16).fillEllipse(7, 5, 10, 16);
    } else if (item.kind === "metal") {
      g.fillStyle(color).fillRoundedRect(-15, -10, 30, 20, 4);
      g.lineStyle(3, 0x667277).strokeRoundedRect(-15, -10, 30, 20, 4);
      g.fillStyle(0x586166).fillCircle(-8, 0, 3).fillCircle(8, 0, 3);
    } else {
      g.fillStyle(color, 0.9).fillCircle(-8, 4, 10).fillCircle(6, 5, 12).fillCircle(1, -8, 9);
      g.lineStyle(2, 0x554d48, 0.7).strokeCircle(1, -5, 12);
    }
  }

  destroy() {
    this.pickups.forEach((pickup) => pickup.gameObject.destroy());
    this.pickups = [];
  }
}

function article(element) {
  return /^[aeiou]/i.test(element) ? "an" : "a";
}

import Phaser from "phaser";
import { abilityName, challengeTargetLabel, t } from "../i18n/localization.js";

// GRASP Pure Fabrication: challenge visuals and proximity stay outside progress rules.
export class ChallengeRenderer {
  constructor(scene, challenge) {
    this.scene = scene;
    this.challenge = challenge;
    this.objects = [];
    this.targets = [];
    this.signature = "";
  }

  sync(progress = {}) {
    const safeProgress = progress && typeof progress === "object" ? progress : {};
    const completedTargetIds = Array.isArray(safeProgress.completedTargetIds)
      ? safeProgress.completedTargetIds.filter((id) => typeof id === "string")
      : [];
    const signature = JSON.stringify({ ...safeProgress, completedTargetIds });
    if (signature === this.signature) return;
    this.signature = signature;
    this.clear();

    if (!safeProgress.started && !safeProgress.completed) return;
    const completedIds = new Set(completedTargetIds);
    this.challenge.targets.forEach((target) => {
      const completed = completedIds.has(target.id);
      const gameObject = this.drawTarget(target, completed);
      this.targets.push({ ...target, completed, gameObject });
    });
  }

  nearest(x, y, radius) {
    return this.targets.reduce((nearest, target) => {
      if (target.completed) return nearest;
      const distance = Phaser.Math.Distance.Between(x, y, target.x, target.y);
      if (distance > radius || (nearest && nearest.distance <= distance)) return nearest;
      return { target, distance };
    }, null)?.target || null;
  }

  promptNear(x, y, radius) {
    const target = this.nearest(x, y, radius);
    const language = this.scene.save.settings?.language || "en";
    const label = target ? challengeTargetLabel(this.challenge.id, target, language) : "";
    return target ? t("challengeAbilityPrompt", language, {
      ability: abilityName(this.challenge.action, language),
      target: label
    }) : "";
  }

  animateAttempt(target) {
    const ring = this.scene.add.circle(target.x, target.y, 24, 0xffef9a, 0.7).setDepth(7);
    this.scene.tweens.add({
      targets: ring,
      radius: 58,
      alpha: 0,
      duration: this.scene.save.settings?.reducedMotion ? 80 : 420,
      onComplete: () => ring.destroy()
    });
  }

  drawTarget(target, completed) {
    const language = this.scene.save.settings?.language || "en";
    const targetLabel = challengeTargetLabel(this.challenge.id, target, language);
    const container = this.scene.add.container(target.x, target.y).setDepth(3);
    const shadow = this.scene.add.ellipse(0, 22, 70, 22, 0x26382f, 0.24);
    const glow = this.scene.add.circle(0, 0, completed ? 34 : 29, completed ? 0x9fe3a6 : 0xffd477, completed ? 0.2 : 0.14);
    const art = this.scene.add.graphics();
    this.drawKind(art, this.challenge.kind, completed, target);
    const label = this.scene.add.text(0, 38, completed ? t("restoredLabel", language) : targetLabel, {
      fontFamily: "Trebuchet MS",
      fontStyle: "bold",
      fontSize: "11px",
      color: completed ? "#315d3e" : "#654c2d",
      backgroundColor: completed ? "#e5f6dedd" : "#fff4cddd",
      padding: { x: 5, y: 2 }
    }).setOrigin(0.5, 0);
    container.add([shadow, glow, art, label]);

    if (!completed && !this.scene.save.settings?.reducedMotion) {
      this.scene.tweens.add({
        targets: glow,
        scale: 1.22,
        alpha: 0.04,
        duration: 950,
        yoyo: true,
        repeat: -1
      });
    }
    this.objects.push(container);
    return container;
  }

  drawKind(g, kind, completed, target) {
    if (kind === "stream") {
      g.lineStyle(16, completed ? 0x56c5df : 0x7b6549, 0.95).beginPath().moveTo(-31, 10).lineTo(31, -8).strokePath();
      if (!completed) g.fillStyle(0x695945).fillCircle(-13, 2, 10).fillCircle(5, 0, 12).fillCircle(20, -5, 9);
      else g.lineStyle(3, 0xd7fbff, 0.8).beginPath().moveTo(-24, 5).lineTo(23, -7).strokePath();
    } else if (kind === "cloud") {
      g.fillStyle(completed ? 0xe9fbff : 0xbfc8ca).fillCircle(-17, 2, 15).fillCircle(0, -9, 20).fillCircle(19, 3, 15).fillEllipse(1, 9, 66, 22);
      if (completed) g.fillStyle(0x69bfe1, 0.8).fillCircle(-12, 27, 4).fillCircle(4, 30, 4).fillCircle(19, 25, 4);
      else g.lineStyle(3, 0x82949a).beginPath().arc(0, 0, 25, 0.3, 5.4).strokePath();
    } else if (kind === "bridge") {
      g.fillStyle(completed ? 0xbda47a : 0x61584d).fillRoundedRect(-31, -13, 62, 27, 7);
      g.lineStyle(3, completed ? 0x6d624f : 0x3c3834).strokeRoundedRect(-31, -13, 62, 27, 7);
      if (!completed) g.lineStyle(4, 0x302d2a).beginPath().moveTo(-5, -11).lineTo(5, 2).lineTo(-2, 13).strokePath();
      else g.fillStyle(0x8bd4cc).fillTriangle(-6, 8, 2, -8, 10, 8);
    } else if (kind === "sprout") {
      if (!completed) {
        g.lineStyle(8, 0x4a3930).beginPath().moveTo(-28, 14).lineTo(28, -10).moveTo(-20, -10).lineTo(25, 15).strokePath();
      }
      g.lineStyle(4, 0x568b4c).beginPath().moveTo(0, 18).lineTo(0, -10).strokePath();
      g.fillStyle(completed ? 0x8fd06d : 0x688f58).fillEllipse(-9, -9, 20, 10).fillEllipse(10, -15, 20, 10);
    } else if (kind === "node") {
      g.fillStyle(completed ? 0xf5d94e : 0x282431).fillCircle(0, 0, 27);
      g.lineStyle(5, completed ? 0xfff2a0 : 0x9b8bb8).strokeCircle(0, 0, 21);
      g.fillStyle(completed ? 0x735b0b : 0xf5d94e).fillTriangle(-5, -17, 10, -3, 2, -2).fillTriangle(2, -3, -11, 18, -2, 3);
      this.objects.push(this.scene.add.text(target.x, target.y - 2, String(target.order), {
        fontFamily: "Trebuchet MS",
        fontStyle: "bold",
        fontSize: "12px",
        color: completed ? "#fff8cb" : "#30283f"
      }).setOrigin(0.5).setDepth(5));
    } else if (kind === "flower") {
      g.lineStyle(4, completed ? 0x4f8c55 : 0x756b5a).beginPath().moveTo(0, 24).lineTo(0, -4).strokePath();
      const color = completed ? 0xec83a5 : 0xa59a90;
      g.fillStyle(color).fillCircle(0, -15, 10).fillCircle(-11, -5, 10).fillCircle(11, -5, 10).fillCircle(0, 5, 10);
      g.fillStyle(completed ? 0xffdc6c : 0x776f62).fillCircle(0, -5, 6);
    }
  }

  clear() {
    this.objects.forEach((object) => object?.destroy?.());
    this.objects = [];
    this.targets = [];
  }

  destroy() {
    this.clear();
    this.signature = "";
  }
}

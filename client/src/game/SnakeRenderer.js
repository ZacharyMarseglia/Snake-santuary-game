// GRASP Pure Fabrication: visual presentation stays separate from movement and save logic.
export class SnakeRenderer {
  constructor(scene, parent, definition, name, evolved) {
    this.scene = scene;
    this.parent = parent;
    this.definition = definition;
    this.evolved = evolved;
    this.facing = 1;
    this.baseScale = evolved ? 0.3 : 0.23;

    this.shadow = scene.add.ellipse(0, 34, evolved ? 112 : 96, evolved ? 30 : 25, 0x26382f, 0.24);
    this.aura = scene.add.ellipse(0, 2, evolved ? 116 : 94, evolved ? 92 : 76, definition.accent, evolved ? 0.18 : 0.08);
    this.outerAura = evolved
      ? scene.add.ellipse(0, 2, 140, 112, definition.color, 0.06).setStrokeStyle(3, definition.accent, 0.34)
      : null;
    this.sprite = scene.add.image(
      0,
      -7,
      evolved ? definition.evolvedSpriteKey : definition.spriteKey
    ).setOrigin(0.5, 0.62).setScale(this.baseScale);
    this.label = scene.add.text(0, evolved ? -72 : -64, evolved ? definition.evolution : name, {
      fontFamily: "Georgia",
      fontStyle: "bold",
      fontSize: "14px",
      color: "#2d4438",
      backgroundColor: "#fff7d8dd",
      padding: { x: 7, y: 3 }
    }).setOrigin(0.5);

    this.elementLights = evolved
      ? Array.from({ length: 6 }, (_, index) => (
        scene.add.circle(0, 0, index % 2 ? 3 : 4, index % 2 ? definition.color : definition.accent, 0.76)
      ))
      : [];
    parent.add([
      this.shadow,
      ...(this.outerAura ? [this.outerAura] : []),
      this.aura,
      ...this.elementLights,
      this.sprite,
      this.label
    ]);
  }

  update(time, moving, velocityX) {
    if (Math.abs(velocityX) > 2) this.facing = Math.sign(velocityX);
    const reduced = this.scene.save.settings?.reducedMotion;
    const bob = reduced ? 0 : Math.sin(time * 0.0065) * (moving ? 3.4 : 1.8);
    const squash = reduced ? 1 : 1 + Math.sin(time * 0.008) * (moving ? 0.018 : 0.009);
    const tilt = reduced ? 0 : Math.sin(time * 0.0048) * (moving ? 0.045 : 0.022);

    this.sprite.y = -7 + bob;
    this.sprite.rotation = tilt * this.facing;
    this.sprite.setScale(this.baseScale * this.facing * squash, this.baseScale / squash);
    this.aura.y = bob * 0.35;
    this.aura.alpha = (this.evolved ? 0.17 : 0.07) + (reduced ? 0 : Math.sin(time * 0.004) * 0.025);
    if (this.outerAura) {
      this.outerAura.rotation = reduced ? 0 : time * 0.00035;
      this.outerAura.alpha = reduced ? 0.08 : 0.07 + Math.sin(time * 0.003) * 0.025;
    }
    this.elementLights.forEach((light, index) => {
      const angle = time * 0.0011 + (Math.PI * 2 * index) / this.elementLights.length;
      const radiusX = 63 + (index % 2) * 7;
      const radiusY = 45 + (index % 3) * 4;
      light.setPosition(Math.cos(angle) * radiusX, Math.sin(angle) * radiusY + bob * 0.3);
      light.alpha = reduced ? 0.58 : 0.55 + Math.sin(time * 0.006 + index) * 0.25;
    });
    this.shadow.scaleX = moving && !reduced ? 1.08 : 1;
    this.label.y = (this.evolved ? -72 : -64) + bob * 0.45;
  }

  destroy() {
    this.shadow.destroy();
    this.aura.destroy();
    this.outerAura?.destroy();
    this.elementLights.forEach((light) => light.destroy());
    this.sprite.destroy();
    this.label.destroy();
  }
}

import Phaser from "phaser";

class GuardianAbility {
  harvest(context) {
    return context.resourceManager?.harvestNearest(
      context.player.x,
      context.player.y,
      context.evolved ? 150 : 112,
      context.guardianName
    ) || { status: "none" };
  }
}

class HarvestAbility extends GuardianAbility {
  use(context) {
    return { harvest: this.harvest(context), moved: false };
  }
}

class DashAbility extends GuardianAbility {
  constructor(distance) {
    super();
    this.distance = distance;
  }

  use(context) {
    const harvest = this.harvest(context);
    const direction = context.player.body.velocity.clone().normalize();
    if (direction.lengthSq() === 0) direction.set(1, 0);
    context.player.setPosition(
      Phaser.Math.Clamp(context.player.x + direction.x * this.distance, 35, context.worldWidth - 35),
      Phaser.Math.Clamp(context.player.y + direction.y * this.distance, 35, context.worldHeight - 35)
    );
    return { harvest, moved: true };
  }
}

// GRASP Polymorphism: all guardian abilities harvest through one interface, then specialize.
export function createAbility(snake) {
  return snake.abilityType === "dash" ? new DashAbility(snake.dashDistance) : new HarvestAbility();
}

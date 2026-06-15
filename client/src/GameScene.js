import Phaser from "phaser";
import {
  areas,
  normalizeAreaId,
  normalizeAreaPosition,
  resolveAreaId,
  WORLD_SIZE
} from "./data/areas.js";
import { challengeByAreaId } from "./data/challenges.js";
import { habitats } from "./data/habitats.js";
import { resourceSpawnsByArea } from "./data/resources.js";
import { snakes } from "./data/snakes.js";
import { createAbility } from "./game/abilities.js";
import { AreaManager } from "./game/AreaManager.js";
import { AreaRenderer } from "./game/AreaRenderer.js";
import { ChallengeRenderer } from "./game/ChallengeRenderer.js";
import { ResourceManager } from "./game/ResourceManager.js";
import { SanctuaryRenderer } from "./game/SanctuaryRenderer.js";
import { SanctuaryHabitatRenderer } from "./game/SanctuaryHabitatRenderer.js";
import { SnakeRenderer } from "./game/SnakeRenderer.js";
import { abilityName, areaName, t } from "./i18n/localization.js";

export class GameScene extends Phaser.Scene {
  constructor() {
    super("world");
  }

  init(data) {
    this.save = data.save;
    this.eventsOut = data.eventsOut;
    this.abilityReadyAt = 0;
    this.lastPositionSentAt = 0;
    this.lastPrompt = "";
    this.isPaused = false;
    this.isTransitioning = false;
    this.transitionTimer = null;
  }

  preload() {
    this.load.on("loaderror", (file) => {
      console.warn(`[Scale Guardians] Asset failed to load: ${file?.key || file?.src || "unknown asset"}`);
    });
    Object.values(snakes).forEach((snake) => {
      if (!this.textures.exists(snake.spriteKey)) this.load.image(snake.spriteKey, snake.sprite);
      if (!this.textures.exists(snake.evolvedSpriteKey)) {
        this.load.image(snake.evolvedSpriteKey, snake.evolvedSprite);
      }
    });
  }

  create() {
    this.physics.world.setBounds(0, 0, WORLD_SIZE.width, WORLD_SIZE.height);
    this.cameras.main.setBounds(0, 0, WORLD_SIZE.width, WORLD_SIZE.height);
    this.cameras.main.setBackgroundColor("#789f72");
    this.resetCameraOverlay();

    const savedAreaId = resolveAreaId(this.save.currentArea);
    if (!savedAreaId && this.save.currentArea) {
      console.warn(`[Scale Guardians] Invalid saved area "${this.save.currentArea}". Loading Sanctuary.`);
    }
    const requestedArea = areas[savedAreaId || "sanctuary"];
    const initialAreaId = requestedArea.guardian && requestedArea.guardian !== this.save.selectedSnake
      ? "sanctuary"
      : requestedArea.id;

    // GRASP Creator/Controller: the scene coordinates focused area, resource, and rendering objects.
    this.areaManager = new AreaManager(areas, initialAreaId);
    this.areaRenderer = new AreaRenderer(this);
    this.obstacles = this.physics.add.staticGroup();
    this.createPlayer();
    this.physics.add.collider(this.player, this.obstacles);
    this.renderArea(initialAreaId, false);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys("W,A,S,D,SPACE,E");
    this.input.keyboard.on("keydown-SPACE", () => this.useAbility());
    this.input.keyboard.on("keydown-E", () => this.interact());
    this.input.keyboard.on("keydown-ESC", () => this.eventsOut({ type: "pause" }));
    this.input.keyboard.on("keydown-P", () => this.eventsOut({ type: "pause" }));
    this.input.on("pointerdown", (pointer) => {
      if (pointer.rightButtonDown()) return;
      this.target = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
    });

    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.transitionTimer?.remove(false);
      this.transitionTimer = null;
      this.resetCameraOverlay();
    });
    this.eventsOut({ type: "ready" });
    this.emitArea();
  }

  createPlayer() {
    this.player = this.add.container(550, 430).setDepth(8);
    this.physics.add.existing(this.player);
    this.player.body.setCircle(25, -25, -25).setCollideWorldBounds(true);
    this.createSnakeRenderer();
  }

  createSnakeRenderer() {
    this.snakeRenderer?.destroy();
    this.player.removeAll(false);
    const snake = snakes[this.save.selectedSnake];
    const evolved = this.save.snakeEvolutionStatus[this.save.selectedSnake];
    this.snakeRenderer = new SnakeRenderer(this, this.player, snake, this.save.selectedSnake, evolved);
  }

  renderArea(areaId, transition = true) {
    // A completed Phaser fade-out keeps drawing until reset, so always clear it before rebuilding an area.
    this.resetCameraOverlay();
    const normalizedAreaId = normalizeAreaId(areaId);
    if (normalizedAreaId !== areaId) {
      console.warn(`[Scale Guardians] Unknown area "${areaId}". Loading Sanctuary.`);
    }
    const area = areas[normalizedAreaId];
    this.areaManager.currentAreaId = area.id;
    this.target = null;
    this.resourceManager?.destroy();
    this.resourceManager = null;
    this.sanctuaryRenderer?.destroy();
    this.sanctuaryRenderer = null;
    this.habitatRenderer?.destroy();
    this.habitatRenderer = null;
    this.challengeRenderer?.destroy();
    this.challengeRenderer = null;
    this.obstacles.clear(true, true);

    const obstacles = this.areaRenderer.render(area);
    obstacles.forEach((obstacle) => {
      const body = this.add.rectangle(obstacle.x, obstacle.y, obstacle.w, obstacle.h, 0x000000, 0);
      this.physics.add.existing(body, true);
      this.obstacles.add(body);
    });

    if (area.id === "sanctuary") {
      this.sanctuaryRenderer = new SanctuaryRenderer(this, 120);
      this.sanctuaryRenderer.render(this.save.sanctuaryUpgrades);
      this.habitatRenderer = new SanctuaryHabitatRenderer(this, habitats);
      this.habitatRenderer.sync(this.save.habitatStates, this.save.snakeEvolutionStatus);
    } else {
      const spawns = resourceSpawnsByArea[area.id];
      if (!Array.isArray(spawns) || !spawns.length) {
        console.warn(`[Scale Guardians] No resource spawn data for "${area.id}". The player will still be rendered.`);
      }
      this.resourceManager = new ResourceManager(
        this,
        spawns,
        (item) => this.eventsOut({ type: "pickup", item })
      );
      try {
        this.resourceManager.create();
      } catch (error) {
        console.error(`[Scale Guardians] Resource rendering failed in ${area.name}.`, error);
        this.resourceManager.destroy();
        this.resourceManager = null;
      }
      const challenge = challengeByAreaId[area.id];
      if (challenge) {
        this.challengeRenderer = new ChallengeRenderer(this, challenge);
        try {
          this.challengeRenderer.sync(this.save.challengeProgress?.[challenge.id]);
        } catch (error) {
          console.error(`[Scale Guardians] Challenge rendering failed in ${area.name}.`, error);
          this.challengeRenderer.destroy();
          this.challengeRenderer = null;
        }
      }
    }

    const savedPosition = this.save.positionsByArea?.[area.id];
    const spawn = transition
      ? { ...area.spawn }
      : normalizeAreaPosition(savedPosition || this.save.position, area.id);
    this.player.setPosition(spawn.x, spawn.y);
    this.player.setActive(true).setVisible(true).setDepth(8);
    this.player.body.setVelocity(0, 0);
    this.cameras.main.setBackgroundColor(`#${area.colors.ground.toString(16).padStart(6, "0")}`);
    this.resetCameraOverlay();
    this.setPrompt("");
    return area;
  }

  enterArea(areaId) {
    if (this.isTransitioning) return false;
    const result = this.areaManager.enter(
      areaId,
      this.save.selectedSnake,
      this.save.settings?.language || "en"
    );
    if (!result.ok) {
      this.eventsOut({ type: "warning", message: result.message });
      this.cameras.main.shake(170, 0.004);
      return false;
    }
    this.isTransitioning = true;
    this.transitionTimer?.remove(false);
    this.resetCameraOverlay();
    this.cameras.main.fadeOut(170, 34, 49, 40);
    this.transitionTimer = this.time.delayedCall(180, () => {
      try {
        // Remove the completed fade-out before the new world is shown or a story modal pauses gameplay.
        this.resetCameraOverlay();
        this.renderArea(result.area.id, true);
        this.emitArea();
      } catch (error) {
        console.error(`[Scale Guardians] Area transition to ${result.area.name} failed. Returning to Sanctuary.`, error);
        this.renderArea("sanctuary", true);
        this.emitArea();
      } finally {
        this.isTransitioning = false;
        this.transitionTimer = null;
        this.resetCameraOverlay();
      }
    });
    return true;
  }

  resetCameraOverlay() {
    const camera = this.cameras?.main;
    if (!camera) return;
    camera.resetFX();
    if (camera.fadeEffect) {
      camera.fadeEffect.alpha = 0;
      camera.fadeEffect.progress = 0;
    }
    camera.setAlpha(1);
  }

  returnToSanctuary() {
    if (this.areaManager.currentAreaId === "sanctuary") return;
    this.enterArea("sanctuary");
  }

  interact() {
    if (this.isPaused) return;
    const interaction = this.areaManager.interactionNear(this.player.x, this.player.y);
    const habitatView = this.habitatRenderer?.nearest(this.player.x, this.player.y);
    if (!interaction) {
      if (habitatView) {
        this.eventsOut({ type: "habitat", guardian: habitatView.habitat.guardian });
        return;
      }
      this.eventsOut({
        type: "warning",
        message: t("moveCloserInteraction", this.save.settings?.language || "en")
      });
      return;
    }
    if (interaction.type === "workbench") {
      this.eventsOut({ type: "workbench" });
      return;
    }
    this.enterArea(interaction.targetArea.id);
  }

  update(time) {
    const fade = this.cameras.main.fadeEffect;
    if (!this.isTransitioning && (fade.isRunning || fade.isComplete || fade.alpha > 0.001)) {
      this.resetCameraOverlay();
    }
    if (this.isPaused) return;
    const snake = snakes[this.save.selectedSnake];
    let dx = 0;
    let dy = 0;
    if (this.cursors.left.isDown || this.keys.A.isDown) dx -= 1;
    if (this.cursors.right.isDown || this.keys.D.isDown) dx += 1;
    if (this.cursors.up.isDown || this.keys.W.isDown) dy -= 1;
    if (this.cursors.down.isDown || this.keys.S.isDown) dy += 1;

    if (!dx && !dy && this.target) {
      const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.target.x, this.target.y);
      if (distance > 10) {
        dx = this.target.x - this.player.x;
        dy = this.target.y - this.player.y;
      } else {
        this.target = null;
      }
    }

    const velocity = new Phaser.Math.Vector2(dx, dy);
    const moving = velocity.lengthSq() > 0;
    if (moving) velocity.normalize().scale(snake.speed);
    const ease = this.save.settings?.reducedMotion ? 0.35 : 0.16;
    this.player.body.velocity.lerp(velocity, ease);
    if (!moving && this.player.body.velocity.length() < 5) this.player.body.setVelocity(0, 0);
    this.snakeRenderer.update(time, moving, this.player.body.velocity.x);
    this.updatePrompt();

    if (time - this.lastPositionSentAt > 700) {
      this.lastPositionSentAt = time;
      this.eventsOut({
        type: "position",
        areaId: this.areaManager.currentAreaId,
        position: { x: Math.round(this.player.x), y: Math.round(this.player.y) }
      });
    }
  }

  updatePrompt() {
    const interaction = this.areaManager.interactionNear(this.player.x, this.player.y);
    const portalPrompt = this.areaManager.promptFor(
      interaction,
      this.save.selectedSnake,
      this.save.settings?.language || "en"
    );
    const habitatPrompt = this.habitatRenderer?.promptNear(this.player.x, this.player.y) || "";
    const harvestPrompt = this.resourceManager?.promptNear(
      this.player.x,
      this.player.y,
      this.save.snakeEvolutionStatus[this.save.selectedSnake] ? 170 : 118,
      this.save.selectedSnake
    ) || "";
    const challengePrompt = this.challengeRenderer?.promptNear(
      this.player.x,
      this.player.y,
      this.save.snakeEvolutionStatus[this.save.selectedSnake] ? 170 : 118
    ) || "";
    this.setPrompt(portalPrompt || habitatPrompt || challengePrompt || harvestPrompt);
  }

  setPrompt(message) {
    if (message === this.lastPrompt) return;
    this.lastPrompt = message;
    this.eventsOut({ type: "prompt", message });
  }

  useAbility() {
    if (this.isPaused) return;
    const now = this.time.now;
    const name = this.save.selectedSnake;
    const snake = snakes[name];
    const area = this.areaManager.current();
    const language = this.save.settings?.language || "en";

    if (area.guardian && area.guardian !== name) {
      this.eventsOut({
        type: "warning",
        message: t("wrongBiome", language, {
          area: areaName(area.name, language),
          guardian: area.guardian
        })
      });
      return;
    }
    if (now < this.abilityReadyAt) {
      const seconds = Math.max(0.1, (this.abilityReadyAt - now) / 1000).toFixed(1);
      this.eventsOut({
        type: "warning",
        message: t("abilityCooldown", language, {
          ability: abilityName(snake.ability, language),
          seconds
        })
      });
      return;
    }

    const evolved = this.save.snakeEvolutionStatus[name];
    const abilityRadius = evolved ? 170 : 118;
    const challengeTarget = this.challengeRenderer?.nearest(
      this.player.x,
      this.player.y,
      abilityRadius
    );
    const result = createAbility(snake).use({
      guardianName: name,
      player: this.player,
      resourceManager: challengeTarget ? null : this.resourceManager,
      evolved,
      worldWidth: WORLD_SIZE.width,
      worldHeight: WORLD_SIZE.height
    });

    this.abilityReadyAt = now + (evolved ? 560 : 1050);
    const ring = this.add.circle(this.player.x, this.player.y, 25, snake.accent, 0.25).setDepth(7);
    this.tweens.add({ targets: ring, radius: evolved ? 180 : 125, alpha: 0, duration: 520, onComplete: () => ring.destroy() });
    if (evolved) {
      const outerRing = this.add.circle(this.player.x, this.player.y, 38, snake.color, 0.04)
        .setStrokeStyle(5, snake.accent, 0.6)
        .setDepth(7);
      this.tweens.add({
        targets: outerRing,
        radius: 205,
        alpha: 0,
        angle: 90,
        duration: 700,
        ease: "Cubic.easeOut",
        onComplete: () => outerRing.destroy()
      });
      for (let index = 0; index < 8; index++) {
        const angle = (Math.PI * 2 * index) / 8;
        const spark = this.add.circle(this.player.x, this.player.y, index % 2 ? 4 : 6, snake.accent, 0.9).setDepth(9);
        this.tweens.add({
          targets: spark,
          x: this.player.x + Math.cos(angle) * 178,
          y: this.player.y + Math.sin(angle) * 178,
          alpha: 0,
          scale: 0.35,
          duration: 620,
          ease: "Cubic.easeOut",
          onComplete: () => spark.destroy()
        });
      }
    }

    if (challengeTarget) {
      this.challengeRenderer.animateAttempt(challengeTarget);
      this.eventsOut({
        type: "challenge-action",
        challengeId: this.challengeRenderer.challenge.id,
        targetId: challengeTarget.id,
        ability: snake.harvestAction || snake.ability
      });
    } else if (result.harvest.status === "wrong-guardian") {
      this.eventsOut({ type: "warning", message: result.harvest.message });
    } else if (result.harvest.status === "collected") {
      this.eventsOut({
        type: "ability",
        name: snake.harvestAction || snake.ability,
        harvested: result.harvest.item.name
      });
    } else if (!this.resourceManager) {
      this.eventsOut({ type: "warning", message: t("noRawResources", language) });
    } else if (this.resourceManager.hasPickups()) {
      this.eventsOut({ type: "warning", message: t("tooFarResource", language) });
    } else {
      this.eventsOut({ type: "warning", message: t("biomeHarvested", language) });
    }
    this.updatePrompt();
  }

  emitArea() {
    const area = this.areaManager.current();
    this.eventsOut({ type: "area", area, storyScene: area.story });
  }

  applySave(nextSave) {
    const snakeChanged = nextSave.selectedSnake !== this.save.selectedSnake;
    const upgradesChanged = nextSave.sanctuaryUpgrades.length !== this.save.sanctuaryUpgrades.length;
    const addedUpgradeId = nextSave.sanctuaryUpgrades.find(
      (upgradeId) => !this.save.sanctuaryUpgrades.includes(upgradeId)
    );
    const evolutionChanged = JSON.stringify(nextSave.snakeEvolutionStatus) !== JSON.stringify(this.save.snakeEvolutionStatus);
    const challengeProgressChanged = JSON.stringify(nextSave.challengeProgress) !== JSON.stringify(this.save.challengeProgress);
    const habitatStatesChanged = JSON.stringify(nextSave.habitatStates) !== JSON.stringify(this.save.habitatStates);
    const languageChanged = nextSave.settings?.language !== this.save.settings?.language;
    this.save = nextSave;

    const area = this.areaManager.current();
    if (area.guardian && area.guardian !== this.save.selectedSnake) {
      this.enterArea("sanctuary");
      return;
    }
    if (snakeChanged || evolutionChanged) this.createSnakeRenderer();
    if (languageChanged) {
      const position = { x: this.player.x, y: this.player.y };
      this.renderArea(area.id, false);
      this.player.setPosition(position.x, position.y);
      this.updatePrompt();
      return;
    }
    if (upgradesChanged && this.areaManager.currentAreaId === "sanctuary") {
      this.sanctuaryRenderer?.render(this.save.sanctuaryUpgrades, {
        animate: Boolean(addedUpgradeId),
        upgradeId: addedUpgradeId
      });
    }
    if ((habitatStatesChanged || evolutionChanged) && this.habitatRenderer) {
      this.habitatRenderer.sync(this.save.habitatStates, this.save.snakeEvolutionStatus);
    }
    if ((challengeProgressChanged || languageChanged) && this.challengeRenderer) {
      const challenge = this.challengeRenderer.challenge;
      if (languageChanged) this.challengeRenderer.signature = "";
      this.challengeRenderer.sync(this.save.challengeProgress?.[challenge.id]);
    }
  }

  setPaused(paused) {
    this.isPaused = paused;
    this.target = null;
    this.player?.body?.setVelocity(0, 0);
    if (paused && !this.isTransitioning) this.resetCameraOverlay();
    if (paused) {
      this.physics.world.pause();
      this.tweens.pauseAll();
    } else {
      this.physics.world.resume();
      this.tweens.resumeAll();
    }
  }
}

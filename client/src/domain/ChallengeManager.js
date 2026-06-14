import { InventoryManager } from "./InventoryManager.js";

// GRASP Information Expert: challenge rules live with challenge progress data.
export class ChallengeManager {
  constructor(challenges) {
    this.challenges = Object.fromEntries(challenges.map((challenge) => [challenge.id, challenge]));
  }

  definition(challengeId) {
    return this.challenges[challengeId] || null;
  }

  progress(save, challengeId) {
    return save.challengeProgress?.[challengeId] || {
      started: false,
      completed: false,
      completedTargetIds: []
    };
  }

  start(save, challengeId) {
    const challenge = this.definition(challengeId);
    if (!challenge) return save;
    const current = this.progress(save, challengeId);
    if (current.started || current.completed) return save;
    return {
      ...save,
      challengeProgress: {
        ...(save.challengeProgress || {}),
        [challengeId]: {
          ...current,
          started: true,
          startedAt: Date.now()
        }
      }
    };
  }

  advance(save, challengeId, targetId) {
    const challenge = this.definition(challengeId);
    if (!challenge) return this.rejected(save, "That restoration challenge is still hidden.");
    const current = this.progress(save, challengeId);
    if (!current.started) return this.rejected(save, "Open the restoration challenge before using your ability here.");
    if (current.completed) return this.rejected(save, "This biome restoration challenge is already complete.");

    const target = challenge.targets.find((candidate) => candidate.id === targetId);
    if (!target) return this.rejected(save, "That restoration point could not be found.");
    if (current.completedTargetIds.includes(targetId)) {
      return this.rejected(save, `${target.label} is already restored.`);
    }

    if (challenge.ordered) {
      const expected = challenge.targets[current.completedTargetIds.length];
      if (expected?.id !== targetId) {
        return this.rejected(save, `The circuit needs ${expected.label} next. Follow the numbers from 1 to 4.`);
      }
    }

    const completedTargetIds = [...current.completedTargetIds, targetId];
    const completed = completedTargetIds.length === challenge.targets.length;
    const nextProgress = {
      ...current,
      started: true,
      completed,
      completedTargetIds,
      ...(completed ? { completedAt: Date.now() } : {})
    };
    const inventory = completed
      ? new InventoryManager(save.inventory).addMany(challenge.reward).toJSON()
      : save.inventory;
    const nextSave = {
      ...save,
      inventory,
      challengeProgress: {
        ...(save.challengeProgress || {}),
        [challengeId]: nextProgress
      }
    };

    return {
      save: nextSave,
      accepted: true,
      completed,
      progress: completedTargetIds.length,
      target: challenge.targets.length,
      message: completed
        ? `${challenge.title} complete!`
        : `${target.label} restored. ${completedTargetIds.length} of ${challenge.targets.length}.`
    };
  }

  rejected(save, message) {
    return { save, accepted: false, completed: false, message };
  }
}

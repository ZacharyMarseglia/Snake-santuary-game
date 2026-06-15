import { InventoryManager } from "./InventoryManager.js";
import { challengeTargetLabel, content, t } from "../i18n/localization.js";

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
    const language = save.settings?.language || "en";
    const challenge = this.definition(challengeId);
    if (!challenge) return this.rejected(save, t("challengeHidden", language));
    const current = this.progress(save, challengeId);
    if (!current.started) return this.rejected(save, t("challengeNotStarted", language));
    if (current.completed) return this.rejected(save, t("challengeAlreadyComplete", language));

    const target = challenge.targets.find((candidate) => candidate.id === targetId);
    if (!target) return this.rejected(save, t("restorationPointMissing", language));
    const targetLabel = challengeTargetLabel(challenge.id, target, language);
    if (current.completedTargetIds.includes(targetId)) {
      return this.rejected(save, t("targetAlreadyRestored", language, { target: targetLabel }));
    }

    if (challenge.ordered) {
      const expected = challenge.targets[current.completedTargetIds.length];
      if (expected?.id !== targetId) {
        const expectedLabel = challengeTargetLabel(challenge.id, expected, language);
        return this.rejected(save, t("circuitNext", language, { target: expectedLabel }));
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
        ? t("challengeCompleteMessage", language, {
          title: content("challenges", challenge.id, "title", challenge.title, language)
        })
        : t("targetRestoredProgress", language, {
          target: targetLabel,
          current: completedTargetIds.length,
          total: challenge.targets.length
        })
    };
  }

  rejected(save, message) {
    return { save, accepted: false, completed: false, message };
  }
}

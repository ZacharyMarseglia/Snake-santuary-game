// GRASP Information Expert: this manager owns habitat unlock and bond calculations.
export class SanctuaryHabitatManager {
  constructor(habitats) {
    this.habitats = habitats;
    this.byGuardian = Object.fromEntries(
      habitats.map((habitat) => [habitat.guardian, habitat])
    );
  }

  synchronize(save) {
    const currentStates = save.habitatStates || {};
    let changed = false;
    const habitatStates = {};

    this.habitats.forEach((habitat) => {
      const current = currentStates[habitat.guardian] || { unlocked: false };
      const unlocked = Boolean(current.unlocked || this.isUnlockEligible(save, habitat));
      habitatStates[habitat.guardian] = { ...current, unlocked };
      if (!currentStates[habitat.guardian] || current.unlocked !== unlocked) changed = true;
    });

    if (!changed && Object.keys(currentStates).length === this.habitats.length) return save;
    return { ...save, habitatStates };
  }

  isUnlockEligible(save, habitat) {
    const challengeComplete = Boolean(save.challengeProgress?.[habitat.challengeId]?.completed);
    const upgradeComplete = habitat.upgradeIds.some((id) => save.sanctuaryUpgrades?.includes(id));
    return challengeComplete || upgradeComplete;
  }

  profile(save, guardianName) {
    const habitat = this.byGuardian[guardianName];
    if (!habitat) return null;

    const state = save.habitatStates?.[guardianName] || { unlocked: false };
    const challenge = save.challengeProgress?.[habitat.challengeId];
    const targetCount = challenge?.completedTargetIds?.length || 0;
    const targetTotal = this.challengeTargetTotal(habitat.challengeId);
    const challengeRatio = targetTotal ? Math.min(1, targetCount / targetTotal) : 0;
    const upgradeCount = habitat.upgradeIds.filter((id) => save.sanctuaryUpgrades?.includes(id)).length;
    const upgradeRatio = habitat.upgradeIds.length ? upgradeCount / habitat.upgradeIds.length : 0;
    const evolved = Boolean(save.snakeEvolutionStatus?.[guardianName]);
    const bond = Math.min(100, Math.round(challengeRatio * 50 + upgradeRatio * 30 + (evolved ? 20 : 0)));

    return {
      ...habitat,
      unlocked: Boolean(state.unlocked),
      bond,
      evolved,
      challengeProgress: { current: targetCount, total: targetTotal },
      upgradeProgress: { current: upgradeCount, total: habitat.upgradeIds.length }
    };
  }

  challengeTargetTotal(challengeId) {
    const habitat = this.habitats.find((candidate) => candidate.challengeId === challengeId);
    return habitat?.targetCount || 0;
  }
}

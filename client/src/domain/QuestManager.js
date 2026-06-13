// GRASP Information Expert: quest selection, progress, and rewards are cohesive here.
export class QuestManager {
  constructor(questDefinitions) {
    this.quests = questDefinitions;
  }

  active(completedIds) {
    return this.quests.find((quest) => !completedIds.includes(quest.id)) || this.quests.at(-1);
  }

  progress(quest, save) {
    if (quest.target.type === "resource") return save.inventory[quest.target.key] || 0;
    if (quest.target.type === "stories") return save.storyScenesSeen.length;
    return save.sanctuaryUpgrades.length;
  }

  findCompleted(save) {
    return this.quests.find((quest) =>
      !save.completedQuests.includes(quest.id) &&
      this.progress(quest, save) >= quest.target.count
    );
  }
}

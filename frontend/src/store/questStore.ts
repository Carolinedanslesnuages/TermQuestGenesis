import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type {
  Quest,
  QuestStatus,
  CreateQuestData,
  UpdateQuestData,
  QuestFilters,
} from "@domain/quests/quest";
import { QuestApi } from "@infrastructure/quests/questApi";

/**
 * Pinia store for quest management
 * Provides centralized state management for quests with actions and getters
 */
export const useQuestStore = defineStore("quest", () => {
  // State
  const quests = ref<Quest[]>([]);
  const selectedQuest = ref<Quest | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const currentFilters = ref<QuestFilters>({});

  // Getters (computed properties)
  const getQuestCount = computed(() => quests.value.length);
  const hasQuests = computed(() => quests.value.length > 0);
  const isLoading = computed(() => loading.value);
  const hasError = computed(() => error.value !== null);

  const questsByStatus = computed(() => {
    if (!currentFilters.value.status) return quests.value;
    return quests.value.filter(
      (quest) => quest.status === currentFilters.value.status,
    );
  });

  const questsGroupedByStatus = computed(() => {
    const grouped: Record<QuestStatus, Quest[]> = {
      draft: [],
      active: [],
      completed: [],
      archived: [],
    };

    quests.value.forEach((quest) => {
      grouped[quest.status].push(quest);
    });

    return grouped;
  });

  // Actions
  const loadQuests = async (filters?: QuestFilters): Promise<void> => {
    loading.value = true;
    error.value = null;

    try {
      quests.value = await QuestApi.getAllQuests(filters);
      if (filters) {
        currentFilters.value = filters;
      }
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to load quests";
      console.error("Error loading quests:", err);
    } finally {
      loading.value = false;
    }
  };

  const loadQuestById = async (id: string): Promise<Quest | null> => {
    loading.value = true;
    error.value = null;

    try {
      const quest = await QuestApi.getQuestById(id);
      if (quest) {
        selectedQuest.value = quest;
      }
      return quest;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to load quest";
      console.error("Error loading quest:", err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const loadQuestsByStatus = async (status: QuestStatus): Promise<void> => {
    loading.value = true;
    error.value = null;

    try {
      quests.value = await QuestApi.getQuestsByStatus(status);
      currentFilters.value = { status };
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to load quests by status";
      console.error("Error loading quests by status:", err);
    } finally {
      loading.value = false;
    }
  };

  const loadQuestsByUserId = async (userId: string): Promise<void> => {
    loading.value = true;
    error.value = null;

    try {
      quests.value = await QuestApi.getQuestsByUserId(userId);
      currentFilters.value = { createdById: userId };
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to load quests by user";
      console.error("Error loading quests by user:", err);
    } finally {
      loading.value = false;
    }
  };

  const createQuest = async (
    questData: CreateQuestData,
  ): Promise<Quest | null> => {
    loading.value = true;
    error.value = null;

    try {
      const newQuest = await QuestApi.createQuest(questData);
      quests.value.push(newQuest);
      return newQuest;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to create quest";
      console.error("Error creating quest:", err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const updateQuest = async (
    id: string,
    questData: UpdateQuestData,
  ): Promise<Quest | null> => {
    loading.value = true;
    error.value = null;

    try {
      const updatedQuest = await QuestApi.updateQuest(id, questData);
      const index = quests.value.findIndex((quest) => quest.id === id);
      if (index !== -1) {
        quests.value[index] = updatedQuest;
      }
      if (selectedQuest.value?.id === id) {
        selectedQuest.value = updatedQuest;
      }
      return updatedQuest;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to update quest";
      console.error("Error updating quest:", err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const deleteQuest = async (id: string): Promise<boolean> => {
    loading.value = true;
    error.value = null;

    try {
      await QuestApi.deleteQuest(id);
      quests.value = quests.value.filter((quest) => quest.id !== id);
      if (selectedQuest.value?.id === id) {
        selectedQuest.value = null;
      }
      return true;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to delete quest";
      console.error("Error deleting quest:", err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  const clearError = (): void => {
    error.value = null;
  };

  const selectQuest = (quest: Quest | null): void => {
    selectedQuest.value = quest;
  };

  const findQuestById = (id: string): Quest | undefined => {
    return quests.value.find((quest) => quest.id === id);
  };

  const filterQuestsByUserId = (userId: string): Quest[] => {
    return quests.value.filter((quest) => quest.createdById === userId);
  };

  return {
    // State
    quests,
    selectedQuest,
    loading,
    error,
    currentFilters,

    // Getters
    getQuestCount,
    hasQuests,
    isLoading,
    hasError,
    questsByStatus,
    questsGroupedByStatus,

    // Actions
    loadQuests,
    loadQuestById,
    loadQuestsByStatus,
    loadQuestsByUserId,
    createQuest,
    updateQuest,
    deleteQuest,
    clearError,
    selectQuest,
    findQuestById,
    filterQuestsByUserId,
  };
});

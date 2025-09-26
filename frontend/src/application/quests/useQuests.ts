import { ref, reactive, computed } from "vue";
import type { Ref } from "vue";
import { QuestApi } from "@infrastructure/quests/questApi";
import type {
  Quest,
  QuestStatus,
  CreateQuestData,
  UpdateQuestData,
  QuestFilters,
} from "@domain/quests/quest";

/**
 * Quest management state interface
 */
interface QuestState {
  quests: Quest[];
  loading: boolean;
  error: string | null;
}

/**
 * Quest management composable
 * Provides a Vue composable for managing quests with reactive state
 */
export function useQuests() {
  // Reactive state
  const state = reactive<QuestState>({
    quests: [],
    loading: false,
    error: null,
  });

  // Selected quest for operations
  const selectedQuest: Ref<Quest | null> = ref(null);

  // Current filters
  const currentFilters: Ref<QuestFilters> = ref({});

  // Computed properties
  const questCount = computed(() => state.quests.length);
  const hasQuests = computed(() => state.quests.length > 0);
  const isLoading = computed(() => state.loading);
  const hasError = computed(() => state.error !== null);

  // Filter quests by status
  const questsByStatus = computed(() => {
    return (status: QuestStatus) =>
      state.quests.filter((quest) => quest.status === status);
  });

  // Group quests by status
  const questsGroupedByStatus = computed(() => {
    const grouped: Record<QuestStatus, Quest[]> = {
      draft: [],
      active: [],
      completed: [],
      archived: [],
    };

    state.quests.forEach((quest) => {
      grouped[quest.status].push(quest);
    });

    return grouped;
  });

  /**
   * Load all quests from the API
   * @param filters - Optional filters to apply
   */
  const loadQuests = async (filters?: QuestFilters): Promise<void> => {
    state.loading = true;
    state.error = null;
    currentFilters.value = filters || {};

    try {
      state.quests = await QuestApi.getAllQuests(filters);
    } catch (error) {
      state.error =
        error instanceof Error ? error.message : "Failed to load quests";
      console.error("Error loading quests:", error);
    } finally {
      state.loading = false;
    }
  };

  /**
   * Load a specific quest by ID
   * @param id - The quest ID to load
   */
  const loadQuestById = async (id: string): Promise<Quest | null> => {
    state.loading = true;
    state.error = null;

    try {
      const quest = await QuestApi.getQuestById(id);
      selectedQuest.value = quest;
      return quest;
    } catch (error) {
      state.error =
        error instanceof Error ? error.message : "Failed to load quest";
      console.error("Error loading quest:", error);
      return null;
    } finally {
      state.loading = false;
    }
  };

  /**
   * Load quests by status
   * @param status - The quest status to filter by
   */
  const loadQuestsByStatus = async (status: QuestStatus): Promise<void> => {
    state.loading = true;
    state.error = null;
    currentFilters.value = { status };

    try {
      state.quests = await QuestApi.getQuestsByStatus(status);
    } catch (error) {
      state.error =
        error instanceof Error
          ? error.message
          : "Failed to load quests by status";
      console.error("Error loading quests by status:", error);
    } finally {
      state.loading = false;
    }
  };

  /**
   * Load quests by user ID
   * @param userId - The user ID who created the quests
   */
  const loadQuestsByUserId = async (userId: string): Promise<void> => {
    state.loading = true;
    state.error = null;
    currentFilters.value = { createdById: userId };

    try {
      state.quests = await QuestApi.getQuestsByUserId(userId);
    } catch (error) {
      state.error =
        error instanceof Error
          ? error.message
          : "Failed to load quests by user";
      console.error("Error loading quests by user:", error);
    } finally {
      state.loading = false;
    }
  };

  /**
   * Create a new quest
   * @param questData - The quest data to create
   */
  const createQuest = async (
    questData: CreateQuestData,
  ): Promise<Quest | null> => {
    state.loading = true;
    state.error = null;

    try {
      const newQuest = await QuestApi.createQuest(questData);
      state.quests.push(newQuest);
      return newQuest;
    } catch (error) {
      state.error =
        error instanceof Error ? error.message : "Failed to create quest";
      console.error("Error creating quest:", error);
      return null;
    } finally {
      state.loading = false;
    }
  };

  /**
   * Update an existing quest
   * @param id - The quest ID to update
   * @param questData - Partial quest data to update
   */
  const updateQuest = async (
    id: string,
    questData: UpdateQuestData,
  ): Promise<Quest | null> => {
    state.loading = true;
    state.error = null;

    try {
      const updatedQuest = await QuestApi.updateQuest(id, questData);
      const index = state.quests.findIndex((quest) => quest.id === id);
      if (index !== -1) {
        state.quests[index] = updatedQuest;
      }
      if (selectedQuest.value?.id === id) {
        selectedQuest.value = updatedQuest;
      }
      return updatedQuest;
    } catch (error) {
      state.error =
        error instanceof Error ? error.message : "Failed to update quest";
      console.error("Error updating quest:", error);
      return null;
    } finally {
      state.loading = false;
    }
  };

  /**
   * Delete a quest by ID
   * @param id - The quest ID to delete
   */
  const deleteQuest = async (id: string): Promise<boolean> => {
    state.loading = true;
    state.error = null;

    try {
      await QuestApi.deleteQuest(id);
      state.quests = state.quests.filter((quest) => quest.id !== id);
      if (selectedQuest.value?.id === id) {
        selectedQuest.value = null;
      }
      return true;
    } catch (error) {
      state.error =
        error instanceof Error ? error.message : "Failed to delete quest";
      console.error("Error deleting quest:", error);
      return false;
    } finally {
      state.loading = false;
    }
  };

  /**
   * Clear error state
   */
  const clearError = (): void => {
    state.error = null;
  };

  /**
   * Find quest by ID in current state
   * @param id - The quest ID to find
   */
  const findQuestById = (id: string): Quest | undefined => {
    return state.quests.find((quest) => quest.id === id);
  };

  /**
   * Set selected quest
   * @param quest - The quest to select
   */
  const selectQuest = (quest: Quest | null): void => {
    selectedQuest.value = quest;
  };

  /**
   * Filter quests by user ID in current state
   * @param userId - The user ID to filter by
   */
  const filterQuestsByUserId = (userId: string): Quest[] => {
    return state.quests.filter((quest) => quest.createdById === userId);
  };

  return {
    // State
    quests: computed(() => state.quests),
    selectedQuest: computed(() => selectedQuest.value),
    loading: isLoading,
    error: computed(() => state.error),
    currentFilters: computed(() => currentFilters.value),

    // Computed
    questCount,
    hasQuests,
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
    findQuestById,
    selectQuest,
    filterQuestsByUserId,
  };
}

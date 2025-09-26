import { ref } from 'vue';
import { Quest, QuestStatus, CreateQuestRequest } from '@domain/quests/quest.model';
import { QuestApi } from '@infrastructure/quests/quest.api';

const questApi = new QuestApi();

export function useQuests() {
  const quests = ref<Quest[]>([]);
  const currentQuest = ref<Quest | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const loadQuests = async () => {
    try {
      loading.value = true;
      error.value = null;
      quests.value = await questApi.getAll();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load quests';
    } finally {
      loading.value = false;
    }
  };

  const loadQuest = async (id: string) => {
    try {
      loading.value = true;
      error.value = null;
      currentQuest.value = await questApi.getById(id);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load quest';
    } finally {
      loading.value = false;
    }
  };

  const loadQuestsByStatus = async (status: QuestStatus) => {
    try {
      loading.value = true;
      error.value = null;
      quests.value = await questApi.getByStatus(status);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load quests by status';
    } finally {
      loading.value = false;
    }
  };

  const loadQuestsByUser = async (userId: string) => {
    try {
      loading.value = true;
      error.value = null;
      quests.value = await questApi.getByUserId(userId);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load user quests';
    } finally {
      loading.value = false;
    }
  };

  const createQuest = async (questRequest: CreateQuestRequest) => {
    try {
      loading.value = true;
      error.value = null;
      const newQuest = await questApi.create(questRequest);
      quests.value.push(newQuest);
      return newQuest;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create quest';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    quests,
    currentQuest,
    loading,
    error,
    loadQuests,
    loadQuest,
    loadQuestsByStatus,
    loadQuestsByUser,
    createQuest,
  };
}
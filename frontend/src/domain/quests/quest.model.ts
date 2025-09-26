export enum QuestStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ARCHIVED = 'archived'
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  status: QuestStatus;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateQuestRequest {
  title: string;
  description: string;
  createdById: string;
}
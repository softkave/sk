export interface ITaskCollaborator {
  userId: string;
  completedAt?: number;
  assignedAt: number;
  assignedBy: string;
}

const notImportantkey = "not important";
const veryImportantKey = "very important";
export const taskPriority = {
  important: "important",
  [notImportantkey]: "not important",
  [veryImportantKey]: "very important"
};

export const blockType = {
  org: "org",
  project: "project",
  group: "group",
  task: "task",
  root: "root"
};

export type BlockPriority = keyof typeof taskPriority;
export type BlockType = keyof typeof blockType;

export interface ISubTask {
  customId: string;
  description: string;
  completedBy?: string | null;
  completedAt?: number | null;
}

export const blockTaskCollaborationTypes = {
  individual: "individual",
  collective: "collective"
};

export type TaskCollaborationType = "individual" | "collective";
export interface ITaskCollaborationData {
  collaborationType: TaskCollaborationType;
  completedAt?: number | null;
  completedBy?: string | null;
}

export type BlockLandingPage = "tasks" | "projects" | "self";
export type BlockGroupContext = "groupTaskContext" | "groupProjectContext";

export interface IBlock {
  customId: string;
  name: string;
  description?: string;
  expectedEndAt?: number;
  createdAt: number;
  color: string;
  updatedAt?: number;
  type: BlockType;
  parent?: string;
  rootBlockID?: string;
  createdBy: string;
  taskCollaborationData?: ITaskCollaborationData;
  taskCollaborators?: ITaskCollaborator[];
  priority?: BlockPriority;
  tasks?: string[];
  groups?: string[];
  projects?: string[];
  groupTaskContext?: string[];
  groupProjectContext?: string[];
  collaborators?: string[];
  collaborationRequests?: string[];
  subTasks?: ISubTask[];
  landingPage?: BlockLandingPage;
}

export function findBlock(blocks: IBlock[], id: string): IBlock | undefined {
  return blocks.find(block => {
    return block.customId === id;
  });
}

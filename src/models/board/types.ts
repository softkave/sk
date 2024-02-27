import { IUpdateComplexTypeArrayInput } from "../../utils/types";
import { IWorkspaceResource } from "../app/types";
import { IBoardSprintOptions, SprintDuration } from "../sprint/types";
import { IResourceWithId } from "../types";

export interface IBoardLabel {
  customId: string;
  name: string;
  color: string;
  createdBy: string;
  createdAt: string;
  description?: string;
  lastUpdatedBy?: string;
  lastUpdatedAt?: string;
}

export interface IBoardStatus {
  customId: string;
  name: string;
  color: string;
  createdBy: string;
  createdAt: string;
  position: number;
  description?: string;
  lastUpdatedBy?: string;
  lastUpdatedAt?: string;
}

export interface IBoardStatusResolution {
  customId: string;
  name: string;
  createdBy: string;
  createdAt: string;
  description?: string;
  lastUpdatedBy?: string;
  lastUpdatedAt?: string;
}

export interface IBoard extends IWorkspaceResource {
  name: string;
  description?: string;
  color: string;
  boardStatuses: IBoardStatus[];
  boardLabels: IBoardLabel[];
  boardResolutions: IBoardStatusResolution[];
  currentSprintId?: string | null;
  sprintOptions?: IBoardSprintOptions;
  lastSprintId?: string;

  // From app
  avgTimeToCompleteTasks?: number;
}

export interface IBoardStatusInput extends IResourceWithId {
  name: string;
  color: string;
  position: number;
  description?: string;
}

export interface IBoardLabelInput extends IResourceWithId {
  name: string;
  color: string;
  description?: string;
}

export interface IBoardStatusResolutionInput extends IResourceWithId {
  name: string;
  description?: string;
}

export interface INewBoardInput {
  name: string;
  description?: string;
  color: string;
  workspaceId: string;
  boardStatuses: IBoardStatusInput[];
  boardLabels: IBoardLabelInput[];
  boardResolutions: IBoardStatusResolutionInput[];
}

export interface IUpdateBoardInput {
  name?: string;
  description?: string;
  color?: string;
  boardStatuses?: IUpdateComplexTypeArrayInput<IBoardStatusInput>;
  boardLabels?: IUpdateComplexTypeArrayInput<IBoardLabelInput>;
  boardResolutions?: IUpdateComplexTypeArrayInput<IBoardStatusResolutionInput>;
  sprintOptions?: { duration: SprintDuration };
}

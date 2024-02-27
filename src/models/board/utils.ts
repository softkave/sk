import randomColor from "randomcolor";
import { IBoardFormValues } from "../../components/board/BoardForm";
import { extractFields, getFields, makeExtract } from "../../utils/extract";
import { topLevelDiff } from "../../utils/utils";
import { IAppWorkspace } from "../organization/types";
import { getComplexFieldInput } from "../utils";
import {
  IBoard,
  IBoardLabelInput,
  IBoardStatus,
  IBoardStatusInput,
  IBoardStatusResolutionInput,
  IUpdateBoardInput,
} from "./types";

const statusInputFields = getFields<IBoardStatusInput>({
  color: true,
  description: true,
  name: true,
  customId: true,
  position: true,
});

const labelInputFields = getFields<IBoardLabelInput>({
  color: true,
  description: true,
  name: true,
  customId: true,
});

const resolutionInputFields = getFields<IBoardStatusResolutionInput>({
  description: true,
  name: true,
  customId: true,
});

const statusInputExtractor = makeExtract(statusInputFields);
const labelInputExtractor = makeExtract(labelInputFields);
const resolutionInputExtractor = makeExtract(resolutionInputFields);

const updateBlockFields = getFields<
  Omit<IUpdateBoardInput, "boardStatuses" | "boardLabels" | "boardResolutions"> & {
    boardStatuses: IBoardStatusInput[];
    boardLabels: IBoardLabelInput[];
    boardResolutions: IBoardStatusResolutionInput[];
  },
  IUpdateBoardInput,
  { board: IBoard }
>({
  name: true,
  description: true,
  color: true,
  boardStatuses: (data, args) => {
    return getComplexFieldInput(
      args.board.boardStatuses || [],
      data,
      "customId",
      (item) => ({
        ...item,
        name: item.name.toLowerCase(),
        description: item.description?.toLowerCase(),
      }),
      (item01, item02) =>
        item02.name.toLowerCase() !== item01.name ||
        item02.color !== item01.color ||
        item02.position !== item01.position ||
        item02.description?.toLowerCase() !== item01.description,
      statusInputExtractor
    );
  },
  boardLabels: (data, args) => {
    return getComplexFieldInput(
      args.board.boardLabels || [],
      data,
      "customId",
      (item) => ({
        ...item,
        name: item.name.toLowerCase(),
        description: item.description?.toLowerCase(),
      }),
      (item01, item02) =>
        item02.name.toLowerCase() !== item01.name ||
        item02.color !== item01.color ||
        item02.description?.toLowerCase() !== item01.description,
      labelInputExtractor
    );
  },
  boardResolutions: (data, args) => {
    return getComplexFieldInput(
      args.board.boardResolutions || [],
      data,
      "customId",
      (item) => ({
        ...item,
        name: item.name.toLowerCase(),
        description: item.description?.toLowerCase(),
      }),
      (item01, item02) =>
        item02.name.toLowerCase() !== item01.name ||
        item02.description?.toLowerCase() !== item01.description,
      resolutionInputExtractor
    );
  },
  sprintOptions: (data) => data,
});

export function getUpdateBoardInput(
  board: IBoard,
  update: Partial<
    Omit<IUpdateBoardInput, "boardStatuses" | "boardLabels" | "boardResolutions"> & {
      boardStatuses: IBoardStatusInput[];
      boardLabels: IBoardLabelInput[];
      boardResolutions: IBoardStatusResolutionInput[];
    }
  >
) {
  const diff = topLevelDiff(update, board);
  return extractFields(diff, updateBlockFields, { board });
}

export function newFormBoard(organization: IAppWorkspace) {
  const newBoard: IBoardFormValues = {
    color: randomColor(),
    workspaceId: organization.customId,
    name: "",
    description: "",
    boardLabels: [],
    boardStatuses: [],
    boardResolutions: [],
  };

  return newBoard;
}

export function formBoardFromExisting(board: IBoard) {
  const newBoard: IBoardFormValues = {
    color: board.color,
    workspaceId: board.workspaceId,
    name: board.name,
    description: board.description,
    boardLabels: board.boardLabels.map((item) => ({
      color: item.color,
      customId: item.customId,
      name: item.name,
      description: item.description,
    })),
    boardStatuses: board.boardStatuses.map((item) => ({
      color: item.color,
      customId: item.customId,
      name: item.name,
      description: item.description,
      position: item.position,
    })),
    boardResolutions: board.boardResolutions.map((item) => ({
      customId: item.customId,
      name: item.name,
      description: item.description,
    })),
  };

  return newBoard;
}

/**
 * Sorts the board statuses by position.
 * @param statusList
 * @returns
 */
export function sortStatusList<T extends Pick<IBoardStatus, "position">>(
  statusList: Array<T>,
  sortInPlace = false
) {
  if (!sortInPlace) {
    statusList = [...statusList];
  }

  const sortedStatuses = statusList.sort((item01, item02) => item01.position - item02.position);
  return sortedStatuses;
}

export function hasSetupSprints(b: IBoard) {
  return !!b.sprintOptions;
}

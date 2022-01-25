import { appOrganizationRoutes } from "../organization/utils";
import {
  IBlockLabelInput,
  IBlockStatusInput,
  IBoard,
  IBoardStatusResolutionInput,
  IUpdateBoardInput,
} from "./types";
import { extractFields, getFields, makeExtract } from "../../utils/extract";
import { topLevelDiff } from "../../utils/utils";
import { getComplexFieldInput } from "../utils";

const board = (organizationId: string, boardId: string) =>
  `${appOrganizationRoutes.boards(organizationId)}/${boardId}`;

export const appBoardRoutes = {
  board,
  tasks: (organizationId: string, boardId: string) =>
    `${board(organizationId, boardId)}/tasks`,
};

const statusInputFields = getFields<IBlockStatusInput>({
  color: true,
  description: true,
  name: true,
  customId: true,
  position: true,
});

const labelInputFields = getFields<IBlockLabelInput>({
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
  Omit<
    IUpdateBoardInput,
    "boardStatuses" | "boardLabels" | "boardResolutions"
  > & {
    boardStatuses: IBlockStatusInput[];
    boardLabels: IBlockLabelInput[];
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
});

export function getUpdateBoardInput(
  board: IBoard,
  update: Partial<
    Omit<
      IUpdateBoardInput,
      "boardStatuses" | "boardLabels" | "boardResolutions"
    > & {
      boardStatuses: IBlockStatusInput[];
      boardLabels: IBlockLabelInput[];
      boardResolutions: IBoardStatusResolutionInput[];
    }
  >
) {
  const diff = topLevelDiff(update, board);
  return extractFields(diff, updateBlockFields, { board });
}

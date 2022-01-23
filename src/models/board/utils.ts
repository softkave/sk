import { appOrganizationRoutes } from "../organization/utils";

const board = (organizationId: string, boardId: string) =>
  `${appOrganizationRoutes.boards(organizationId)}/${boardId}`;

export const appBoardRoutes = {
  board,
  tasks: (organizationId: string, boardId: string) =>
    `${board(organizationId, boardId)}/tasks`,
};

import { useRouteMatch } from "react-router";
import { appBoardPaths } from "../../models/app/routes";

export interface IUseBoardIdFromPathResult {
  boardId: string | null;
}

export default function useBoardIdFromPath(): IUseBoardIdFromPathResult {
  const p = appBoardPaths.boardSelector();
  const routeMatch = useRouteMatch<{ boardId: string }>(p);
  const id = routeMatch && routeMatch.params.boardId;
  return {
    boardId: id,
  };
}

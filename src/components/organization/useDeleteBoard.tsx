import { unwrapResult } from "@reduxjs/toolkit";
import { message } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { appOrganizationPaths } from "../../models/app/routes";
import { IBoard } from "../../models/board/types";
import { deleteBoardOpAction } from "../../redux/operations/board/deleteBoard";
import { AppDispatch } from "../../redux/types";
import confirmBlockDelete from "../block/confirmBlockDelete";
import { getOpData } from "../hooks/useOperation";

export interface IUseDeleteBoardProps {
  routeToPathOnDelete?: string;
}

export default function useDeleteBoard(props: IUseDeleteBoardProps = {}) {
  const dispatch = useDispatch<AppDispatch>();
  const history = useHistory();
  const deleteBoard = React.useCallback(
    async (board: IBoard) => {
      const result = await dispatch(
        deleteBoardOpAction({
          boardId: board.customId,
          deleteOpOnComplete: true,
        })
      );

      const op = unwrapResult(result);
      if (!op) {
        return;
      }

      const opData = getOpData(op);
      console.log({ opData, op });
      if (opData.isCompleted) {
        message.success("Board deleted.");
        history.push(
          props.routeToPathOnDelete || appOrganizationPaths.boards(board.parent)
        );
      } else if (opData.isError) {
        message.error("Error deleting board.");
      }
    },
    [dispatch, history, props.routeToPathOnDelete]
  );

  const onDeleteBoard = React.useCallback(
    (board: IBoard) => {
      confirmBlockDelete(board, deleteBoard);
    },
    [deleteBoard]
  );

  return { onDeleteBoard };
}

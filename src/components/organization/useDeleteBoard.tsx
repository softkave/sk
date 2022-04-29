import { unwrapResult } from "@reduxjs/toolkit";
import { message } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { IBoard } from "../../models/board/types";
import { deleteBoardOpAction } from "../../redux/operations/board/deleteBoard";
import { AppDispatch } from "../../redux/types";
import confirmBlockDelete from "../block/confirmBlockDelete";
import { getOpData } from "../hooks/useOperation";

export default function useDeleteBoard() {
  const dispatch = useDispatch<AppDispatch>();
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

      if (opData.isCompleted) {
        message.success("Board deleted.");
      } else if (opData.isError) {
        message.error("Error deleting board.");
      }
    },
    [dispatch]
  );

  const onDeleteBoard = React.useCallback(
    (board: IBoard) => {
      confirmBlockDelete(board, deleteBoard);
    },
    [deleteBoard]
  );

  return { onDeleteBoard };
}

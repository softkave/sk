import { unwrapResult } from "@reduxjs/toolkit";
import { Modal, message } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { appOrganizationPaths } from "../../models/app/routes";
import { IBoard } from "../../models/board/types";
import { deleteBoardOpAction } from "../../redux/operations/board/deleteBoard";
import { AppDispatch } from "../../redux/types";

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
        })
      );

      const op = unwrapResult(result);

      if (op.error) {
        message.error("Error deleting board");
      } else {
        message.success("Board deleted");
        history.push(props.routeToPathOnDelete || appOrganizationPaths.boards(board.workspaceId));
      }
    },
    [dispatch, history, props.routeToPathOnDelete]
  );

  const onDeleteBoard = React.useCallback(
    (board: IBoard) => {
      const onDeletePromptMessage = <div>Are you sure you want to delete this board?</div>;

      Modal.confirm({
        title: onDeletePromptMessage,
        okText: "Yes",
        cancelText: "No",
        okType: "primary",
        okButtonProps: { danger: true },
        onOk() {
          return deleteBoard(board);
        },
        onCancel() {
          // do nothing
        },
      });
    },
    [deleteBoard]
  );

  return { onDeleteBoard };
}

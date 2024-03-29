import { unwrapResult } from "@reduxjs/toolkit";
import { message } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { IBoard } from "../../models/board/types";
import { formBoardFromExisting, newFormBoard } from "../../models/board/utils";
import { IAppWorkspace } from "../../models/organization/types";
import {
    ICreateBoardEndpointResultError,
    IUpdateBoardEndpointResultError,
} from "../../net/board/endpoints";
import { createBoardOpAction } from "../../redux/operations/board/createBoard";
import { updateBoardOpAction } from "../../redux/operations/board/updateBoard";
import OrganizationSelectors from "../../redux/organizations/selectors";
import { AppDispatch, IAppState } from "../../redux/types";
import { flattenErrorList } from "../../utils/utils";
import { IFormError } from "../utils/types";
import BoardForm, { IBoardFormValues } from "./BoardForm";

export interface IBoardFormContainerProps {
  orgId: string;
  onClose: () => void;
  board?: IBoard;
  hideBackBtn?: boolean;
}

const BoardFormContainer: React.FC<IBoardFormContainerProps> = (props) => {
  const { onClose, orgId, hideBackBtn } = props;
  const dispatch: AppDispatch = useDispatch();
  const history = useHistory();
  const org = useSelector<IAppState, IAppWorkspace>((state) => {
    return OrganizationSelectors.assertGetOne(state, orgId);
  });

  const [boardData, setBoardData] = React.useState<IBoardFormValues>(() =>
    props.board ? formBoardFromExisting(props.board) : newFormBoard(org)
  );

  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<
    // TODO: this is not correct, add the right type
    IFormError<Record<string, any>> | undefined
  >();

  const onSubmit = async (values: IBoardFormValues) => {
    const data = { ...boardData, ...values };
    setLoading(true);
    setBoardData(data);
    const result = props.board
      ? await dispatch(
          updateBoardOpAction({
            data,
            boardId: props.board.customId,
          })
        )
      : await dispatch(
          createBoardOpAction({
            board: data,
          })
        );

    const op = unwrapResult(result);

    if (!op) {
      return;
    }

    const board = op.value;
    setLoading(false);

    if (op.error) {
      if (props.board) {
        message.error("Error updating board");
      } else {
        message.error("Error creating board");
      }

      const flattenedErrors = flattenErrorList<
        ICreateBoardEndpointResultError & IUpdateBoardEndpointResultError
      >(op.error);
      setErrors({
        // TODO: fix
        // @ts-ignore
        errors: flattenedErrors?.board || flattenedErrors?.data,
        errorList: op.error,
      });
    } else {
      if (props.board) {
        message.success("Board updated");
      } else {
        message.success("Board created");
        history.push(`/app/orgs/${orgId}/boards/${board!.customId}`);
        onClose();
      }
    }
  };

  return (
    <BoardForm
      hideBackBtn={hideBackBtn}
      value={boardData as any}
      onClose={onClose}
      board={props.board}
      onSubmit={onSubmit}
      isSubmitting={loading}
      errors={errors?.errors}
    />
  );
};

export default React.memo(BoardFormContainer);

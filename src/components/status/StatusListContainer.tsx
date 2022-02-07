import { unwrapResult } from "@reduxjs/toolkit";
import { message } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { IBlockStatusInput } from "../../models/block/block";
import { IBoard } from "../../models/board/types";
import { IAddBlockEndpointErrors } from "../../net/block/types";
import { updateBoardOpAction } from "../../redux/operations/board/updateBoard";
import { AppDispatch } from "../../redux/types";
import { flattenErrorList } from "../../utils/utils";
import { getOpData } from "../hooks/useOperation";
import { IFormError } from "../utilities/types";
import StatusList, { sortStatuses } from "./StatusList";

export interface IStatusListContainerProps {
  board: IBoard;
}

const StatusListContainer: React.FC<IStatusListContainerProps> = (props) => {
  const { board } = props;
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<
    IFormError<IAddBlockEndpointErrors["block"]> | undefined
  >();

  const dispatch: AppDispatch = useDispatch();
  const statusList = sortStatuses(board.boardStatuses || []);
  const onSaveChanges = async (values: IBlockStatusInput[]) => {
    setLoading(true);
    const result = await dispatch(
      updateBoardOpAction({
        boardId: board.customId,
        data: {
          // TODO: find a better way to only update the ones that changed
          boardStatuses: values,
        },
        deleteOpOnComplete: true,
      })
    );

    const op = unwrapResult(result);

    if (!op) {
      return;
    }

    const opData = getOpData(op);

    if (opData.isError) {
      const flattenedErrors = flattenErrorList(opData.error);
      setErrors({
        errors: flattenedErrors,
        errorList: opData.error,
      });

      message.error("Error saving changes.");
    } else if (opData.isCompleted) {
      message.success("Changes saved.");
    }

    setLoading(false);
  };

  return (
    <StatusList
      statusList={statusList}
      saveChanges={onSaveChanges}
      isSubmitting={loading}
      errors={
        errors?.errors.boardStatuses
          ? { statusList: errors.errors.boardStatuses }
          : undefined
      }
    />
  );
};

export default React.memo(StatusListContainer);

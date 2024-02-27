import { unwrapResult } from "@reduxjs/toolkit";
import { message } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { IBoard, IBoardStatusInput } from "../../models/board/types";
import { sortStatusList } from "../../models/board/utils";
import { updateBoardOpAction } from "../../redux/operations/board/updateBoard";
import { AppDispatch } from "../../redux/types";
import { flattenErrorList } from "../../utils/utils";
import { IFormError } from "../utils/types";
import StatusList from "./StatusList";

export interface IStatusListContainerProps {
  board: IBoard;
}

const StatusListContainer: React.FC<IStatusListContainerProps> = (props) => {
  const { board } = props;
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<IFormError<Record<string, any>> | undefined>();

  const dispatch: AppDispatch = useDispatch();
  const statusList = sortStatusList(board.boardStatuses || []);
  const onSaveChanges = async (values: IBoardStatusInput[]) => {
    setLoading(true);
    const result = await dispatch(
      updateBoardOpAction({
        boardId: board.customId,
        data: {
          // TODO: find a better way to only update the ones that changed
          boardStatuses: values,
        },
      })
    );

    const op = unwrapResult(result);

    if (op.error) {
      const flattenedErrors = flattenErrorList(op.error);
      setErrors({
        errors: flattenedErrors,
        errorList: op.error,
      });

      message.error("Error saving changes");
    } else {
      message.success("Changes saved");
    }

    setLoading(false);
  };

  // TODO: auth checks
  const canUpdateBoard = true;

  return (
    <StatusList
      statusList={statusList}
      saveChanges={onSaveChanges}
      isSubmitting={loading}
      errors={
        errors?.errors.boardStatuses ? { statusList: errors.errors.boardStatuses } : undefined
      }
      canUpdate={canUpdateBoard}
    />
  );
};

export default React.memo(StatusListContainer);

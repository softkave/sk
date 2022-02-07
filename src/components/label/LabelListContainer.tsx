import { unwrapResult } from "@reduxjs/toolkit";
import { message } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { IBlockLabelInput } from "../../models/block/block";
import { IBoard } from "../../models/board/types";
import { updateBoardOpAction } from "../../redux/operations/board/updateBoard";
import { AppDispatch } from "../../redux/types";
import { flattenErrorList } from "../../utils/utils";
import { getOpData } from "../hooks/useOperation";
import { IFormError } from "../utilities/types";
import LabelList from "./LabelList";

export interface ILabelListContainerProps {
  board: IBoard;
}

const LabelListContainer: React.FC<ILabelListContainerProps> = (props) => {
  const { board } = props;
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<
    // TODO: Add the right error type
    IFormError<Record<string, any>> | undefined
  >();

  const dispatch: AppDispatch = useDispatch();
  const labelList = board.boardLabels || [];
  const onSaveChanges = async (values: IBlockLabelInput[]) => {
    setLoading(true);
    const result = await dispatch(
      updateBoardOpAction({
        boardId: board.customId,
        data: {
          // TODO: find a better way to only update the ones that changed
          boardLabels: values,
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
      message.error("Error saving changes.");

      const flattenedErrors = flattenErrorList(opData.error);
      setErrors({
        errors: flattenedErrors,
        errorList: opData.error,
      });
    } else if (opData.isCompleted) {
      message.success("Changes saved.");
    }

    setLoading(false);
  };

  return (
    <LabelList
      labelList={labelList}
      saveChanges={onSaveChanges}
      isSubmitting={loading}
      errors={
        errors?.errors.boardLabels
          ? { labelList: errors.errors.boardLabels }
          : undefined
      }
    />
  );
};

export default React.memo(LabelListContainer);

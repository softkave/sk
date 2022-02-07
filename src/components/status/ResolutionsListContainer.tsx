import { unwrapResult } from "@reduxjs/toolkit";
import { message } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { IBoardStatusResolutionInput } from "../../models/block/block";
import { IBoard } from "../../models/board/types";
import { updateBoardOpAction } from "../../redux/operations/board/updateBoard";
import { AppDispatch } from "../../redux/types";
import { flattenErrorList } from "../../utils/utils";
import { getOpData } from "../hooks/useOperation";
import { IFormError } from "../utilities/types";
import ResolutionsList from "./ResolutionsList";

export interface IResolutionsListContainerProps {
  board: IBoard;
}

const ResolutionsListContainer: React.FC<IResolutionsListContainerProps> = (
  props
) => {
  const { board } = props;
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<
    // TODO: Add the right error type
    IFormError<Record<string, any>> | undefined
  >();

  const dispatch: AppDispatch = useDispatch();
  const resolutions = board.boardResolutions || [];
  const onSaveChanges = async (values: IBoardStatusResolutionInput[]) => {
    setLoading(true);
    const result = await dispatch(
      updateBoardOpAction({
        boardId: board.customId,
        data: {
          // TODO: find a better way to only update the ones that changed
          boardResolutions: values,
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
    <ResolutionsList
      resolutionsList={resolutions}
      saveChanges={onSaveChanges}
      isSubmitting={loading}
      errors={
        errors?.errors.boardResolutions
          ? { resolutionsList: errors.errors.boardResolutions }
          : undefined
      }
    />
  );
};

export default React.memo(ResolutionsListContainer);

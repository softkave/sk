import { unwrapResult } from "@reduxjs/toolkit";
import { message } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { IBoard, IBoardStatusResolutionInput } from "../../models/board/types";
import { updateBoardOpAction } from "../../redux/operations/board/updateBoard";
import { AppDispatch } from "../../redux/types";
import { flattenErrorList } from "../../utils/utils";
import { IFormError } from "../utils/types";
import ResolutionsList from "./ResolutionsList";

export interface IResolutionsListContainerProps {
  board: IBoard;
}

const ResolutionsListContainer: React.FC<IResolutionsListContainerProps> = (props) => {
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
    <ResolutionsList
      resolutionsList={resolutions}
      saveChanges={onSaveChanges}
      isSubmitting={loading}
      errors={
        errors?.errors.boardResolutions
          ? { resolutionsList: errors.errors.boardResolutions }
          : undefined
      }
      canUpdate={canUpdateBoard}
    />
  );
};

export default React.memo(ResolutionsListContainer);

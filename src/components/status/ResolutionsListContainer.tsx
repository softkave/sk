import { unwrapResult } from "@reduxjs/toolkit";
import { message } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { IBlock, IBoardStatusResolutionInput } from "../../models/block/block";
import { IAddBlockEndpointErrors } from "../../net/block/types";
import { updateBlockOpAction } from "../../redux/operations/block/updateBlock";
import SessionSelectors from "../../redux/session/selectors";
import { AppDispatch } from "../../redux/types";
import { flattenErrorList } from "../../utils/utils";
import { getOpData } from "../hooks/useOperation";
import { IFormError } from "../utilities/types";
import ResolutionsList from "./ResolutionsList";

export interface IResolutionsListContainerProps {
    block: IBlock;
}

const ResolutionsListContainer: React.FC<IResolutionsListContainerProps> = (
    props
) => {
    const { block } = props;

    const [loading, setLoading] = React.useState(false);
    const [errors, setErrors] = React.useState<
        IFormError<IAddBlockEndpointErrors["block"]> | undefined
    >();

    const dispatch: AppDispatch = useDispatch();
    const user = useSelector(SessionSelectors.assertGetUser);
    const resolutions = block.boardResolutions || [];

    const onSaveChanges = async (values: IBoardStatusResolutionInput[]) => {
        setLoading(true);

        const result = await dispatch(
            updateBlockOpAction({
                blockId: block.customId,
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

            message.error("Error saving changes");
        } else if (opData.isCompleted) {
            message.success("Changes saved successfully");
        }

        setLoading(false);
    };

    return (
        <ResolutionsList
            user={user}
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

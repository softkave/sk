import { unwrapResult } from "@reduxjs/toolkit";
import { message } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { IBlock, IBoardTaskResolution } from "../../models/block/block";
import { updateBlockOpAction } from "../../redux/operations/block/updateBlock";
import SessionSelectors from "../../redux/session/selectors";
import { AppDispatch } from "../../redux/types";
import {
    flattenErrorListWithDepthInfinite,
    getDateString,
} from "../../utils/utils";
import useOperation, { getOpStats } from "../hooks/useOperation";
import ResolutionsList from "./ResolutionsList";

export interface IResolutionsListContainerProps {
    block: IBlock;
}

const ResolutionsListContainer: React.FC<IResolutionsListContainerProps> = (
    props
) => {
    const { block } = props;
    const dispatch: AppDispatch = useDispatch();
    const user = useSelector(SessionSelectors.assertGetUser);
    const resolutions = block.boardResolutions || [];
    const operationStatus = useOperation();

    const errors = operationStatus.error
        ? flattenErrorListWithDepthInfinite(operationStatus.error)
        : undefined;

    if (errors && errors.data && errors.data.boardResolutions) {
        errors.statusList = errors.data.boardResolutions;
        delete errors.data;
    }

    const onSaveChanges = async (values: IBoardTaskResolution[]) => {
        const result = await dispatch(
            updateBlockOpAction({
                opId: operationStatus.opId,
                block,
                data: {
                    // TODO: find a better way to only update the ones that changed
                    boardResolutions: values.map((value) => ({
                        ...value,
                        updatedAt: getDateString(),
                        updatedBy: user.customId,
                    })),
                },
            })
        );

        const op = unwrapResult(result);

        if (!op) {
            return;
        }

        const opStat = getOpStats(op);

        if (opStat.isError) {
            message.error("Error saving changes");
        } else if (opStat.isCompleted) {
            message.success("Changes saved successfully");
        }
    };

    return (
        <ResolutionsList
            user={user}
            resolutionsList={resolutions}
            saveChanges={onSaveChanges}
            isSubmitting={operationStatus.isLoading}
            errors={errors}
        />
    );
};

export default React.memo(ResolutionsListContainer);

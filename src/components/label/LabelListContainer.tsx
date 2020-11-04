import { unwrapResult } from "@reduxjs/toolkit";
import { message } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { IBlock, IBlockLabel } from "../../models/block/block";
import { updateBlockOpAction } from "../../redux/operations/block/updateBlock";
import SessionSelectors from "../../redux/session/selectors";
import { AppDispatch } from "../../redux/types";
import {
    flattenErrorListWithDepthInfinite,
    getDateString,
} from "../../utils/utils";
import useOperation, { getOpStats } from "../hooks/useOperation";
import LabelList from "./LabelList";

export interface ILabelListContainerProps {
    block: IBlock;
}

const LabelListContainer: React.FC<ILabelListContainerProps> = (props) => {
    const { block } = props;
    const dispatch: AppDispatch = useDispatch();
    const user = useSelector(SessionSelectors.assertGetUser);
    const labelList = block.boardLabels || [];
    const operationStatus = useOperation();

    const errors = operationStatus.error
        ? flattenErrorListWithDepthInfinite(operationStatus.error)
        : undefined;

    if (errors && errors.data && errors.data.boardLabels) {
        errors.labelList = errors.data.boardLabels;
        delete errors.data;
    }

    const onSaveChanges = async (values: IBlockLabel[]) => {
        const result = await dispatch(
            updateBlockOpAction({
                opId: operationStatus.opId,
                block,
                data: {
                    // TODO: find a better way to only update the ones that changed
                    boardLabels: values.map((value) => ({
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
        <LabelList
            user={user}
            labelList={labelList}
            saveChanges={onSaveChanges}
            isSubmitting={operationStatus.isLoading}
            errors={errors}
        />
    );
};

export default React.memo(LabelListContainer);

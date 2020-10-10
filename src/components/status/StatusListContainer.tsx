import { unwrapResult } from "@reduxjs/toolkit";
import { message } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { IBlock, IBlockStatus } from "../../models/block/block";
import { updateBlockOperationAction } from "../../redux/operations/block/updateBlock";
import SessionSelectors from "../../redux/session/selectors";
import { AppDispatch } from "../../redux/types";
import {
    flattenErrorListWithDepthInfinite,
    getDateString,
} from "../../utils/utils";
import useOperation, { getOperationStats } from "../hooks/useOperation";
import StatusList from "./StatusList";

export interface IStatusListContainerProps {
    block: IBlock;
}

const StatusListContainer: React.FC<IStatusListContainerProps> = (props) => {
    const { block } = props;
    const dispatch: AppDispatch = useDispatch();
    const user = useSelector(SessionSelectors.assertGetUser);
    const statusList = block.boardStatuses || [];
    const operationStatus = useOperation();

    const errors = operationStatus.error
        ? flattenErrorListWithDepthInfinite(operationStatus.error)
        : undefined;

    if (errors && errors.data && errors.data.boardStatuses) {
        errors.statusList = errors.data.boardStatuses;
        delete errors.data;
    }

    const onSaveChanges = async (values: IBlockStatus[]) => {
        const result = await dispatch(
            updateBlockOperationAction({
                opId: operationStatus.opId,
                block,
                data: {
                    // TODO: find a better way to only update the ones that changed
                    boardStatuses: values.map((value) => ({
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

        const opStat = getOperationStats(op);

        if (opStat.isError) {
            message.error("Error saving changes");
        } else if (opStat.isCompleted) {
            message.success("Changes saved successfully");
        }
    };

    return (
        <StatusList
            user={user}
            statusList={statusList}
            saveChanges={onSaveChanges}
            isSubmitting={operationStatus.isLoading}
            errors={errors}
        />
    );
};

export default React.memo(StatusListContainer);

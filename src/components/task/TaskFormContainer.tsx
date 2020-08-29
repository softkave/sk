import { unwrapResult } from "@reduxjs/toolkit";
import { message } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { BlockType, IBlock } from "../../models/block/block";
import { IUser } from "../../models/user/user";
import BlockSelectors from "../../redux/blocks/selectors";
import { addBlockOperationAction } from "../../redux/operations/block/addBlock";
import { updateBlockOperationAction } from "../../redux/operations/block/updateBlock";
import SessionSelectors from "../../redux/session/selectors";
import { AppDispatch, IAppState } from "../../redux/types";
import UserSelectors from "../../redux/users/selectors";
import {
    flattenErrorListWithDepthInfinite,
    getDateString,
} from "../../utils/utils";
import getNewBlock from "../block/getNewBlock";
import useBlockPossibleParents from "../hooks/useBlockPossibleParents";
import useOperation, { getOperationStats } from "../hooks/useOperation";
import TaskForm, { ITaskFormValues } from "./TaskForm";

export interface ITaskFormContainerProps {
    orgId: string;
    onClose: () => void;

    parentBlock?: IBlock;
    block?: IBlock;
}

const TaskFormContainer: React.FC<ITaskFormContainerProps> = (props) => {
    const { onClose, orgId } = props;
    const dispatch: AppDispatch = useDispatch();
    const user = useSelector(SessionSelectors.getSignedInUserRequired);
    const org = useSelector<IAppState, IBlock>((state) => {
        return BlockSelectors.getBlock(state, orgId)!;
    });

    const [parentId, setParentId] = React.useState(
        props.parentBlock?.customId || props.block?.parent
    );
    const parentBlock = useSelector<IAppState, IBlock | undefined>((state) => {
        if (parentId) {
            return BlockSelectors.getBlock(state, parentId);
        } else if (props.parentBlock) {
            return props.parentBlock;
        } else if (props.block) {
            return BlockSelectors.getBlock(state, props.block.parent!);
        }
    });

    const statusList = parentBlock?.boardStatuses || [];
    const labelList = parentBlock?.boardLabels || [];

    const collaboratorIds = Array.isArray(org.collaborators)
        ? org.collaborators
        : [];

    const collaborators = useSelector<IAppState, IUser[]>((state) =>
        UserSelectors.getUsers(state, collaboratorIds)
    );

    const [block, setBlock] = React.useState<IBlock>(() => {
        if (props.block) {
            return props.block;
        } else {
            const newBlock = getNewBlock(user, BlockType.Task, parentBlock);

            if (
                parentBlock &&
                parentBlock.boardStatuses &&
                parentBlock.boardStatuses.length > 0
            ) {
                newBlock.status = parentBlock.boardStatuses[0].customId;
                newBlock.statusAssignedAt = getDateString();
                newBlock.statusAssignedBy = user.customId;
            }

            return newBlock;
        }
    });

    const possibleParents = useBlockPossibleParents(block);
    const operationStatus = useOperation();

    const errors = operationStatus.error
        ? flattenErrorListWithDepthInfinite(operationStatus.error)
        : undefined;

    React.useEffect(() => {
        if (operationStatus.isCompleted && !props.block) {
            onClose();
        }
    });

    const onSubmit = async (values: ITaskFormValues) => {
        const data = { ...block, ...values };
        setBlock(data);

        const result = props.block
            ? await dispatch(
                  updateBlockOperationAction({
                      block,
                      data,
                      opId: operationStatus.opId,
                  })
              )
            : await dispatch(
                  addBlockOperationAction({
                      block: data,
                      opId: operationStatus.opId,
                  })
              );
        const op = unwrapResult(result);

        if (!op) {
            return;
        }

        const opStat = getOperationStats(op);

        if (!props.block) {
            if (opStat.isCompleted) {
                message.success("Task created successfully");
            } else if (opStat.isError) {
                message.error("Error creating task");
            }
        } else {
            if (opStat.isCompleted) {
                message.success("Task updated successfully");
            } else if (opStat.isError) {
                message.error("Error updating task");
            }
        }
    };

    return (
        <TaskForm
            value={block as any}
            collaborators={collaborators}
            labelList={labelList}
            statusList={statusList}
            user={user}
            onClose={onClose}
            formOnly={!props.block}
            task={props.block}
            onSubmit={onSubmit}
            isSubmitting={operationStatus.isLoading}
            errors={errors}
            possibleParents={possibleParents}
            onChangeParent={setParentId}
        />
    );
};

export default React.memo(TaskFormContainer);

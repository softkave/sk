import { unwrapResult } from "@reduxjs/toolkit";
import { message } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    BlockType,
    IBlock,
    IFormBlock,
    newFormBlock,
} from "../../models/block/block";
import { ISprint } from "../../models/sprint/types";
import { getCurrentAndUpcomingSprints } from "../../models/sprint/utils";
import { IUser } from "../../models/user/user";
import { IAddBlockEndpointErrors } from "../../net/block/types";
import BlockSelectors from "../../redux/blocks/selectors";
import OperationActions from "../../redux/operations/actions";
import { addBlockOpAction } from "../../redux/operations/block/addBlock";
import { updateBlockOpAction } from "../../redux/operations/block/updateBlock";
import SessionSelectors from "../../redux/session/selectors";
import SprintSelectors from "../../redux/sprints/selectors";
import { AppDispatch, IAppState } from "../../redux/types";
import UserSelectors from "../../redux/users/selectors";
import { flattenErrorList, indexArray } from "../../utils/utils";
import useBlockPossibleParents from "../hooks/useBlockPossibleParents";
import { getOpData } from "../hooks/useOperation";
import { IFormError } from "../utilities/types";
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
    const user = useSelector(SessionSelectors.assertGetUser);
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

    const sprints = useSelector<IAppState, ISprint[]>((state) => {
        const totalSprints = SprintSelectors.getBoardSprints(
            state,
            parentBlock!.customId
        );

        return getCurrentAndUpcomingSprints(totalSprints);
    });

    const memoizedSprintsMap = indexArray(sprints, { path: "customId" });
    const statusList = parentBlock?.boardStatuses || [];
    const statusMap = React.useMemo(
        () => indexArray(statusList, { path: "customId" }),
        [statusList]
    );

    const labelList = parentBlock?.boardLabels || [];
    const labelsMap = React.useMemo(
        () => indexArray(labelList, { path: "customId" }),
        [labelList]
    );

    const resolutionsList = parentBlock?.boardResolutions || [];
    const resolutionsMap = React.useMemo(
        () => indexArray(resolutionsList, { path: "customId" }),
        [resolutionsList]
    );

    const collaboratorIds = Array.isArray(org.collaborators)
        ? org.collaborators
        : [];

    const collaborators = useSelector<IAppState, IUser[]>((state) =>
        UserSelectors.getUsers(state, collaboratorIds)
    );

    const [existingBlock, setExistingBlock] = React.useState<
        IBlock | undefined
    >(() => props.block);

    const [blockData, setBlock] = React.useState<IFormBlock>(
        () => props.block || newFormBlock(user, BlockType.Task)
    );

    const [loading, setLoading] = React.useState(false);
    const [errors, setErrors] = React.useState<
        IFormError<IAddBlockEndpointErrors["block"]> | undefined
    >();

    const possibleParents = useBlockPossibleParents(
        BlockType.Task,
        blockData.parent
    );

    const onSubmit = async (values: ITaskFormValues) => {
        const data = { ...blockData, ...values };

        setLoading(true);
        setBlock(data);

        const result = existingBlock
            ? await dispatch(
                  updateBlockOpAction({
                      data,
                      blockId: existingBlock.customId,
                  })
              )
            : await dispatch(
                  addBlockOpAction({
                      block: data,
                  })
              );

        const op = unwrapResult(result);

        if (!op) {
            return;
        }

        const opData = getOpData(op);
        const block = op.status.data;

        setLoading(false);

        if (opData.error) {
            if (existingBlock) {
                message.error("Error updating board");
            } else {
                message.error("Error creating board");
            }

            const flattenedErrors = flattenErrorList(opData.error);
            setErrors({
                errors: flattenedErrors,
                errorList: opData.error,
            });
        } else {
            if (existingBlock) {
                message.success("Board updated successfully");
            } else {
                message.success("Board created successfully");
            }

            setExistingBlock(block);
            dispatch(OperationActions.deleteOperation(opData.opId));
        }
    };

    return (
        <TaskForm
            value={blockData as any}
            collaborators={collaborators}
            labelList={labelList}
            labelsMap={labelsMap}
            statusList={statusList}
            resolutionsList={resolutionsList}
            user={user}
            onClose={onClose}
            task={existingBlock}
            onSubmit={onSubmit}
            isSubmitting={loading}
            errors={errors?.errors}
            possibleParents={possibleParents}
            onChangeParent={setParentId}
            board={parentBlock!}
            sprints={sprints}
            sprintsMap={memoizedSprintsMap}
            statusMap={statusMap}
            resolutionsMap={resolutionsMap}
        />
    );
};

export default React.memo(TaskFormContainer);

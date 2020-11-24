import { unwrapResult } from "@reduxjs/toolkit";
import { message, Modal } from "antd";
import path from "path";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useRouteMatch } from "react-router";
import { Redirect } from "react-router-dom";
import { BlockType, IBlock } from "../../models/block/block";
import { ISprint } from "../../models/sprint/types";
import { getSprintRemainingWorkingDays } from "../../models/sprint/utils";
import subscribeEvent from "../../net/socket/outgoing/subscribeEvent";
import unsubcribeEvent from "../../net/socket/outgoing/unsubscribeEvent";
import OperationActions from "../../redux/operations/actions";
import { loadBlockChildrenOpAction } from "../../redux/operations/block/loadBlockChildren";
import OperationType from "../../redux/operations/OperationType";
import { endSprintOpAction } from "../../redux/operations/sprint/endSprint";
import { getSprintsOpAction } from "../../redux/operations/sprint/getSprints";
import SprintSelectors from "../../redux/sprints/selectors";
import { AppDispatch, IAppState } from "../../redux/types";
import GeneralErrorList from "../GeneralErrorList";
import useOperation, {
    getOpData,
    IOperationDerivedData,
    mergeOps,
} from "../hooks/useOperation";
import LoadingEllipsis from "../utilities/LoadingEllipsis";
import Board from "./Board";
import { IBoardResourceTypePathMatch, OnClickDeleteBlock } from "./types";

export interface IBoardContainerProps {
    blockPath: string;
    board: IBlock;
    isMobile: boolean;
    isAppMenuFolded: boolean;
    onToggleFoldAppMenu: () => void;
    onClickDeleteBlock: OnClickDeleteBlock;
}

const BoardContainer: React.FC<IBoardContainerProps> = (props) => {
    const {
        blockPath,
        board,
        isMobile,
        isAppMenuFolded,
        onClickDeleteBlock,
        onToggleFoldAppMenu,
    } = props;

    const dispatch: AppDispatch = useDispatch();
    const history = useHistory();

    const currentSprint = useSelector<IAppState, ISprint | undefined>(
        (state) => {
            if (board.currentSprintId) {
                return SprintSelectors.getSprint(state, board.currentSprintId);
            }

            return undefined;
        }
    );

    const resourceTypeMatch = useRouteMatch<IBoardResourceTypePathMatch>(
        `${blockPath}/:resourceType`
    );

    const resourceType =
        resourceTypeMatch && resourceTypeMatch.params.resourceType;

    const loadTasks = React.useCallback(
        (loadProps: IOperationDerivedData) => {
            const shouldLoad = !loadProps.operation;

            if (shouldLoad) {
                dispatch(
                    loadBlockChildrenOpAction({
                        blockId: board.customId,
                        typeList: [BlockType.Task],
                        opId: loadProps.opId,
                    })
                );
            }
        },
        [dispatch, board]
    );

    const loadSprints = React.useCallback(
        (loadProps: IOperationDerivedData) => {
            const shouldLoad = !loadProps.operation;

            if (shouldLoad) {
                dispatch(
                    getSprintsOpAction({
                        boardId: board.customId,
                        opId: loadProps.opId,
                    })
                );
            }
        },
        [dispatch, board.customId]
    );

    const sprintsOp = useOperation(
        {
            resourceId: board.customId,
            type: OperationType.GET_SPRINTS,
        },
        loadSprints,
        { deleteManagedOperationOnUnmount: false }
    );

    const tasksOp = useOperation(
        {
            resourceId: board.customId,
            type: OperationType.LOAD_BLOCK_CHILDREN,
        },
        loadTasks,
        { deleteManagedOperationOnUnmount: false }
    );

    // const fetchMissingOp = useFetchMissingBlockUpdates({
    //     block: board,
    //     isBlockDataLoaded: !!tasksOp && !!sprintsOp,
    // });

    // TODO: this code is duplicated in SprintsContainer
    const closeSprint = async (sprintId: string) => {
        const result = await dispatch(
            endSprintOpAction({
                sprintId,
            })
        );

        const op: any = unwrapResult(result);

        if (!op) {
            return;
        }

        const opStat = getOpData(op);

        if (opStat.isCompleted) {
            // TODO: duplicated in Board
            const SPRINTS_PATH = path.normalize(`${blockPath}/sprints`);
            history.push(SPRINTS_PATH);
            message.success(ENDED_SPRINT_SUCCESSFULLY);
        } else if (opStat.isError) {
            message.error(ERROR_CLOSING_SPRINT);
        }

        dispatch(OperationActions.deleteOperation(op.id));
    };

    const promptCloseSprint = () => {
        if (!currentSprint) {
            return;
        }

        const remainingWorkingDays = getSprintRemainingWorkingDays(
            currentSprint
        );

        let promptMessage = END_SPRINT_PROMPT_MESSAGE;

        if (remainingWorkingDays > 0) {
            promptMessage = getEndSprintRemainingWorkingDaysPromptMessage(
                remainingWorkingDays
            );
        }

        Modal.confirm({
            title: promptMessage,
            okText: YES,
            cancelText: NO,
            okType: "primary",
            okButtonProps: { danger: true },
            onOk: async () => closeSprint(currentSprint.customId),
            onCancel() {
                // do nothing
            },
        });
    };

    React.useEffect(() => {
        subscribeEvent([{ type: board.type as any, customId: board.customId }]);

        return () => {
            unsubcribeEvent([
                { type: board.type as any, customId: board.customId },
            ]);
        };
    }, [board.customId, board.type]);

    const ops = mergeOps([tasksOp, sprintsOp]);
    // const ops = mergeOps([tasksOp, sprintsOp, fetchMissingOp]);

    if (ops.loading) {
        return <LoadingEllipsis />;
    } else if (ops.errors) {
        return <GeneralErrorList fill errors={ops.errors} />;
    }

    // TODO: should we show error if block type is task ( it should never be task )?
    if (!resourceType) {
        const nextPath = path.normalize(blockPath + `/tasks`);
        return <Redirect to={nextPath} />;
    }

    return (
        <Board
            board={board}
            blockPath={blockPath}
            isAppMenuFolded={isAppMenuFolded}
            isMobile={isMobile}
            onClickDeleteBlock={onClickDeleteBlock}
            onToggleFoldAppMenu={onToggleFoldAppMenu}
            onCloseSprint={promptCloseSprint}
        />
    );
};

export default BoardContainer;

const END_SPRINT_PROMPT_MESSAGE = "Are you sure you want to end this sprint?";
const ENDED_SPRINT_SUCCESSFULLY = "Sprint ended successfully";
const ERROR_CLOSING_SPRINT = "Error ending sprint";
const YES = "Yes";
const NO = "No";

const getEndSprintRemainingWorkingDaysPromptMessage = (
    remainingDays: number
) => {
    return `${END_SPRINT_PROMPT_MESSAGE} It has ${remainingDays} working day${
        remainingDays === 1 ? "" : "s"
    } remaining.`;
};

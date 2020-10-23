import { unwrapResult } from "@reduxjs/toolkit";
import { message } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { IBlock } from "../../models/block/block";
import { ISprint } from "../../models/sprint/types";
import { IUser } from "../../models/user/user";
import OperationActions from "../../redux/operations/actions";
import { deleteSprintOpAction } from "../../redux/operations/sprint/deleteSprint";
import SprintSelectors from "../../redux/sprints/selectors";
import { AppDispatch, IAppState } from "../../redux/types";
import { getOpStats } from "../hooks/useOperation";
import Sprints from "./Sprints";
import groupBySprints from "./utils/groupBySprints";

export interface ISprintsContainerProps {
    board: IBlock;
    tasks: IBlock[];
    collaborators: IUser[];
    onUpdateSprint: (sprint: ISprint) => void;
    onClickUpdateBlock: (block: IBlock) => void;
}

const SprintsContainer: React.FC<ISprintsContainerProps> = (props) => {
    const {
        board,
        tasks,
        collaborators,
        onUpdateSprint,
        onClickUpdateBlock,
    } = props;

    const dispatch: AppDispatch = useDispatch();

    const sprints = useSelector<IAppState, ISprint[]>((state) =>
        SprintSelectors.getBoardSprints(state, board.customId)
    );

    const groups = groupBySprints(sprints, tasks);

    const onDeleteSprint = async (sprintId: string) => {
        const result = await dispatch(
            deleteSprintOpAction({
                sprintId,
            })
        );

        const op = unwrapResult(result);

        if (!op) {
            return;
        }

        const opStat = getOpStats(op);

        if (opStat.isCompleted) {
            message.success(SPRINT_DELETED_SUCCESSFULLY);
        } else if (opStat.isError) {
            message.error(ERROR_DELETING_SPRINT);
        }

        dispatch(OperationActions.deleteOperation(op.id));
    };

    return (
        <Sprints
            groups={groups}
            board={board}
            collaborators={collaborators}
            onClickUpdateBlock={onClickUpdateBlock}
            onDeleteSprint={onDeleteSprint}
            // TODO: make this better
            onUpdateSprint={(sprintId) =>
                onUpdateSprint(sprints.find((s) => s.customId === sprintId)!)
            }
        />
    );
};

export default SprintsContainer;

const SPRINT_DELETED_SUCCESSFULLY = "Sprint deleted successfully";
const ERROR_DELETING_SPRINT = "Error deleting sprint";

import React from "react";
import { useSelector } from "react-redux";
import { IBlock } from "../../models/block/block";
import { IUser } from "../../models/user/user";
import SessionSelectors from "../../redux/session/selectors";
import { IAppState } from "../../redux/types";
import TaskList from "./TaskList";

export interface ITaskStatusContainerProps {
    tasks: IBlock[];
    users: IUser[];
    board: IBlock;

    style?: React.CSSProperties;
    toggleForm?: (block: IBlock) => void;
}

// TODO: should we make updates locally first before persisting it in the server for better UX?
// and for client-side only work

const TaskStatusContainer: React.FC<ITaskStatusContainerProps> = (props) => {
    const { board } = props;

    const user = useSelector<IAppState, IUser>((state) => {
        return SessionSelectors.getSignedInUserRequired(state);
    });

    const statusList = board.boardStatuses || [];
    const resolutionsList = board.boardResolutions || [];
    const labelList = board.boardLabels || [];

    return (
        <TaskList
            {...props}
            labelList={labelList}
            resolutionsList={resolutionsList}
            statusList={statusList}
            user={user}
        />
    );
};

export default React.memo(TaskStatusContainer);

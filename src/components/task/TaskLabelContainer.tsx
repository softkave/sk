import React from "react";
import { useSelector } from "react-redux";
import { IBlock, IBlockStatus } from "../../models/block/block";
import { IUser } from "../../models/user/user";
import BlockSelectors from "../../redux/blocks/selectors";
import SessionSelectors from "../../redux/session/selectors";
import { IAppState } from "../../redux/types";
import TaskLabels, { ITaskLabelsProps } from "./TaskLabels";

export interface ITaskLabelContainerProps
    extends Omit<ITaskLabelsProps, keyof { labelList: any; user: any }> {
    task: IBlock;
    demo?: boolean;
}

const TaskLabelContainer: React.FC<ITaskLabelContainerProps> = (props) => {
    const { task, demo } = props;

    const user = useSelector<IAppState, IUser>((state) => {
        if (demo) {
            return ({} as unknown) as IUser;
        }

        return SessionSelectors.getSignedInUserRequired(state);
    });

    const labelList = useSelector<IAppState, IBlockStatus[]>((state) => {
        return BlockSelectors.getBlock(state, task.parent!)?.boardLabels || [];
    });

    return (
        <TaskLabels
            {...props}
            labelList={labelList}
            user={user}
            labels={task.labels}
        />
    );
};

export default React.memo(TaskLabelContainer);

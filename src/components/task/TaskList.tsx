import React from "react";
import {
    IBlock,
    IBlockLabel,
    IBlockStatus,
    IBoardTaskResolution,
} from "../../models/block/block";
import { ISprint } from "../../models/sprint/types";
import { IUser } from "../../models/user/user";
import { sortBlocksByPriority } from "../block/sortBlocks";
import StyledContainer from "../styled/Container";
import List from "../styled/List";
import Task from "./Task";

export interface ITaskListProps {
    board: IBlock;
    tasks: IBlock[];
    users: IUser[];
    statusList: IBlockStatus[];
    labelList: IBlockLabel[];
    resolutionsList: IBoardTaskResolution[];
    sprints: ISprint[];
    sprintsMap: { [key: string]: ISprint };
    user: IUser;

    demo?: boolean;
    style?: React.CSSProperties;
    toggleForm?: (block: IBlock) => void;
}

const TaskList: React.FC<ITaskListProps> = (props) => {
    const {
        tasks,
        board,
        demo,
        statusList,
        users,
        style,
        labelList,
        resolutionsList,
        user,
        sprints,
        sprintsMap,
        toggleForm,
    } = props;
    const tasksToRender = sortBlocksByPriority(tasks);
    const renderTask = (task: IBlock, i: number) => {
        const isNotLastTask = i < tasksToRender.length - 1;

        return (
            <StyledContainer
                key={task.customId}
                style={{
                    borderBottom: isNotLastTask
                        ? "1px solid #f0f0f0"
                        : undefined,
                    paddingBottom: "24px",
                    paddingTop: "24px",
                }}
            >
                <Task
                    task={task}
                    board={board}
                    orgUsers={users}
                    demo={demo}
                    statusList={statusList}
                    onEdit={
                        toggleForm
                            ? (editedTask) => toggleForm(editedTask)
                            : undefined
                    }
                    user={user}
                    labelList={labelList}
                    resolutionsList={resolutionsList}
                    sprints={sprints}
                    sprintsMap={sprintsMap}
                />
            </StyledContainer>
        );
    };

    const renderList = () => {
        return (
            <List
                dataSource={tasksToRender}
                emptyDescription="No tasks available."
                renderItem={renderTask}
            />
        );
    };

    const renderListContainer = () => {
        return (
            <StyledContainer
                style={{
                    flexDirection: "column",
                    width: "100%",
                    flex: 1,
                    ...style,
                }}
            >
                {renderList()}
            </StyledContainer>
        );
    };

    return renderListContainer();
};

TaskList.defaultProps = { style: {} };

export default React.memo(TaskList);

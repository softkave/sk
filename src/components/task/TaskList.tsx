import React from "react";
import { IBlock, IBlockStatus } from "../../models/block/block";
import { IUser } from "../../models/user/user";
import { sortBlocksByPriority } from "../block/sortBlocks";
import StyledContainer from "../styled/Container";
import List from "../styled/List";
import Task from "./Task";

export interface ITaskListProps {
    tasks: IBlock[];
    users: IUser[];

    demo?: boolean;
    statusList?: IBlockStatus[];
    style?: React.CSSProperties;
    toggleForm?: (block: IBlock) => void;
}

const TaskList: React.FC<ITaskListProps> = (props) => {
    const { toggleForm, tasks, demo, statusList, users, style } = props;
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
                    orgUsers={users}
                    demo={demo}
                    statusList={statusList}
                    onEdit={
                        toggleForm
                            ? (editedTask) => toggleForm(editedTask)
                            : undefined
                    }
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

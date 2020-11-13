import React from "react";
import { IBlock } from "../../models/block/block";
import { sortBlocksByPriority } from "../block/sortBlocks";
import { ITasksContainerRenderFnProps } from "../board/TasksContainer";
import StyledContainer from "../styled/Container";
import List from "../styled/List";
import Task from "./Task";

export interface ITaskListProps extends ITasksContainerRenderFnProps {
    demo?: boolean;
    style?: React.CSSProperties;
    toggleForm?: (block: IBlock) => void;
    getBlockStyle?: (block: IBlock, index: number) => React.CSSProperties;
}

const TaskList: React.FC<ITaskListProps> = (props) => {
    const { tasks, demo, style, toggleForm, getBlockStyle } = props;

    const tasksToRender = sortBlocksByPriority(tasks);

    const renderTask = (task: IBlock, i: number) => {
        const isNotLastTask = i < tasksToRender.length - 1;
        const taskStyle = getBlockStyle ? getBlockStyle(task, i) : {};

        return (
            <StyledContainer
                key={task.customId}
                style={{
                    ...taskStyle,
                    borderBottom: isNotLastTask
                        ? "1px solid #f0f0f0"
                        : undefined,
                    paddingBottom: "24px",
                    paddingTop: "24px",
                }}
            >
                <Task
                    {...props}
                    task={task}
                    demo={demo}
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

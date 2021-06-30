import { css } from "@emotion/css";
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
    disableDragAndDrop?: boolean;
    toggleForm?: (block: IBlock) => void;
    getBlockStyle?: (block: IBlock, index: number) => React.CSSProperties;
}

const classes = {
    taskContainer: css({
        // marginTop: "16px",

        "&:last-of-type": {
            paddingBottom: "16px",
        },
    }),
};

const TaskList: React.FC<ITaskListProps> = (props) => {
    const { tasks, demo, style, toggleForm, getBlockStyle } = props;

    const tasksToRender = sortBlocksByPriority(tasks);

    const renderTask = (task: IBlock, i: number) => {
        const taskStyle = getBlockStyle ? getBlockStyle(task, i) : {};

        return (
            <div
                key={task.customId}
                style={taskStyle}
                className={classes.taskContainer}
            >
                <Task
                    {...props}
                    task={task}
                    index={i}
                    demo={demo}
                    onEdit={
                        toggleForm
                            ? (editedTask) => toggleForm(editedTask)
                            : undefined
                    }
                />
            </div>
        );
    };

    const renderList = () => {
        return (
            <List
                dataSource={tasksToRender}
                emptyDescription="Create or add task"
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

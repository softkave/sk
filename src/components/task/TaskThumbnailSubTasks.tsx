import { Space, Typography } from "antd";
import React from "react";
import { ChevronDown, ChevronUp } from "react-feather";
import { IBlock } from "../../models/block/block";
import StyledContainer from "../styled/Container";
import TaskSubTask from "./TaskSubTask";

export interface ITaskThumbnailSubTasksProps {
    task: IBlock;
    onToggleSubTask: (index: number) => Promise<void>;
}

const TaskThumbnailSubTasks: React.FC<ITaskThumbnailSubTasksProps> = (
    props
) => {
    const { task, onToggleSubTask } = props;
    const [showSubTasks, setShowSubTasks] = React.useState(false);
    const subTasks = task.subTasks || [];
    const count = subTasks.length;

    if (count === 0) {
        return null;
    }

    const completedSubTasksCount = subTasks.filter(
        (subTask) => !!subTask.completedBy
    ).length;

    if (!showSubTasks) {
        return (
            <StyledContainer
                onClick={() => setShowSubTasks(true)}
                s={{
                    cursor: "pointer",
                    "&:hover": {
                        "& *": { color: "rgb(66,133,244) !important" },
                    },
                }}
            >
                <Space>
                    <Typography.Text type="secondary">
                        Show subtasks ( {completedSubTasksCount} of {count}{" "}
                        completed )
                    </Typography.Text>
                    <StyledContainer>
                        <ChevronDown
                            style={{
                                width: "18px",
                                height: "18px",
                                color: "rgba(0, 0, 0, 0.65)",
                            }}
                        />
                    </StyledContainer>
                </Space>
            </StyledContainer>
        );
    }

    return (
        <Space direction="vertical">
            <StyledContainer
                onClick={() => setShowSubTasks(false)}
                s={{
                    cursor: "pointer",
                    "&:hover": {
                        "& *": { color: "rgb(66,133,244) !important" },
                    },
                }}
            >
                <Space>
                    <Typography.Text type="secondary">
                        Hide subtasks
                    </Typography.Text>
                    <StyledContainer>
                        <ChevronUp
                            style={{
                                width: "18px",
                                height: "18px",
                                color: "rgba(0, 0, 0, 0.65)",
                            }}
                        />
                    </StyledContainer>
                </Space>
            </StyledContainer>
            {subTasks.map((subTask, i) => (
                <TaskSubTask
                    key={subTask.customId}
                    subTask={subTask}
                    onToggleSubTask={() => onToggleSubTask(i)}
                />
            ))}
        </Space>
    );
};

export default React.memo(TaskThumbnailSubTasks);

import { Tag } from "antd";
import React from "react";
import { BlockPriority } from "../../models/block/block";

export type TaskPriority = BlockPriority;

export const priorityToColorMap = {
    [BlockPriority.NotImportant]: "#EACA2C",
    [BlockPriority.Important]: "#7ED321",
    [BlockPriority.VeryImportant]: "rgb(255, 77, 79)",
};

interface IPriorityProps {
    level: TaskPriority;
    className?: string;
}

const Priority: React.FC<IPriorityProps> = (props) => {
    const { level, className } = props;

    return (
        <Tag color={priorityToColorMap[props.level]} className={className}>
            {level}
        </Tag>
    );
};

export default Priority;

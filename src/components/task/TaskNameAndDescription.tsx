import { Typography } from "antd";
import React from "react";
import { IBlock } from "../../models/block/block";

export interface ITaskNameAndDescriptionProps {
    task: IBlock;
}

const TaskNameAndDescription: React.FC<ITaskNameAndDescriptionProps> = (
    props
) => {
    const { task } = props;

    return (
        <Typography.Paragraph style={{ marginBottom: "0" }}>
            {task.name}
        </Typography.Paragraph>
    );
};

export default React.memo(TaskNameAndDescription);

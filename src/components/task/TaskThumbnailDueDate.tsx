import { Tag, Typography } from "antd";
import moment from "moment";
import React from "react";
import { IBlock } from "../../models/block/block";

export interface ITaskThumbnailDueDateProps {
    task: IBlock;
    isInLastStatus?: boolean;
}

const TaskThumbnailDueDate: React.FC<ITaskThumbnailDueDateProps> = (props) => {
    const { task, isInLastStatus } = props;

    if (!task.dueAt) {
        return null;
    }

    if (isInLastStatus) {
        return null;
    }

    const dueAt = moment(task.dueAt);
    const completedAt = moment(task.statusAssignedAt);
    const isDue = task.dueAt && Date.now() > dueAt.valueOf();

    const contentText = isInLastStatus
        ? `Completed ${completedAt.fromNow()}`
        : `Due ${dueAt.fromNow()}`;

    return (
        <Tag color={isDue ? "red" : undefined}>
            <Typography.Text style={{ verticalAlign: "middle" }}>
                {contentText}
            </Typography.Text>
        </Tag>
    );
};

export default React.memo(TaskThumbnailDueDate);

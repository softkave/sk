import { Space, Tag, Typography } from "antd";
import moment from "moment";
import React from "react";
import { Clock } from "react-feather";
import { IBlock, IBlockStatus } from "../../models/block/block";
import { isTaskInLastStatus } from "../../models/block/utils";

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
            <Space align="center" style={{ height: "100%" }}>
                <span
                    style={{
                        display: "flex",
                        alignItems: "center",
                        height: "100%",
                    }}
                >
                    <Clock
                        style={{
                            width: "12px",
                            height: "12px",
                            color: "#999",
                        }}
                    />
                </span>
                <Typography.Text>{contentText}</Typography.Text>
            </Space>
        </Tag>
    );
};

export default React.memo(TaskThumbnailDueDate);

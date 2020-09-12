import { Space, Tag, Typography } from "antd";
import moment from "moment";
import React from "react";
import { Clock } from "react-feather";
import { IBlock, IBlockStatus } from "../../models/block/block";

export interface ITaskThumbnailDueDateProps {
    task: IBlock;
    statusList: IBlockStatus[];
}

const TaskThumbnailDueDate: React.FC<ITaskThumbnailDueDateProps> = (props) => {
    const { task, statusList } = props;

    if (!task.dueAt) {
        return null;
    }

    const dueAt = moment(task.dueAt);
    const completedAt = moment(task.statusAssignedAt);
    const lastStatus = statusList[statusList.length - 1];
    const isInLastStatus = task.status === lastStatus.customId;
    const isDue = task.dueAt && Date.now() > dueAt.valueOf();

    const contentText = isInLastStatus
        ? `Completed ${completedAt.fromNow()}`
        : `Due ${dueAt.fromNow()}`;

    return (
        <Tag color={isInLastStatus ? "green" : isDue ? "red" : undefined}>
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
                            width: "14px",
                            height: "14px",
                            color: "rgba(0, 0, 0, 0.65)",
                        }}
                    />
                </span>
                <Typography.Text>{contentText}</Typography.Text>
            </Space>
        </Tag>
    );
};

export default React.memo(TaskThumbnailDueDate);

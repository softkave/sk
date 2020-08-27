import { Space, Tag, Typography } from "antd";
import moment from "moment";
import React from "react";
import { Clock } from "react-feather";
import { IBlock } from "../../models/block/block";

export interface ITaskThumbnailDueDateProps {
    task: IBlock;
}

const TaskThumbnailDueDate: React.FC<ITaskThumbnailDueDateProps> = (props) => {
    const { task } = props;

    if (!task.dueAt) {
        return null;
    }

    const dueAt = moment(task.dueAt);

    return (
        <Tag
            color={
                task.dueAt && Date.now() > dueAt.valueOf() ? "red" : undefined
            }
        >
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
                            width: "16px",
                            height: "16px",
                            color: "rgba(0, 0, 0, 0.65)",
                        }}
                    />
                </span>
                <Typography.Text>Due {dueAt.fromNow()}</Typography.Text>
            </Space>
        </Tag>
    );
};

export default React.memo(TaskThumbnailDueDate);

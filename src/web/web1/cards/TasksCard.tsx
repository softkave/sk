import { Typography } from "antd";
import React from "react";
import Task, { ITaskProps } from "../../../components/task/Task";
import WebCard from "./WebCard";

const TasksCard: React.FC<ITaskProps> = (props) => {
    return (
        <WebCard
            title={
                <Typography.Text>
                    Create and manage{" "}
                    <Typography.Text strong>tasks</Typography.Text>,{" "}
                    <Typography.Text strong>status</Typography.Text>, and{" "}
                    <Typography.Text strong>resolutions</Typography.Text>,{" "}
                </Typography.Text>
            }
        >
            <div style={{ width: "300px" }}>
                <Task demo {...props} />
            </div>
        </WebCard>
    );
};

export default TasksCard;

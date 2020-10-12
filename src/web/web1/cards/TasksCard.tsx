import { Typography } from "antd";
import React from "react";
import WebCard from "./WebCard";

const TasksCard: React.FC<{}> = () => {
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
        ></WebCard>
    );
};

export default TasksCard;

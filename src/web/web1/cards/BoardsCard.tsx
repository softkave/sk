import { Typography } from "antd";
import React from "react";
import WebCard from "./WebCard";

const BoardsCard: React.FC<{}> = () => {
    return (
        <WebCard
            title={
                <Typography.Text>
                    You can create{" "}
                    <Typography.Text strong>boards</Typography.Text>
                </Typography.Text>
            }
        ></WebCard>
    );
};

export default BoardsCard;

import { Typography } from "antd";
import React from "react";
import WebCard from "./WebCard";

const OrgsCard: React.FC<{}> = () => {
    return (
        <WebCard
            title={
                <Typography.Text>
                    Create and manage{" "}
                    <Typography.Text strong>orgs</Typography.Text>
                </Typography.Text>
            }
        ></WebCard>
    );
};

export default OrgsCard;

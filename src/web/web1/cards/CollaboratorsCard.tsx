import { Typography } from "antd";
import React from "react";
import WebCard from "./WebCard";

const CollaboratorsCard: React.FC<{}> = () => {
    return (
        <WebCard
            title={
                <Typography.Text>
                    Invite{" "}
                    <Typography.Text strong>collaborators</Typography.Text>
                </Typography.Text>
            }
        ></WebCard>
    );
};

export default CollaboratorsCard;

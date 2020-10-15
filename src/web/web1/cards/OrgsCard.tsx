import { Typography } from "antd";
import React from "react";
import BlockThumbnail from "../../../components/block/BlockThumnail";
import { IBlock } from "../../../models/block/block";
import WebCard from "./WebCard";

export interface IOrgsCardProps {
    org: IBlock;
}

const OrgsCard: React.FC<IOrgsCardProps> = (props) => {
    const { org } = props;

    return (
        <WebCard
            title={
                <Typography.Text>
                    Create and manage{" "}
                    <Typography.Text strong>orgs</Typography.Text>
                </Typography.Text>
            }
        >
            <BlockThumbnail block={org} showFields={["name", "type"]} />
        </WebCard>
    );
};

export default OrgsCard;

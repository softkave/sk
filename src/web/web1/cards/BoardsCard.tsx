import { Typography } from "antd";
import React from "react";
import BlockThumbnail from "../../../components/block/BlockThumnail";
import { IBlock } from "../../../models/block/block";
import WebCard from "./WebCard";

export interface IBoardsCardProps {
    board: IBlock;
}

const BoardsCard: React.FC<IBoardsCardProps> = (props) => {
    const { board } = props;

    return (
        <WebCard
            title={
                <Typography.Text>
                    You can create{" "}
                    <Typography.Text strong>boards</Typography.Text>
                </Typography.Text>
            }
        >
            <BlockThumbnail block={board} showFields={["name", "type"]} />
        </WebCard>
    );
};

export default BoardsCard;

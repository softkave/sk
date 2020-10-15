import { Typography } from "antd";
import React from "react";
import CollaborationRequestThumbnail from "../../../components/collaborator/CollaborationRequestThumbnail";
import { INotification } from "../../../models/notification/notification";
import WebCard from "./WebCard";

export interface ICollaboratorsCardProps {
    request: INotification;
}

const CollaboratorsCard: React.FC<ICollaboratorsCardProps> = (props) => {
    return (
        <WebCard
            title={
                <Typography.Text>
                    Invite{" "}
                    <Typography.Text strong>collaborators</Typography.Text>
                </Typography.Text>
            }
        >
            <CollaborationRequestThumbnail {...props} />
        </WebCard>
    );
};

export default CollaboratorsCard;

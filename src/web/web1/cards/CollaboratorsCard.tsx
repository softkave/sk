import { Typography } from "antd";
import { noop } from "lodash";
import React from "react";
import CollaborationRequestThumbnail from "../../../components/collaborator/CollaborationRequestThumbnail";
import { ICollaborationRequest } from "../../../models/collaborationRequest/types";
import WebCard from "./WebCard";

export interface ICollaboratorsCardProps {
  request: ICollaborationRequest;
}

const CollaboratorsCard: React.FC<ICollaboratorsCardProps> = (props) => {
  return (
    <WebCard
      title={
        <Typography.Text>
          Invite <Typography.Text strong>collaborators</Typography.Text>
        </Typography.Text>
      }
    >
      <CollaborationRequestThumbnail {...props} onClick={noop} />
    </WebCard>
  );
};

export default CollaboratorsCard;

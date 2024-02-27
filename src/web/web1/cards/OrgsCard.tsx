import { Typography } from "antd";
import React from "react";
import BlockThumbnail from "../../../components/block/BlockThumnail";
import { IWorkspace } from "../../../models/organization/types";
import WebCard from "./WebCard";

export interface IOrgsCardProps {
  org: IWorkspace;
}

const OrgsCard: React.FC<IOrgsCardProps> = (props) => {
  const { org } = props;

  return (
    <WebCard
      title={
        <Typography.Text>
          Create and manage <Typography.Text strong>orgs</Typography.Text>
        </Typography.Text>
      }
    >
      <BlockThumbnail showName showDescription block={org} />
    </WebCard>
  );
};

export default OrgsCard;

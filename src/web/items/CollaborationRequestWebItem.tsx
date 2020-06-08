import { Typography } from "antd";
import React from "react";
import CollaborationRequestThumbnail from "../../components/collaborator/CollaborationRequestThumbnail";
import StyledContainer from "../../components/styled/Container";
import { demoCollaborationRequest } from "./data";
import WebItem from "./Item";

const CollaborationRequestWebItem: React.FC<{}> = () => {
  const label = (
    <Typography.Paragraph>
      Send <Typography.Text strong>collaboration requests</Typography.Text> to
      user email addresses.
    </Typography.Paragraph>
  );

  const content = (
    <StyledContainer s={{ width: "100%" }}>
      <CollaborationRequestThumbnail request={demoCollaborationRequest} />
    </StyledContainer>
  );

  return <WebItem content={content} label={label} />;
};

export default CollaborationRequestWebItem;

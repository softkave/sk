import { Space, Typography } from "antd";
import React from "react";
import { ICollaborationRequest } from "../../models/collaborationRequest/types";
import { getNameInitials } from "../../models/utils";
import CollaborationRequestStatus from "../collaborator/CollaborationRequestStatus";
import ItemAvatar from "../ItemAvatar";
import StyledContainer from "../styled/Container";

export interface IOrgCollaborationRequestThumbnailProps {
  collabRequest: ICollaborationRequest;
  style?: React.CSSProperties;
  className?: string;
  onClick?: () => void;
}

const OrgCollaborationRequestThumbnail: React.SFC<
  IOrgCollaborationRequestThumbnailProps
> = (props) => {
  const { collabRequest, onClick, style, className } = props;

  // TODO: do line clamping on the texts
  return (
    <StyledContainer
      s={{ flex: 1, cursor: "pointer", ...style }}
      className={className}
      onClick={onClick}
    >
      <StyledContainer>
        <ItemAvatar>{getNameInitials(collabRequest.from.blockName)}</ItemAvatar>
      </StyledContainer>
      <Space direction="vertical" style={{ marginLeft: "16px" }} size={4}>
        <Typography.Text>{collabRequest.from?.blockName}</Typography.Text>
        <CollaborationRequestStatus request={collabRequest} />
      </Space>
    </StyledContainer>
  );
};

OrgCollaborationRequestThumbnail.defaultProps = {
  style: {},
};

export default React.memo(OrgCollaborationRequestThumbnail);

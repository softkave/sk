import { Space, Typography } from "antd";
import React from "react";
import { ICollaborationRequest } from "../../models/collaborationRequest/types";
import { getNameInitials } from "../../models/utils";
import CollaborationRequestStatus from "../collaborator/CollaborationRequestStatus";
import ItemAvatar from "../ItemAvatar";

export interface IOrgCollaborationRequestThumbnailProps {
  collabRequest: ICollaborationRequest;
  style?: React.CSSProperties;
  className?: string;
  isSelected?: boolean;
  onClick?: () => void;
}

const OrgCollaborationRequestThumbnail: React.FC<
  IOrgCollaborationRequestThumbnailProps
> = (props) => {
  const { collabRequest, style, className, isSelected, onClick } = props;
  return (
    <div
      style={{
        flex: 1,
        cursor: "pointer",
        backgroundColor: isSelected ? "#e6f7ff" : undefined,
        ...style,
      }}
      className={className}
      onClick={onClick}
    >
      <div>
        <ItemAvatar>{getNameInitials(collabRequest.from.blockName)}</ItemAvatar>
      </div>
      <Space direction="vertical" style={{ marginLeft: "16px" }} size={4}>
        <Typography.Text style={{ color: isSelected ? "#1890ff" : undefined }}>
          {collabRequest.from?.blockName}
        </Typography.Text>
        <CollaborationRequestStatus request={collabRequest} />
      </Space>
    </div>
  );
};

OrgCollaborationRequestThumbnail.defaultProps = {
  style: {},
};

export default React.memo(OrgCollaborationRequestThumbnail);

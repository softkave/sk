import { Space, Tag, Typography } from "antd";
import { defaultTo } from "lodash";
import React from "react";
import { ICollaborationRequest } from "../../models/collaborationRequest/types";
import { getNameInitials } from "../../models/utils";
import ItemAvatar from "../ItemAvatar";
import CollaborationRequestStatus from "../collaborator/CollaborationRequestStatus";

export interface IRequestThumbnailProps {
  request: ICollaborationRequest;
  style?: React.CSSProperties;
  className?: string;
  isSelected?: boolean;
  onClick?: () => void;
}

const RequestThumbnail: React.FC<IRequestThumbnailProps> = (props) => {
  const { request, style, className, isSelected, onClick } = props;
  return (
    <div
      style={{
        display: "flex",
        cursor: "pointer",
        backgroundColor: isSelected ? "#e6f7ff" : undefined,
        ...defaultTo(style, {}),
      }}
      className={className}
      onClick={onClick}
    >
      <div>
        <ItemAvatar>{getNameInitials(request.from.workspaceName)}</ItemAvatar>
      </div>
      <Space direction="vertical" style={{ marginLeft: "16px" }} size={4}>
        <Typography.Text style={{ color: isSelected ? "#1890ff" : undefined }}>
          {request.from?.workspaceName}
        </Typography.Text>
        <Space size={0}>
          <CollaborationRequestStatus request={request} />
          {!request.readAt && <Tag>Unseen</Tag>}
        </Space>
      </Space>
    </div>
  );
};

export default RequestThumbnail;

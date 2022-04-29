import { Space, Typography } from "antd";
import { defaultTo } from "lodash";
import React from "react";
import { ICollaborationRequest } from "../../models/collaborationRequest/types";
import { getNameInitials } from "../../models/utils";
import CollaborationRequestStatus from "../collaborator/CollaborationRequestStatus";
import ItemAvatar from "../ItemAvatar";

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
        flex: 1,
        cursor: "pointer",
        backgroundColor: isSelected ? "#e6f7ff" : undefined,
        ...defaultTo(style, {}),
      }}
      className={className}
      onClick={onClick}
    >
      <div>
        <ItemAvatar>{getNameInitials(request.from.blockName)}</ItemAvatar>
      </div>
      <Space direction="vertical" style={{ marginLeft: "16px" }} size={4}>
        <Typography.Text style={{ color: isSelected ? "#1890ff" : undefined }}>
          {request.from?.blockName}
        </Typography.Text>
        <CollaborationRequestStatus request={request} />
      </Space>
    </div>
  );
};

export default RequestThumbnail;

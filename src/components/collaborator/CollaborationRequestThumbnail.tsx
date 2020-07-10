import styled from "@emotion/styled";
import { Tag, Typography } from "antd";
import moment from "moment";
import React from "react";
import {
  CollaborationRequestStatusType,
  INotification,
} from "../../models/notification/notification";
import cloneWithWidth from "../styled/cloneWithWidth";
import StyledContainer from "../styled/Container";

const colorMap = {
  pending: "#EACA2C",
  accepted: "#7ED321",
  declined: "rgb(255, 77, 79)",
};

export interface ICollaborationRequestThumbnailProps {
  request: INotification;
  style?: React.CSSProperties;
  className?: string;
  onClick?: () => void;
}

const CollaborationRequestThumbnail: React.SFC<ICollaborationRequestThumbnailProps> = (
  props
) => {
  const { request, style, onClick, className } = props;
  const statusHistory = request.statusHistory || [];
  const latestStatus = statusHistory[statusHistory.length - 1];
  const expiresAt = moment(request.expiresAt);
  const expired = request.expiresAt && moment().isAfter(expiresAt);

  const renderStatus = () => {
    if (expired) {
      return <Tag color={colorMap.declined}>expired</Tag>;
    }

    switch (latestStatus.status) {
      case CollaborationRequestStatusType.Accepted:
        return <Tag color={colorMap.accepted}>accepted</Tag>;

      case CollaborationRequestStatusType.Declined:
        return <Tag color={colorMap.declined}>declined</Tag>;

      case CollaborationRequestStatusType.Pending:
        return <Tag color={colorMap.pending}>pending</Tag>;

      case CollaborationRequestStatusType.Revoked:
        return <Tag color={colorMap.declined}>revoked</Tag>;
    }

    return null;
  };

  return (
    <StyledContainer
      s={{ width: "100%" }}
      style={style}
      onClick={onClick}
      className={className}
    >
      {cloneWithWidth(
        <StyledRequestDataContainer>
          <Typography.Text strong ellipsis>
            {request.to.email}
          </Typography.Text>
          {request.expiresAt && (
            <Typography.Text>
              {expired ? "Expired" : "Expires"}{" "}
              {moment(request.expiresAt).fromNow()}
            </Typography.Text>
          )}
          <StyledContainer>{renderStatus()}</StyledContainer>
        </StyledRequestDataContainer>,
        { marginLeft: 16 }
      )}
    </StyledContainer>
  );
};

export default CollaborationRequestThumbnail;

const StyledRequestDataContainer = styled.div({
  flex: 1,
  display: "flex",
  flexDirection: "column",
});

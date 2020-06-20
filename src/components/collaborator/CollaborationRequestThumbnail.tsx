import styled from "@emotion/styled";
import { Typography } from "antd";
import moment from "moment";
import React from "react";
import { INotification } from "../../models/notification/notification";
import cloneWithWidth from "../styled/cloneWithWidth";
import StyledContainer from "../styled/Container";
import StyledFlexContainer from "../styled/FlexContainer";

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
          {latestStatus && (
            <Typography.Text>
              Status - {expired ? "expired" : latestStatus.status}
            </Typography.Text>
          )}
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

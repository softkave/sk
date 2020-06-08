import styled from "@emotion/styled";
import { Typography } from "antd";
import moment from "moment";
import React from "react";
import { INotification } from "../../models/notification/notification";
import cloneWithWidth from "../styled/cloneWithWidth";
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
  console.log(request);

  return (
    <StyledFlexContainer style={style} onClick={onClick} className={className}>
      {cloneWithWidth(
        <StyledRequestDataContainer>
          <Typography.Text strong ellipsis>
            {request.to.email}
          </Typography.Text>
          {request.expiresAt && (
            <Typography.Text>
              Expires in {moment(request.expiresAt).fromNow()}
            </Typography.Text>
          )}
          {latestStatus && (
            <Typography.Text>Status - {latestStatus.status}</Typography.Text>
          )}
        </StyledRequestDataContainer>,
        { marginLeft: 16 }
      )}
    </StyledFlexContainer>
  );
};

export default CollaborationRequestThumbnail;

const StyledRequestDataContainer = styled.div({
  flex: 1,
  display: "flex",
  flexDirection: "column",
});

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

const CollaborationRequestThumbnail: React.FC<ICollaborationRequestThumbnailProps> = props => {
  const { request, style, onClick, className } = props;
  const latestStatus = request.statusHistory[request.statusHistory.length - 1];

  return (
    <StyledFlexContainer style={style} onClick={onClick} className={className}>
      {/* <ItemAvatar color={collaborator.color} /> */}
      {cloneWithWidth(
        <StyledRequestDataContainer>
          <Typography.Text strong ellipsis>
            {request.to.email}
          </Typography.Text>
          {request.expiresAt && (
            <Typography.Text>
              {moment(request.expiresAt).fromNow()}
            </Typography.Text>
          )}
          {latestStatus && (
            <Typography.Text>{latestStatus.status}</Typography.Text>
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
  marginLeft: 16,
  display: "flex",
  flexDirection: "column"
});

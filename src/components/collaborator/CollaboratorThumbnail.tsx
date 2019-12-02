import styled from "@emotion/styled";
import { Typography } from "antd";
import React from "react";
import { IUser } from "../../models/user/user";
import ItemAvatar from "../ItemAvatar";
import cloneWithWidth from "../styled/cloneWithWidth";
import StyledFlexContainer from "../styled/FlexContainer";

export interface ICollaboratorThumbnailProps {
  collaborator: IUser;
  style?: React.CSSProperties;
  className?: string;
  onClick?: () => void;
}

const CollaboratorThumbnail: React.FC<ICollaboratorThumbnailProps> = props => {
  const { collaborator, style, onClick, className } = props;

  return (
    <StyledFlexContainer style={style} onClick={onClick} className={className}>
      <ItemAvatar color={collaborator.color} />
      {cloneWithWidth(
        <StyledCollaboratorDataContainer>
          <Typography.Text strong ellipsis>
            {collaborator.name}
          </Typography.Text>
          <Typography.Text>{collaborator.email}</Typography.Text>
        </StyledCollaboratorDataContainer>,
        { marginLeft: 16 }
      )}
    </StyledFlexContainer>
  );
};

export default CollaboratorThumbnail;

const StyledCollaboratorDataContainer = styled.div(props => {
  return {
    flex: 1,
    marginLeft: 16,
    display: "flex",
    flexDirection: "column"
  };
});

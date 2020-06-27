import { Typography } from "antd";
import React from "react";
import { IUser } from "../../models/user/user";
import ItemAvatar from "../ItemAvatar";
import cloneWithWidth from "../styled/cloneWithWidth";
import StyledContainer from "../styled/Container";

export interface ICollaboratorThumbnailProps {
  collaborator: IUser;
  style?: React.CSSProperties;
  className?: string;
  onClick?: () => void;
}

const CollaboratorThumbnail: React.SFC<ICollaboratorThumbnailProps> = (
  props
) => {
  const { collaborator, style, onClick, className } = props;

  return (
    <StyledContainer
      s={{ width: "100%" }}
      style={style}
      onClick={onClick}
      className={className}
    >
      <ItemAvatar color={collaborator.color} />
      {cloneWithWidth(
        <StyledContainer
          s={{
            flex: 1,
            marginLeft: 16,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography.Text strong ellipsis>
            {collaborator.name}
          </Typography.Text>
          <Typography.Text>{collaborator.email}</Typography.Text>
        </StyledContainer>,
        { marginLeft: 16 }
      )}
    </StyledContainer>
  );
};

export default CollaboratorThumbnail;

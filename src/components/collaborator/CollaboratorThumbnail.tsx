import { Space, Typography } from "antd";
import React from "react";
import { ICollaborator } from "../../models/collaborator/types";
import { getUserFullName } from "../../models/user/utils";
import NamedAvatar from "../utils/NamedAvatar";
import ThumbnailContent, { IThumbnailContentProps } from "../utils/thumbnail/ThumbnailContent";

export interface ICollaboratorThumbnailProps
  extends Pick<
    IThumbnailContentProps,
    | "menu"
    | "onSelect"
    | "style"
    | "className"
    | "withCheckbox"
    | "selected"
    | "selectable"
    | "onClick"
    | "disabled"
  > {
  collaborator: ICollaborator;
}

const CollaboratorThumbnail: React.FC<ICollaboratorThumbnailProps> = (props) => {
  const { collaborator } = props;
  const fullName = getUserFullName(collaborator);
  return (
    <ThumbnailContent
      {...props}
      prefixNode={<NamedAvatar item={{ ...collaborator, name: fullName }} />}
      main={
        <Space direction="vertical" size={0}>
          <Typography.Text ellipsis>{fullName}</Typography.Text>
          <Typography.Text ellipsis type="secondary">
            {collaborator.email}
          </Typography.Text>
        </Space>
      }
    />
  );
};

export default CollaboratorThumbnail;

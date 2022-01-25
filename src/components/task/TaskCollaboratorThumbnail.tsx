import { css } from "@emotion/css";
import { Button, Typography } from "antd";
import React from "react";
import { Trash2 } from "react-feather";
import { SizeMe } from "react-sizeme";
import { ICollaborator } from "../../models/collaborator/types";
import UserAvatar from "../collaborator/UserAvatar";

export interface ITaskCollaboratorThumbnailProps {
  collaborator: ICollaborator;
  onUnassign: () => void;
  disabled?: boolean;
}

const classes = {
  root: css({
    width: "100%",
  }),
  nameContainer: css({
    flex: 1,
    marginLeft: 16,
    marginRight: 16,
    display: "flex",
    alignItems: "center",
  }),
  buttonContainer: css({
    alignItems: "center",
  }),
};

const TaskCollaboratorThumbnail: React.FC<ITaskCollaboratorThumbnailProps> = (
  props
) => {
  const { collaborator, disabled, onUnassign } = props;
  return (
    <div className={classes.root}>
      <UserAvatar user={collaborator} />
      <SizeMe>
        {({ size }) => (
          <div className={classes.nameContainer}>
            <Typography.Text ellipsis>{collaborator.name}</Typography.Text>
          </div>
        )}
      </SizeMe>
      <div className={classes.buttonContainer}>
        <Button
          disabled={disabled}
          icon={<Trash2 />}
          onClick={onUnassign}
          htmlType="button"
          className="icon-btn"
        />
      </div>
    </div>
  );
};

export default TaskCollaboratorThumbnail;

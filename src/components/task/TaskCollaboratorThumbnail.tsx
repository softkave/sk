import { css } from "@emotion/css";
import { Button, Typography } from "antd";
import React from "react";
import { Trash2 } from "react-feather";
import { SizeMe } from "react-sizeme";
import { ICollaborator } from "../../models/collaborator/types";
import { getUserFullName } from "../../models/user/utils";
import NamedAvatar from "../utils/NamedAvatar";

export interface ITaskCollaboratorThumbnailProps {
  collaborator: ICollaborator;
  onUnassign: () => void;
  disabled?: boolean;
}

const classes = {
  root: css({
    width: "100%",
    display: "flex",
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

const TaskCollaboratorThumbnail: React.FC<ITaskCollaboratorThumbnailProps> = (props) => {
  const { collaborator, disabled, onUnassign } = props;
  return (
    <div className={classes.root}>
      <NamedAvatar item={{ ...collaborator, name: getUserFullName(collaborator) }} />
      <SizeMe>
        {({ size }) => (
          <div className={classes.nameContainer}>
            <Typography.Text ellipsis>{getUserFullName(collaborator)}</Typography.Text>
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

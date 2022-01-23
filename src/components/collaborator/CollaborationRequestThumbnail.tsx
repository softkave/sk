import { cx, css } from "@emotion/css";
import { Typography } from "antd";
import React from "react";
import { ICollaborationRequest } from "../../models/collaborationRequest/types";
import cloneWithWidth from "../styled/cloneWithWidth";
import CollaborationRequestStatus from "./CollaborationRequestStatus";

export interface ICollaborationRequestThumbnailProps {
  request: ICollaborationRequest;
  onClick: (request: ICollaborationRequest) => void;
  style?: React.CSSProperties;
  className?: string;
}

const classes = {
  content: css({
    flex: 1,
    display: "flex",
    flexDirection: "column",
  }),
  root: css({ width: "100%" }),
  statusContainer: css({
    marginTop: "4px",
  }),
};

const CollaborationRequestThumbnail: React.FC<
  ICollaborationRequestThumbnailProps
> = (props) => {
  const { request, style, onClick, className } = props;
  const internalOnClick = React.useCallback(
    () => onClick(request),
    [request, onClick]
  );

  return (
    <div
      style={style}
      onClick={internalOnClick}
      className={cx(className, classes.root)}
    >
      {cloneWithWidth(
        <div className={classes.content}>
          <Typography.Text ellipsis>{request.to.email}</Typography.Text>
          <div className={classes.statusContainer}>
            <CollaborationRequestStatus request={request} />
          </div>
        </div>,
        { marginLeft: 16 }
      )}
    </div>
  );
};

export default React.memo(CollaborationRequestThumbnail);

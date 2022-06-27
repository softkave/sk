import { css, cx } from "@emotion/css";
import { Typography } from "antd";
import React from "react";
import { ICollaborationRequest } from "../../models/collaborationRequest/types";
import CollaborationRequestStatus from "./CollaborationRequestStatus";

export interface ICollaborationRequestThumbnailProps {
  request: ICollaborationRequest;
  onClick: (request: ICollaborationRequest) => void;
  style?: React.CSSProperties;
  className?: string;
  isSelected?: boolean;
}

const classes = {
  root: css({
    width: "100%",
    flex: 1,
    display: "flex",
    flexDirection: "column",
  }),
  statusContainer: css({
    marginTop: "4px",
  }),
};

const CollaborationRequestThumbnail: React.FC<
  ICollaborationRequestThumbnailProps
> = (props) => {
  const { request, style, className, isSelected, onClick } = props;
  const internalOnClick = React.useCallback(
    () => onClick(request),
    [request, onClick]
  );

  return (
    <div
      style={style}
      onClick={internalOnClick}
      className={cx(
        className,
        classes.root,
        css({ backgroundColor: isSelected ? "#e6f7ff" : undefined })
      )}
    >
      <Typography.Text strong ellipsis>
        {request.to.email}
      </Typography.Text>
      <div className={classes.statusContainer}>
        <CollaborationRequestStatus request={request} />
      </div>
    </div>
  );
};

export default React.memo(CollaborationRequestThumbnail);

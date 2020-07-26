import React from "react";
import { withSize } from "react-sizeme";

// intended for use only in LayoutContainer
const LayoutContainerInlineElements: React.FC<{}> = (props) => {
  const { children } = props;

  return <div>{children}</div>;
};

export default withSize({ monitorHeight: true })(
  React.memo(LayoutContainerInlineElements)
);

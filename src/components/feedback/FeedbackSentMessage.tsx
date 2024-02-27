import { Empty } from "antd";
import React from "react";

import withDrawer, { WithDrawerType } from "../withDrawer";

const FeedbackSentMessage: React.FC<{}> = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Empty description="Feedback sent successfully" />
    </div>
  );
};

export default withDrawer(FeedbackSentMessage, {
  type: WithDrawerType.Modal,
  okText: "New Feedback",
  cancelText: "Close",
  cancelButtonProps: {
    danger: true,
  },
});

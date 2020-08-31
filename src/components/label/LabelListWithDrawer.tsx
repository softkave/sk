import { Typography } from "antd";
import React from "react";
import withDrawer from "../withDrawer";
import LabelListContainer from "./LabelListContainer";

export default React.memo(
  withDrawer(
    LabelListContainer,
    <Typography.Title level={4}>Labels</Typography.Title>
  )
);

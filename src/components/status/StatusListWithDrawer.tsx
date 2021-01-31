import { Typography } from "antd";
import React from "react";
import withDrawer from "../withDrawer";
import StatusListContainer from "./StatusListContainer";

export default withDrawer(
    StatusListContainer,
    <Typography.Title level={4}>Status List</Typography.Title>
);

import { Typography } from "antd";
import React from "react";
import withDrawer from "../withDrawer";
import LabelListContainer from "./PermissionGroupsContainer";

export default React.memo(
    withDrawer(
        LabelListContainer,
        <Typography.Title level={4}>Labels</Typography.Title>
    )
);

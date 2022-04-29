import { Badge, Space } from "antd";
import React from "react";

export interface IOrganizationSidebarTabTextProps {
  text: string;
  unseenChatsCount?: number;
}

const OrganizationSidebarTabText: React.FC<IOrganizationSidebarTabTextProps> = (
  props
) => {
  const { text, unseenChatsCount } = props;
  return (
    <Space>
      <span style={{ textTransform: "capitalize" }}>{text}</span>
      {unseenChatsCount ? <Badge count={unseenChatsCount}></Badge> : null}
    </Space>
  );
};

export default React.memo(OrganizationSidebarTabText);

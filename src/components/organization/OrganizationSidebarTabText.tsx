import { Badge, Space } from "antd";
import React from "react";

export interface IWorkspaceSidebarTabTextProps {
  text: string;
  unseenChatsCount?: number;
}

const OrganizationSidebarTabText: React.FC<IWorkspaceSidebarTabTextProps> = (props) => {
  const { text, unseenChatsCount } = props;
  return (
    <Space>
      <span style={{ textTransform: "capitalize" }}>{text}</span>
      {unseenChatsCount ? (
        <Badge count={unseenChatsCount} style={{ backgroundColor: "#1890ff" }}></Badge>
      ) : null}
    </Space>
  );
};

export default React.memo(OrganizationSidebarTabText);

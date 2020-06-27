import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Empty, Space } from "antd";
import React from "react";
import { IBlock } from "../../models/block/block";
import NewBlockList from "../block/NewBlockList";
import LayoutMenuOrgsSectionHeader from "./LayoutMenuOrgsSectionHeader";

export interface ILayoutMenuOrgsSectionProps {
  orgs: IBlock[];
  onAddOrg: () => void;
  onSelectOrg: (org: IBlock) => void;

  isLoading?: boolean;
  errorMessage?: string;
}

const LayoutMenuOrgsSection: React.FC<ILayoutMenuOrgsSectionProps> = (
  props
) => {
  const { orgs, isLoading, errorMessage, onAddOrg, onSelectOrg } = props;
  const [searchQuery, setSearchQuery] = React.useState("");

  const filterOrgs = React.useCallback(() => {
    if (!searchQuery) {
      return orgs;
    }

    return orgs.filter((org) => org.name?.includes(searchQuery));
  }, [searchQuery, orgs]);

  const renderContent = React.useCallback(() => {
    if (isLoading) {
      return null;
    }

    if (errorMessage) {
      return (
        <Empty
          image={<ExclamationCircleOutlined />}
          description={errorMessage}
        ></Empty>
      );
    }

    if (orgs.length === 0) {
      return <Empty description="No Orgs"></Empty>;
    }

    return <NewBlockList blocks={filterOrgs()} onClick={onSelectOrg} />;
  }, [isLoading, errorMessage, orgs, filterOrgs, onSelectOrg]);

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <LayoutMenuOrgsSectionHeader
        onAddOrg={onAddOrg}
        onChangeSearchInput={(value) => setSearchQuery(value)}
        disableSearch={orgs.length === 0}
        isLoading={isLoading}
      />
      {renderContent()}
    </Space>
  );
};

export default React.memo(LayoutMenuOrgsSection);

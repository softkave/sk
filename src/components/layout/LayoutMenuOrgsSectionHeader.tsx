import { LoadingOutlined } from "@ant-design/icons";
import { Space, Typography } from "antd";
import { Input } from "antd";
import React from "react";
import { Plus, Search, X } from "react-feather";
import StyledContainer from "../styled/Container";

// export interface ILayoutHeaderContent {
//   node: React.ReactNode;
//   type?: "icon";
//   flex?: number;
//   showIfLoading?: boolean;
//   disabled?: boolean;
// }

export interface ILayoutMenuOrgsSectionHeaderProps {
  // content: ILayoutHeaderContent[];
  onChangeSearchInput: (value: string) => void;
  onAddOrg: () => void;

  isLoading?: boolean;
  disableSearch?: boolean;
}

const LayoutMenuOrgsSectionHeader: React.FC<ILayoutMenuOrgsSectionHeaderProps> = (
  props
) => {
  const { isLoading, disableSearch, onChangeSearchInput, onAddOrg } = props;
  const [showSearchBar, setShowSearchBar] = React.useState(false);

  const toggleSearchBar = React.useCallback(
    () => setShowSearchBar(!showSearchBar),
    [showSearchBar]
  );

  return (
    <StyledContainer
      s={{ padding: "0 16px", flexDirection: "column", width: "100%" }}
    >
      <StyledContainer s={{ paddingBottom: "8px" }}>
        <Typography.Text strong style={{ flex: 1, marginRight: "8px" }}>
          Orgs
        </Typography.Text>
        <Plus
          onClick={onAddOrg}
          style={{ width: "18px", height: "18px", cursor: "pointer" }}
        />
      </StyledContainer>
      <StyledContainer s={{ flex: 1, alignItems: "center" }}>
        <Input
          allowClear
          placeholder="Search orgs..."
          prefix={
            <Search style={{ width: "16px", height: "16px", color: "#999" }} />
          }
          onChange={(evt) => onChangeSearchInput(evt.target.value)}
        />
      </StyledContainer>
    </StyledContainer>
  );
};

export default React.memo(LayoutMenuOrgsSectionHeader);

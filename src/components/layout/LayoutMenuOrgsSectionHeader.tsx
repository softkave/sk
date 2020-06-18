import { LoadingOutlined } from "@ant-design/icons";
import { Space, Typography } from "antd";
import { Input } from "antd";
import React from "react";
import { Plus, Search, X } from "react-feather";
import StyledContainer from "../styled/Container";

export interface ILayoutMenuOrgsSectionHeaderProps {
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
    <StyledContainer s={{ padding: "0 16px" }}>
      {!showSearchBar && (
        <StyledContainer s={{ width: "100%" }}>
          <Typography.Text strong>Orgs</Typography.Text>
          <StyledContainer
            s={{
              flex: 1,
              justifyContent: "flex-end",
              marginLeft: "8px",
              cursor: "pointer",
            }}
          >
            {isLoading && <LoadingOutlined />}
            {!isLoading && (
              <Space>
                <StyledContainer>
                  <Search
                    onClick={disableSearch ? undefined : toggleSearchBar}
                    style={{
                      width: "16px",
                      height: "16px",
                      cursor: disableSearch ? "not-allowed" : "pointer",
                      color: disableSearch ? "#999" : undefined,
                    }}
                  />
                </StyledContainer>
                <StyledContainer>
                  <Plus
                    onClick={onAddOrg}
                    style={{ width: "16px", height: "16px", cursor: "pointer" }}
                  />
                </StyledContainer>
              </Space>
            )}
          </StyledContainer>
        </StyledContainer>
      )}
      {showSearchBar && (
        <StyledContainer s={{ width: "100%" }}>
          <StyledContainer s={{ flex: 1, marginRight: "8px" }}>
            <Input
              autoFocus
              allowClear
              size="small"
              placeholder="Search orgs..."
              suffix={
                <Search
                  style={{ width: "16px", height: "16px", color: "#999" }}
                />
              }
              onChange={(evt) => onChangeSearchInput(evt.target.value)}
            />
          </StyledContainer>
          <StyledContainer s={{ alignItems: "center" }}>
            <X
              onClick={toggleSearchBar}
              style={{ width: "16px", height: "16px", cursor: "pointer" }}
            />
          </StyledContainer>
        </StyledContainer>
      )}
    </StyledContainer>
  );
};

export default React.memo(LayoutMenuOrgsSectionHeader);

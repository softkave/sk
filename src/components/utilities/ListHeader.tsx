import { css } from "@emotion/css";
import { Button, Input, Space, Typography } from "antd";
import React from "react";
import { Plus, Search, X as CloseIcon } from "react-feather";

import InputSearchIcon from "./InputSearchIcon";

export interface IListHeaderProps {
  onClickCreate: () => void;
  onSearchTextChange: (text: string) => void;
  title: string;
  hideAddButton?: boolean;
  hideSearch?: boolean;
  searchPlaceholder?: string;
  style?: React.CSSProperties;
  className?: string;
}

const ListHeader: React.FC<IListHeaderProps> = (props) => {
  const {
    onSearchTextChange,
    onClickCreate,
    style,
    searchPlaceholder,
    hideAddButton,
    hideSearch,
    title,
  } = props;

  const [inSearchMode, setSearchMode] = React.useState(false);

  const toggleSearchMode = React.useCallback(
    () => setSearchMode(!inSearchMode),
    [inSearchMode]
  );

  const closeSearchMode = React.useCallback(() => {
    toggleSearchMode();
    onSearchTextChange("");
  }, [toggleSearchMode, onSearchTextChange]);

  const renderSearchMode = () => {
    return (
      <div
        className={css({
          justifyContent: "flex-end",
          flex: 1,
          "& .ant-space-item:first-of-type": { flex: 1 },
        })}
      >
        <Space style={{ width: "100%" }}>
          <Input
            allowClear
            placeholder={searchPlaceholder || "Search"}
            prefix={<InputSearchIcon />}
            onChange={(evt) => onSearchTextChange(evt.target.value)}
          />
          <Button onClick={closeSearchMode} className="icon-btn">
            <CloseIcon />
          </Button>
        </Space>
      </div>
    );
  };

  const renderControls = () => {
    return (
      <div
        style={{
          justifyContent: "flex-end",
          flex: 1,
          alignItems: "center",
        }}
      >
        <Typography.Text
          style={{
            display: "flex",
            flex: 1,
            textTransform: "uppercase",
          }}
        >
          {title}
        </Typography.Text>
        <Space>
          {!hideAddButton && (
            <Button onClick={onClickCreate} className="icon-btn">
              <Plus />
            </Button>
          )}
          {!hideSearch && (
            <Button onClick={toggleSearchMode} className="icon-btn">
              <Search />
            </Button>
          )}
        </Space>
      </div>
    );
  };

  return (
    <div style={{ padding: "0 16px", ...style }}>
      {!inSearchMode && renderControls()}
      {inSearchMode && renderSearchMode()}
    </div>
  );
};

ListHeader.defaultProps = { style: {} };

export default React.memo(ListHeader);

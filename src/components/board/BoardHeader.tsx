import MenuFoldOutlined from "@ant-design/icons/MenuFoldOutlined";
import MenuUnfoldOutlined from "@ant-design/icons/MenuUnfoldOutlined";
import { css } from "@emotion/css";
import { Button, Space, Typography } from "antd";
import React from "react";
import { ArrowLeft, Plus, Search } from "react-feather";
import { useHistory } from "react-router";
import { IBoard } from "../../models/board/types";

import { layoutOptions } from "../utilities/layout";
import BoardHeaderOptionsMenu, {
  BoardCurrentView,
  BoardGroupBy,
  BoardHeaderSettingsMenuKey,
} from "./BoardHeaderOptionsMenu";
import SearchTasksInput from "./SearchTasksInput";

export interface IBoardHeaderProps {
  block: IBoard;
  isMobile: boolean;
  isAppMenuFolded: boolean;
  view: BoardCurrentView;
  groupBy: BoardGroupBy;
  isSearchMode: boolean;
  onChangeSearchText: (text: string) => void;
  onToggleFoldAppMenu: () => void;
  onSelectMenuKey: (key: BoardHeaderSettingsMenuKey) => void;
  onSelectCurrentView: (key: BoardCurrentView) => void;
  onSelectGroupBy: (key: BoardGroupBy) => void;
  style?: React.CSSProperties;
}

const BoardHeader: React.FC<IBoardHeaderProps> = (props) => {
  const {
    block,
    isMobile,
    style,
    isSearchMode,
    onSelectMenuKey,
    onChangeSearchText,
    isAppMenuFolded: isMenuFolded,
    onToggleFoldAppMenu: onToggleFoldMenu,
  } = props;

  const history = useHistory();
  const [showSearch, setShowSearch] = React.useState(isSearchMode);

  const closeSearch = React.useCallback(() => {
    setShowSearch(false);
    onChangeSearchText("");
  }, [onChangeSearchText]);

  const onSelectSettingsMenuItem = (key: BoardHeaderSettingsMenuKey) => {
    switch (key) {
      case BoardHeaderSettingsMenuKey.SEARCH_TASKS:
        setShowSearch(true);
        break;

      default:
        onSelectMenuKey(key as BoardHeaderSettingsMenuKey);
        break;
    }
  };

  const onBack = React.useCallback(() => {
    history.push(`/app/orgs/${block.rootBlockId}/boards`);
  }, [block, history]);

  const renderBackButton = () => {
    if (isMobile) {
      return (
        <div style={{ marginRight: "16px" }}>
          <Button
            style={{ cursor: "pointer" }}
            onClick={onBack}
            className="icon-btn"
          >
            <ArrowLeft />
          </Button>
        </div>
      );
    } else {
      return (
        <div
          className={css({ marginRight: "16px", cursor: "pointer" })}
          onClick={onToggleFoldMenu}
        >
          {isMenuFolded ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </div>
      );
    }
  };

  let content: React.ReactNode = null;

  if (showSearch) {
    content = <SearchTasksInput {...props} onCancel={closeSearch} />;
  } else {
    let desktopContent: React.ReactNode = null;

    if (!isMobile) {
      desktopContent = [
        <Button
          key={BoardHeaderSettingsMenuKey.ADD_TASK}
          onClick={() => onSelectMenuKey(BoardHeaderSettingsMenuKey.ADD_TASK)}
          className="icon-btn"
        >
          <Plus />
        </Button>,
        <Button
          key="sch"
          onClick={() => setShowSearch(true)}
          className="icon-btn"
        >
          <Search />
        </Button>,
      ];
    }

    const options = (
      <BoardHeaderOptionsMenu
        {...props}
        onSelectMenuKey={onSelectSettingsMenuItem}
      />
    );

    content = (
      <React.Fragment>
        {renderBackButton()}
        <Typography.Title
          level={5}
          style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            marginBottom: 0,
            textTransform: "capitalize",
          }}
        >
          {block.name}
        </Typography.Title>
        <div style={{ alignItems: "center" }}>
          {desktopContent ? (
            <Space>
              {desktopContent}
              {options}
            </Space>
          ) : (
            options
          )}
        </div>
      </React.Fragment>
    );
  }

  return (
    <div
      style={{
        ...style,
        width: "100%",
        alignItems: "center",
        padding: "16px",
        height: layoutOptions.HEADER_HEIGHT,
        borderBottom: "1px solid rgb(223, 234, 240)",
      }}
    >
      {content}
    </div>
  );
};

export default BoardHeader;

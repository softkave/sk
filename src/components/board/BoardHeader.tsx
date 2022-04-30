import MenuFoldOutlined from "@ant-design/icons/MenuFoldOutlined";
import MenuUnfoldOutlined from "@ant-design/icons/MenuUnfoldOutlined";
import { css, cx } from "@emotion/css";
import { Button, Space, Typography } from "antd";
import React from "react";
import { ArrowLeft, Plus, Search } from "react-feather";
import { useHistory } from "react-router";
import { IBoard } from "../../models/board/types";
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
  className?: string;
}

const classes = {
  root: css({
    display: "grid",
    gridTemplateColumns: "auto 1fr auto",
    columnGap: "16px",
    width: "100%",
    padding: "8px 16px",
    borderBottom: "2px solid rgb(223, 234, 240)",
    height: "56px",
    overflow: "hidden",
    alignContent: "center",
  }),
  back: css({
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
  }),
};

const BoardHeader: React.FC<IBoardHeaderProps> = (props) => {
  const {
    block,
    isMobile,
    style,
    className,
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
        <div className={classes.back}>
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
        <div className={classes.back} onClick={onToggleFoldMenu}>
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
          ellipsis
          level={5}
          style={{
            marginBottom: 0,
            textTransform: "capitalize",
            overflow: "hidden",
            lineHeight: "30px",
          }}
        >
          {block.name}
        </Typography.Title>
        <div>
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
    <div style={style} className={cx(classes.root, className)}>
      {content}
    </div>
  );
};

export default BoardHeader;

import { EditOutlined } from "@ant-design/icons";
import MenuFoldOutlined from "@ant-design/icons/MenuFoldOutlined";
import MenuUnfoldOutlined from "@ant-design/icons/MenuUnfoldOutlined";
import { css, cx } from "@emotion/css";
import { Button, Space, Typography } from "antd";
import { ItemType } from "antd/es/menu/hooks/useItems";
import React from "react";
import { ArrowLeft, Search } from "react-feather";
import { FiPlus } from "react-icons/fi";
import { useHistory } from "react-router";
import { IBoard } from "../../models/board/types";
import { hasSetupSprints } from "../../models/board/utils";
import { appClassNames } from "../classNames";
import CustomIcon from "../utils/buttons/CustomIcon";
import DropdownButton from "../utils/buttons/DropdownButton";
import IconButton from "../utils/buttons/IconButton";
import BoardHeaderOptionsMenu, {
  BoardCurrentView,
  BoardGroupBy,
  BoardHeaderSettingsMenuKey,
} from "./BoardHeaderOptionsMenu";
import SearchTasksInput from "./SearchTasksInput";

export interface IBoardHeaderProps {
  board: IBoard;
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
    board,
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
    history.push(`/app/orgs/${board.workspaceId}/boards`);
  }, [board, history]);

  // TODO: auth checks
  const canCreateTask = true;
  const canUpdateBoard = true;
  const canCreateSprint = true;

  const renderBackButton = () => {
    if (isMobile) {
      return (
        <div className={classes.back}>
          <Button style={{ cursor: "pointer" }} onClick={onBack} className="icon-btn">
            <ArrowLeft />
          </Button>
        </div>
      );
    } else {
      return (
        <IconButton
          className={classes.back}
          onClick={onToggleFoldMenu}
          icon={isMenuFolded ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        />
      );
    }
  };

  let content: React.ReactNode = null;
  if (showSearch) {
    content = <SearchTasksInput {...props} onCancel={closeSearch} />;
  } else {
    let desktopContent: React.ReactNode = null;
    if (!isMobile) {
      const menuItems: ItemType[] = [];
      if (canCreateTask) {
        menuItems.push({
          label: "Add Task",
          key: BoardHeaderSettingsMenuKey.ADD_TASK,
          icon: <CustomIcon icon={<FiPlus />} />,
        });
      }

      if (hasSetupSprints(board)) {
        if (canCreateSprint) {
          menuItems.push({
            label: "Add Sprint",
            key: BoardHeaderSettingsMenuKey.ADD_SPRINT,
            icon: <CustomIcon icon={<FiPlus />} />,
          });
        }
      } else if (canUpdateBoard) {
        menuItems.push({
          label: "Setup Sprints",
          key: BoardHeaderSettingsMenuKey.SETUP_SPRINTS,
          icon: <CustomIcon icon={<FiPlus />} />,
        });
      }

      if (canUpdateBoard) {
        menuItems.push(
          {
            label: "Edit Status",
            key: BoardHeaderSettingsMenuKey.EDIT_STATUS,
            icon: <CustomIcon icon={<EditOutlined />} />,
          },
          {
            label: "Edit Labels",
            key: BoardHeaderSettingsMenuKey.EDIT_LABELS,
            icon: <CustomIcon icon={<EditOutlined />} />,
          },
          {
            label: "Edit Resolutions",
            key: BoardHeaderSettingsMenuKey.EDIT_RESOLUTIONS,
            icon: <CustomIcon icon={<EditOutlined />} />,
          }
        );
      }

      const addBtnNode =
        menuItems.length > 0 ? (
          <DropdownButton
            key="add-btn"
            menu={{
              items: menuItems,
              onClick: (e) => onSelectMenuKey(e.key as BoardHeaderSettingsMenuKey),
            }}
            trigger={["click"]}
          >
            <IconButton
              icon={<CustomIcon icon={<FiPlus />} />}
              title="Add Task"
              onClick={() => onSelectMenuKey(BoardHeaderSettingsMenuKey.ADD_TASK)}
            />
          </DropdownButton>
        ) : null;

      desktopContent = [
        addBtnNode,
        <Button key="sch" onClick={() => setShowSearch(true)} className="icon-btn">
          <Search />
        </Button>,
      ];
    }

    const optionsNode = (
      <BoardHeaderOptionsMenu {...props} onSelectMenuKey={onSelectSettingsMenuItem} />
    );

    content = (
      <React.Fragment>
        <div className={cx(appClassNames.flex, appClassNames.alignCenter)}>
          {renderBackButton()}
        </div>
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
          {board.name}
        </Typography.Title>
        <div className={cx(appClassNames.flex, appClassNames.alignCenter)}>
          {desktopContent ? (
            <Space>
              {desktopContent}
              {optionsNode}
            </Space>
          ) : (
            optionsNode
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

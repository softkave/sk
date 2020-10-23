import { Checkbox, Menu, Space } from "antd";
import React from "react";
import { Edit3, MoreHorizontal, Plus, Search, Trash2 } from "react-feather";
import { IBlock } from "../../models/block/block";
import StyledContainer from "../styled/Container";
import MenuWithTrigger, {
    IMenuWithTriggerRenderMenuProps,
    IMenuWithTriggerRenderTriggerProps,
} from "./MenuWithTrigger";

export enum BoardHeaderSettingsMenuKey {
    EDIT = "edit",
    DELETE = "delete",
    EDIT_STATUS = "edit-status",
    EDIT_LABELS = "edit-labels",
    EDIT_RESOLUTIONS = "edit-resolutions",
    ADD_TASK = "add-task",
    SEARCH_TASKS = "search-tasks",
    SETUP_SPRINTS = "setup-sprints",
    ADD_SPRINT = "add-sprint",
}

export enum BoardCurrentView {
    CURRENT_SPRINT = "current-sprint",
    ALL_TASKS = "all-tasks",
    SPRINTS = "sprints",
}

export enum BoardGroupBy {
    STATUS = "status",
    LABELS = "labels",
    ASSIGNEES = "assignees",
    SPRINT = "sprint",
}

export interface IBoardHeaderOptionsMenuProps {
    block: IBlock;
    view: BoardCurrentView;
    groupBy: BoardGroupBy;
    onSelectMenuKey: (key: BoardHeaderSettingsMenuKey) => void;
    onSelectCurrentView: (key: BoardCurrentView) => void;
    onSelectGroupBy: (key: BoardGroupBy) => void;
}

const BoardHeaderOptionsMenu: React.FC<IBoardHeaderOptionsMenuProps> = (
    props
) => {
    const {
        block,
        view,
        groupBy,
        onSelectMenuKey,
        onSelectCurrentView,
        onSelectGroupBy,
    } = props;

    const renderTrigger = React.useCallback(
        (renderTriggerProps: IMenuWithTriggerRenderTriggerProps) => {
            return (
                <StyledContainer
                    s={{
                        cursor: "pointer",
                        textTransform: "capitalize",
                    }}
                    onClick={renderTriggerProps.openMenu}
                >
                    <MoreHorizontal />
                </StyledContainer>
            );
        },
        []
    );

    const internalOnSelect = (
        key: BoardHeaderSettingsMenuKey | BoardCurrentView | BoardGroupBy
    ) => {
        switch (key) {
            case BoardHeaderSettingsMenuKey.EDIT:
            case BoardHeaderSettingsMenuKey.DELETE:
            case BoardHeaderSettingsMenuKey.EDIT_STATUS:
            case BoardHeaderSettingsMenuKey.EDIT_LABELS:
            case BoardHeaderSettingsMenuKey.EDIT_RESOLUTIONS:
            case BoardHeaderSettingsMenuKey.ADD_TASK:
            case BoardHeaderSettingsMenuKey.SEARCH_TASKS:
            case BoardHeaderSettingsMenuKey.SETUP_SPRINTS:
            case BoardHeaderSettingsMenuKey.ADD_SPRINT:
                onSelectMenuKey(key as BoardHeaderSettingsMenuKey);
                break;

            case BoardCurrentView.CURRENT_SPRINT:
            case BoardCurrentView.ALL_TASKS:
            case BoardCurrentView.SPRINTS:
                onSelectCurrentView(key as BoardCurrentView);
                break;

            case BoardGroupBy.STATUS:
            case BoardGroupBy.LABELS:
            case BoardGroupBy.ASSIGNEES:
                onSelectGroupBy(key as BoardGroupBy);
                break;
        }
    };

    const boardHasSprintsSetup = !!block.sprintOptions;

    const renderViewMenuItems = () => (
        <React.Fragment>
            <Menu.Item key={BoardCurrentView.CURRENT_SPRINT}>
                <Space align="center" size={12}>
                    <Checkbox
                        checked={view === BoardCurrentView.CURRENT_SPRINT}
                    />
                    Current Sprint
                </Space>
            </Menu.Item>
            <Menu.Item key={BoardCurrentView.ALL_TASKS}>
                <Space align="center" size={12}>
                    <Checkbox checked={view === BoardCurrentView.ALL_TASKS} />
                    All Tasks
                </Space>
            </Menu.Item>
            {boardHasSprintsSetup && (
                <Menu.Item key={BoardCurrentView.SPRINTS}>
                    <Space align="center" size={12}>
                        <Checkbox checked={view === BoardCurrentView.SPRINTS} />
                        Sprints
                    </Space>
                </Menu.Item>
            )}
            {!boardHasSprintsSetup && (
                <React.Fragment>
                    <Menu.Divider />
                    <Menu.Item key={BoardHeaderSettingsMenuKey.SETUP_SPRINTS}>
                        <Space align="center" size={12}>
                            <Plus style={plusIconStyles} />
                            Setup Sprints
                        </Space>
                    </Menu.Item>
                </React.Fragment>
            )}
        </React.Fragment>
    );

    const renderGroupByMenuItems = () => {
        if (
            view !== BoardCurrentView.CURRENT_SPRINT &&
            view !== BoardCurrentView.ALL_TASKS
        ) {
            return null;
        }

        return (
            <React.Fragment>
                <Menu.Divider />
                <Menu.Item key={BoardGroupBy.STATUS}>
                    <Space align="center" size={12}>
                        <Checkbox checked={groupBy === BoardGroupBy.STATUS} />
                        Status
                    </Space>
                </Menu.Item>
                <Menu.Item key={BoardGroupBy.LABELS}>
                    <Space align="center" size={12}>
                        <Checkbox checked={groupBy === BoardGroupBy.LABELS} />
                        Labels
                    </Space>
                </Menu.Item>
                <Menu.Item key={BoardGroupBy.ASSIGNEES}>
                    <Space align="center" size={12}>
                        <Checkbox
                            checked={groupBy === BoardGroupBy.ASSIGNEES}
                        />
                        Assignees
                    </Space>
                </Menu.Item>
            </React.Fragment>
        );
    };

    const renderTaskMenuItems = () => (
        <React.Fragment>
            <Menu.Divider />
            <Menu.Item key={BoardHeaderSettingsMenuKey.ADD_TASK}>
                <Space align="center" size={12}>
                    <Plus style={plusIconStyles} />
                    Add Task
                </Space>
            </Menu.Item>
            <Menu.Item key={BoardHeaderSettingsMenuKey.SEARCH_TASKS}>
                <Space align="center" size={12}>
                    <Search style={plusIconStyles} />
                    Search Tasks
                </Space>
            </Menu.Item>
        </React.Fragment>
    );

    const renderBoardResourceMenuItems = () => (
        <React.Fragment>
            <Menu.Divider />
            {boardHasSprintsSetup && (
                <Menu.Item key={BoardHeaderSettingsMenuKey.ADD_SPRINT}>
                    <Space align="center" size={12}>
                        <Plus style={plusIconStyles} />
                        Sprint
                    </Space>
                </Menu.Item>
            )}
            <Menu.Item key={BoardHeaderSettingsMenuKey.EDIT_STATUS}>
                <Space align="center" size={12}>
                    <Plus style={plusIconStyles} />
                    Status
                </Space>
            </Menu.Item>
            <Menu.Item key={BoardHeaderSettingsMenuKey.EDIT_RESOLUTIONS}>
                <Space align="center" size={12}>
                    <Plus style={plusIconStyles} />
                    Resolutions
                </Space>
            </Menu.Item>
            <Menu.Item key={BoardHeaderSettingsMenuKey.EDIT_LABELS}>
                <Space align="center" size={12}>
                    <Plus style={plusIconStyles} />
                    Labels
                </Space>
            </Menu.Item>
        </React.Fragment>
    );

    const renderBoardOwnMenuItems = () => (
        <React.Fragment>
            <Menu.Divider key="divider" />
            <Menu.Item
                style={{ textTransform: "capitalize" }}
                key={BoardHeaderSettingsMenuKey.EDIT}
            >
                <Space align="center" size={12}>
                    <Edit3
                        style={{
                            width: "14px",
                            height: "14px",
                            verticalAlign: "middle",
                            marginTop: "-3px",
                        }}
                    />
                    <span>Edit {block.type}</span>
                </Space>
            </Menu.Item>
            <Menu.Item
                style={{ textTransform: "capitalize" }}
                key={BoardHeaderSettingsMenuKey.DELETE}
            >
                <Space align="center" size={12}>
                    <Trash2
                        style={{
                            width: "14px",
                            height: "14px",
                            verticalAlign: "middle",
                            marginTop: "-4px",
                        }}
                    />
                    <span>Delete {block.type}</span>
                </Space>
            </Menu.Item>
        </React.Fragment>
    );

    const renderBlockOptions = (
        renderMenuProps: IMenuWithTriggerRenderMenuProps
    ) => {
        return (
            <Menu
                onClick={(event) => {
                    internalOnSelect(event.key as any);
                    renderMenuProps.closeMenu();
                }}
            >
                {renderViewMenuItems()}
                {renderGroupByMenuItems()}
                {renderTaskMenuItems()}
                {renderBoardResourceMenuItems()}
                {renderBoardOwnMenuItems()}
            </Menu>
        );
    };

    return (
        <MenuWithTrigger
            menuType="dropdown"
            renderTrigger={renderTrigger}
            renderMenu={renderBlockOptions}
        />
    );
};

export default BoardHeaderOptionsMenu;

const plusIconStyles: React.CSSProperties = {
    width: "16px",
    height: "16px",
    verticalAlign: "middle",
    marginTop: "-3px",
};

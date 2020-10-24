import { Button, Input, Space } from "antd";
import React from "react";
import { X as CloseIcon } from "react-feather";
import StyledContainer from "../styled/Container";
import InputSearchIcon from "../utilities/InputSearchIcon";

export enum SearchTasksMode {
    CURRENT_SPRINT = "current-sprint",
    ALL_TASKS = "all-tasks",
}

export interface ISearchTasksInputProps {
    searchIn: SearchTasksMode;
    isMobile: boolean;
    onChangeSearchText: (text: string) => void;
    onChangeSearchMode: (mode: SearchTasksMode) => void;
    onCancel: () => void;
}

// const SEARCH_TASKS_CURRENT_SPRINT = "Search in current sprint...";
const SEARCH_TASKS_IN_ALL_TASKS = "Search all tasks...";

// TODO: Implement selector for current sprint & all tasks
// TODO: Implement full blown filters

// const CURRENT_SPRINT_TEXT = "Current Sprint";
// const ALL_TASKS_TEXT = "All Tasks";

// // TODO: we need to find better icons
// const CURRENT_SPRINT_ICON = (
//     <Calendar style={{ width: "16px", height: "16px" }} />
// );
// const ALL_TASKS_ICON = <Server style={{ width: "16px", height: "16px" }} />;

const SearchTasksInput: React.FC<ISearchTasksInputProps> = (props) => {
    const {
        // searchIn,
        // isMobile,
        onCancel,
        onChangeSearchText,
        // onChangeSearchMode,
    } = props;

    // const searchInMenu = (
    //     <Menu
    //         selectedKeys={[searchIn]}
    //         onClick={(evt) => {
    //             onChangeSearchMode(evt.key as SearchTasksMode);
    //         }}
    //     >
    //         <Menu.Item key={SearchTasksMode.CURRENT_SPRINT}>
    //             {CURRENT_SPRINT_TEXT}
    //         </Menu.Item>
    //         <Menu.Item key={SearchTasksMode.ALL_TASKS}>
    //             {ALL_TASKS_TEXT}
    //         </Menu.Item>
    //     </Menu>
    // );

    // const icon =
    //     searchIn === SearchTasksMode.CURRENT_SPRINT
    //         ? CURRENT_SPRINT_ICON
    //         : ALL_TASKS_ICON;

    // const placeholder = isMobile ? (
    //     icon
    // ) : (
    //     <Space>
    //         {icon}
    //         <span>
    //             {searchIn === SearchTasksMode.CURRENT_SPRINT
    //                 ? CURRENT_SPRINT_TEXT
    //                 : ALL_TASKS_TEXT}
    //         </span>
    //         <ChevronDown />
    //     </Space>
    // );

    return (
        <StyledContainer s={{ justifyContent: "flex-end", flex: 1 }}>
            <Space>
                {/* <Dropdown trigger={["click"]} overlay={searchInMenu}>
                    <Button
                        className="icon-btn"
                        htmlType="button"
                        style={{ padding: "0 6px" }}
                    >
                        {placeholder}
                    </Button>
                </Dropdown> */}
                <Input
                    allowClear
                    // placeholder={
                    //     searchIn === SearchTasksMode.CURRENT_SPRINT
                    //         ? SEARCH_TASKS_CURRENT_SPRINT
                    //         : SEARCH_TASKS_IN_ALL_TASKS
                    // }
                    placeholder={SEARCH_TASKS_IN_ALL_TASKS}
                    prefix={<InputSearchIcon />}
                    onChange={(evt) => onChangeSearchText(evt.target.value)}
                />
                <Button onClick={onCancel} className="icon-btn">
                    <CloseIcon />
                </Button>
            </Space>
        </StyledContainer>
    );
};

export default SearchTasksInput;

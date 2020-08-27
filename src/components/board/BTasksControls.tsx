import { Button, Dropdown, Input, Menu, Space } from "antd";
import React from "react";
import { ChevronDown, Plus, Search, X as CloseIcon } from "react-feather";
import StyledContainer from "../styled/Container";
import InputSearchIcon from "../utilities/InputSearchIcon";
import { TaskGroup } from "./types";

export interface IBTasksControlsProps {
    selected: string;
    options: string[];
    setGroupType: (key: TaskGroup) => void;
    onClickCreate: () => void;
    onSearchTextChange: (text: string) => void;
}

const BTasksControls: React.FC<IBTasksControlsProps> = (props) => {
    const {
        options,
        selected,
        onSearchTextChange,
        setGroupType,
        onClickCreate,
    } = props;

    const [inSearchMode, setSearchMode] = React.useState(false);
    const toggleSearchMode = React.useCallback(
        () => setSearchMode(!inSearchMode),
        [inSearchMode]
    );

    const leaveSearchMode = React.useCallback(() => {
        toggleSearchMode();
        onSearchTextChange("");
    }, [toggleSearchMode]);

    const renderSelectorDropdown = () => {
        const menuOptions: React.ReactNode[] = [];

        options.forEach((option, i) => {
            menuOptions.push(<Menu.Item key={option}>{option}</Menu.Item>);

            if (i < options.length - 1) {
                menuOptions.push(<Menu.Divider />);
            }
        });

        return (
            <Menu
                activeKey={selected}
                onSelect={(e) => setGroupType(e.key as TaskGroup)}
            >
                {menuOptions}
            </Menu>
        );
    };

    const renderGroupSelector = () => {
        return (
            <StyledContainer
                s={{ flex: 1, marginRight: "8px", justifyContent: "flex-end" }}
            >
                <Dropdown
                    trigger={["click"]}
                    overlay={renderSelectorDropdown()}
                >
                    <Button className="icon-btn" style={{ padding: "0 6px" }}>
                        <Space>
                            <span>{selected}</span>
                            <ChevronDown />
                        </Space>
                    </Button>
                </Dropdown>
            </StyledContainer>
        );
    };

    const renderSearchMode = () => {
        return (
            <StyledContainer s={{ justifyContent: "flex-end", flex: 1 }}>
                <Space>
                    <Input
                        allowClear
                        placeholder="Search tasks..."
                        prefix={<InputSearchIcon />}
                        onChange={(evt) => onSearchTextChange(evt.target.value)}
                    />
                    <Button onClick={leaveSearchMode} className="icon-btn">
                        <CloseIcon />
                    </Button>
                </Space>
            </StyledContainer>
        );
    };

    const renderControls = () => {
        return (
            <Space>
                <Button onClick={onClickCreate} className="icon-btn">
                    <Plus />
                </Button>
                <Button onClick={toggleSearchMode} className="icon-btn">
                    <Search />
                </Button>
            </Space>
        );
    };

    return (
        <StyledContainer s={{ padding: "0 16px" }}>
            {!inSearchMode && renderGroupSelector()}
            {!inSearchMode && renderControls()}
            {inSearchMode && renderSearchMode()}
        </StyledContainer>
    );
};

export default React.memo(BTasksControls);

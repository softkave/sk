import { EditOutlined } from "@ant-design/icons";
import { Menu, Space } from "antd";
import React from "react";
import { MoreHorizontal } from "react-feather";
import { IBlock } from "../../models/block/block";
import StyledContainer from "../styled/Container";
import MenuWithTrigger, {
    IMenuWithTriggerRenderMenuProps,
    IMenuWithTriggerRenderTriggerProps,
} from "./MenuWithTrigger";

export enum OrgHeaderSettingsMenuKey {
    EDIT = "EDIT",
}

export interface IOrgHeaderOptionsMenuProps {
    block: IBlock;
    onSelect: (key: OrgHeaderSettingsMenuKey) => void;
}

const OrgHeaderOptionsMenu: React.FC<IOrgHeaderOptionsMenuProps> = (props) => {
    const { block, onSelect } = props;

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

    const renderBlockOptions = React.useCallback(
        (renderMenuProps: IMenuWithTriggerRenderMenuProps) => {
            return (
                <Menu
                    onClick={(event) => {
                        onSelect(event.key as OrgHeaderSettingsMenuKey);
                        renderMenuProps.closeMenu();
                    }}
                >
                    <Menu.Item
                        style={{ textTransform: "capitalize" }}
                        key={OrgHeaderSettingsMenuKey.EDIT}
                    >
                        <Space align="center" size={12}>
                            <EditOutlined />
                            <span>Edit {block.type}</span>
                        </Space>
                    </Menu.Item>
                </Menu>
            );
        },
        [block, onSelect]
    );

    return (
        <MenuWithTrigger
            menuType="dropdown"
            renderTrigger={renderTrigger}
            renderMenu={renderBlockOptions}
            // dropdownPlacement="bottomRight"
        />
    );
};

export default OrgHeaderOptionsMenu;

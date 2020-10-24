import { Menu, Space } from "antd";
import React from "react";
import { Edit3, MoreHorizontal } from "react-feather";
import { IBlock } from "../../models/block/block";
import StyledContainer from "../styled/Container";
import MenuWithTrigger, {
    IMenuWithTriggerRenderMenuProps,
    IMenuWithTriggerRenderTriggerProps,
} from "./MenuWithTrigger";

export type OrgHeaderSettingsMenuKey = "view";

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
            const extraOptions: React.ReactNode[] = [];

            return (
                <Menu
                    onClick={(event) => {
                        onSelect(event.key as OrgHeaderSettingsMenuKey);
                        renderMenuProps.closeMenu();
                    }}
                >
                    {extraOptions}
                    <Menu.Item
                        style={{ textTransform: "capitalize" }}
                        key="view"
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

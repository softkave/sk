import { Menu, Space } from "antd";
import React from "react";
import { Edit3, MoreHorizontal, Plus, Trash2 } from "react-feather";
import { BlockType, IBlock } from "../../models/block/block";
import { getBlockTypeFullName } from "../../models/block/utils";
import StyledContainer from "../styled/Container";
import MenuWithTrigger, {
    IMenuWithTriggerRenderMenuProps,
    IMenuWithTriggerRenderTriggerProps,
} from "./MenuWithTrigger";

export type SettingsMenuKey =
    | "view"
    | "delete"
    | "status"
    | "labels"
    | "resolutions";

export interface ISelectBlockOptionsMenuProps {
    block: IBlock;
    onSelect: (key: SettingsMenuKey) => void;
}

const SelectBlockOptionsMenu: React.FC<ISelectBlockOptionsMenuProps> = (
    props
) => {
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
            const blockTypeFullName = getBlockTypeFullName(block.type);
            const extraOptions: React.ReactNode[] = [];

            if (block.type === BlockType.Board) {
                extraOptions.push(
                    <Menu.Item key="status">
                        <Space align="center" size={12}>
                            <Plus
                                style={{
                                    width: "16px",
                                    height: "16px",
                                    verticalAlign: "middle",
                                    marginTop: "-3px",
                                }}
                            />
                            Status
                        </Space>
                    </Menu.Item>,
                    <Menu.Item key="resolutions">
                        <Space align="center" size={12}>
                            <Plus
                                style={{
                                    width: "16px",
                                    height: "16px",
                                    verticalAlign: "middle",
                                    marginTop: "-3px",
                                }}
                            />
                            Resolutions
                        </Space>
                    </Menu.Item>,
                    <Menu.Item key="labels">
                        <Space align="center" size={12}>
                            <Plus
                                style={{
                                    width: "16px",
                                    height: "16px",
                                    verticalAlign: "middle",
                                    marginTop: "-3px",
                                }}
                            />
                            Labels
                        </Space>
                    </Menu.Item>,
                    <Menu.Divider key="divider" />
                );
            }

            return (
                <Menu
                    onClick={(event) => {
                        onSelect(event.key as SettingsMenuKey);
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
                            <span>Edit {blockTypeFullName}</span>
                        </Space>
                    </Menu.Item>
                    {block.type !== BlockType.Org && (
                        <Menu.Item
                            style={{ textTransform: "capitalize" }}
                            key="delete"
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
                                <span>Delete {blockTypeFullName}</span>
                            </Space>
                        </Menu.Item>
                    )}
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
        />
    );
};

export default SelectBlockOptionsMenu;

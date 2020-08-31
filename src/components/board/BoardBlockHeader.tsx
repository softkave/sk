import MenuFoldOutlined from "@ant-design/icons/MenuFoldOutlined";
import MenuUnfoldOutlined from "@ant-design/icons/MenuUnfoldOutlined";
import { Button } from "antd";
import React from "react";
import { ArrowLeft } from "react-feather";
import { useHistory } from "react-router";
import { BlockType, IBlock } from "../../models/block/block";
import BlockThumbnail from "../block/BlockThumnail";
import StyledContainer from "../styled/Container";
import wrapWithMargin from "../utilities/wrapWithMargin";
import SelectBlockCreateNewOptionsMenu from "./SelectBlockCreateNewOptionsMenu";
import SelectBlockOptionsMenu, {
    SettingsMenuKey,
} from "./SelectBlockOptionsMenu";
import SelectBoardTypeMenu from "./SelectBoardTypeMenu";
import { BoardResourceType, BoardViewType, CreateMenuKey } from "./types";

const isBlockRelatedResourceType = (type?: BoardResourceType | null) => {
    switch (type) {
        case "boards":
        case "tasks":
            return true;

        case "collaborators":
        case "collaboration-requests":
        default:
            return false;
    }
};

export interface IBoardBlockHeaderProps {
    block: IBlock;
    isMobile: boolean;
    isAppMenuFolded: boolean;
    onClickCreateNewBlock: (type: BlockType) => void;
    onClickAddCollaborator: () => void;
    onClickAddOrEditLabel: () => void;
    onClickAddOrEditStatus: () => void;
    onClickEditBlock: () => void;
    onClickDeleteBlock: () => void;
    onNavigate: (
        resourceType: BoardResourceType | null,
        boardType: BoardViewType | null
    ) => void;
    onToggleFoldAppMenu: () => void;

    selectedBoardType?: BoardViewType;
    noExtraCreateMenuItems?: boolean;
    resourceType?: BoardResourceType | null;
    style?: React.CSSProperties;
}

const BoardBlockHeader: React.FC<IBoardBlockHeaderProps> = (props) => {
    const {
        block,
        selectedBoardType,
        resourceType,
        onClickAddCollaborator,
        onClickCreateNewBlock,
        onClickDeleteBlock,
        onClickEditBlock,
        isMobile,
        onNavigate,
        onClickAddOrEditLabel,
        onClickAddOrEditStatus,
        style,
        noExtraCreateMenuItems,
        isAppMenuFolded: isMenuFolded,
        onToggleFoldAppMenu: onToggleFoldMenu,
    } = props;

    const history = useHistory();

    const onSelectCreateMenuItem = (key: CreateMenuKey) => {
        switch (key) {
            case "board":
            case "task":
            case "org":
                onClickCreateNewBlock(key as BlockType);
                break;

            case "collaborator":
                onClickAddCollaborator();
                break;

            case "label":
                onClickAddOrEditLabel();
                break;

            case "status":
                onClickAddOrEditStatus();
                break;
        }
    };

    const onSelectSettingsMenuItem = (key: SettingsMenuKey) => {
        switch (key) {
            case "view":
                onClickEditBlock();
                break;

            case "delete":
                onClickDeleteBlock();
                break;
        }
    };

    const onSelectBoardTypeMenuItem = (key: BoardViewType) => {
        onNavigate(resourceType!, key);
    };

    const renderBoardTypeMenu = () => {
        if (resourceType === "boards") {
            return null;
        }

        if (resourceType && selectedBoardType) {
            return wrapWithMargin(
                <SelectBoardTypeMenu
                    block={block}
                    boardType={selectedBoardType}
                    isMobile={isMobile}
                    resourceType={resourceType}
                    onSelect={onSelectBoardTypeMenuItem}
                />
            );
        }

        return null;
    };

    const renderCreateNewMenu = () => (
        <SelectBlockCreateNewOptionsMenu
            noExtraMenuItems={noExtraCreateMenuItems}
            block={block}
            onSelect={onSelectCreateMenuItem}
        />
    );

    const renderBlockOptionsMenu = () => (
        <SelectBlockOptionsMenu
            block={block}
            onSelect={onSelectSettingsMenuItem}
        />
    );

    const onBack = () => {
        if (block.type === BlockType.Board) {
            history.push(`/app/organizations/${block.rootBlockId}/boards`);
        } else {
            history.push(`/app/organizations`);
        }
    };

    const renderHeaderPrefixButton = () => {
        if (isMobile) {
            return (
                <StyledContainer s={{ marginRight: "16px" }}>
                    <Button
                        style={{ cursor: "pointer" }}
                        onClick={onBack}
                        className="icon-btn"
                    >
                        <ArrowLeft />
                    </Button>
                </StyledContainer>
            );
        } else {
            return (
                <StyledContainer
                    s={{ marginRight: "16px", cursor: "pointer" }}
                    onClick={onToggleFoldMenu}
                >
                    {isMenuFolded ? (
                        <MenuUnfoldOutlined />
                    ) : (
                        <MenuFoldOutlined />
                    )}
                </StyledContainer>
            );
        }
    };

    const renderOrgHeader = () => {
        return (
            <StyledContainer
                s={{
                    ...style,
                    flex: 1,
                    alignItems: "center",
                }}
            >
                {renderHeaderPrefixButton()}
                <BlockThumbnail
                    block={block}
                    showFields={["name", "type"]}
                    style={{ flex: 1 }}
                />
                <StyledContainer s={{ alignItems: "center" }}>
                    {renderBlockOptionsMenu()}
                </StyledContainer>
            </StyledContainer>
        );
    };

    const renderBoardHeader = () => {
        return (
            <StyledContainer
                s={{
                    ...style,
                    width: "100%",
                    alignItems: "center",
                }}
            >
                {renderHeaderPrefixButton()}
                <BlockThumbnail
                    block={block}
                    showFields={["name", "type"]}
                    style={{ flex: 1 }}
                />
                <StyledContainer s={{ alignItems: "center" }}>
                    {wrapWithMargin(renderCreateNewMenu(), 0, 8)}
                    {isBlockRelatedResourceType(resourceType) &&
                        renderBoardTypeMenu()}
                    {wrapWithMargin(renderBlockOptionsMenu(), 8, 0)}
                </StyledContainer>
            </StyledContainer>
        );
    };

    if (block.type === BlockType.Org) {
        return renderOrgHeader();
    } else {
        return renderBoardHeader();
    }
};

export default BoardBlockHeader;

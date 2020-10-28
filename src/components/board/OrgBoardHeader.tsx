import MenuFoldOutlined from "@ant-design/icons/MenuFoldOutlined";
import MenuUnfoldOutlined from "@ant-design/icons/MenuUnfoldOutlined";
import { Button } from "antd";
import React from "react";
import { ArrowLeft } from "react-feather";
import { useHistory } from "react-router";
import { BlockType, IBlock } from "../../models/block/block";
import BlockThumbnail from "../block/BlockThumnail";
import StyledContainer from "../styled/Container";
import OrgHeaderOptionsMenu, {
    OrgHeaderSettingsMenuKey,
} from "./OrgHeaderOptionsMenu";

export interface IOrgBoardHeaderProps {
    block: IBlock;
    isMobile: boolean;
    isAppMenuFolded: boolean;
    onClickEditBlock: () => void;
    onToggleFoldAppMenu: () => void;
    style?: React.CSSProperties;
}

const OrgBoardHeader: React.FC<IOrgBoardHeaderProps> = (props) => {
    const {
        block,
        onClickEditBlock,
        isMobile,
        style,
        isAppMenuFolded: isMenuFolded,
        onToggleFoldAppMenu: onToggleFoldMenu,
    } = props;

    const history = useHistory();

    const onSelectSettingsMenuItem = (key: OrgHeaderSettingsMenuKey) => {
        switch (key) {
            case "view":
                onClickEditBlock();
                break;
        }
    };

    const onBack = () => {
        if (block.type === BlockType.Board) {
            history.push(`/app/orgs/${block.rootBlockId}/boards`);
        } else {
            history.push(`/app/orgs`);
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
                    borderBottom: "1px solid #d9d9d9",
                    height: "56px",
                }}
            >
                {renderHeaderPrefixButton()}
                <BlockThumbnail
                    makeNameBold
                    block={block}
                    showFields={["name"]}
                    style={{ flex: 1 }}
                />
                <StyledContainer s={{ alignItems: "center" }}>
                    <OrgHeaderOptionsMenu
                        block={block}
                        onSelect={onSelectSettingsMenuItem}
                    />
                </StyledContainer>
            </StyledContainer>
        );
    };

    return renderOrgHeader();
};

export default OrgBoardHeader;

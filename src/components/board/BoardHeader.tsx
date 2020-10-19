import MenuFoldOutlined from "@ant-design/icons/MenuFoldOutlined";
import MenuUnfoldOutlined from "@ant-design/icons/MenuUnfoldOutlined";
import { Button } from "antd";
import React from "react";
import { ArrowLeft } from "react-feather";
import { useHistory } from "react-router";
import { IBlock } from "../../models/block/block";
import BlockThumbnail from "../block/BlockThumnail";
import StyledContainer from "../styled/Container";
import BoardStatusResolutionAndLabelsForm, {
    BoardStatusResolutionAndLabelsFormType,
} from "./BoardStatusResolutionAndLabelsForm";
import SelectBlockOptionsMenu, {
    SettingsMenuKey,
} from "./SelectBlockOptionsMenu";

export interface IBoardHeaderProps {
    block: IBlock;
    isMobile: boolean;
    isAppMenuFolded: boolean;
    onClickEditBlock: (block: IBlock) => void;
    onClickDeleteBlock: (block: IBlock) => void;
    onToggleFoldAppMenu: () => void;

    style?: React.CSSProperties;
}

const BoardHeader: React.FC<IBoardHeaderProps> = (props) => {
    const {
        block,
        onClickDeleteBlock,
        onClickEditBlock,
        isMobile,
        style,
        isAppMenuFolded: isMenuFolded,
        onToggleFoldAppMenu: onToggleFoldMenu,
    } = props;

    const [
        showFormFor,
        setFormType,
    ] = React.useState<BoardStatusResolutionAndLabelsFormType | null>(null);
    const history = useHistory();

    const onSelectSettingsMenuItem = React.useCallback(
        (key: SettingsMenuKey) => {
            switch (key) {
                case "view":
                    onClickEditBlock(block);
                    break;

                case "delete":
                    onClickDeleteBlock(block);
                    break;

                case "status":
                    setFormType("status");
                    break;

                case "labels":
                    setFormType("labels");
                    break;

                case "resolutions":
                    setFormType(key);
                    break;
            }
        },
        [block, onClickDeleteBlock, onClickEditBlock]
    );

    const renderBlockOptionsMenu = () => (
        <SelectBlockOptionsMenu
            block={block}
            onSelect={onSelectSettingsMenuItem}
        />
    );

    const closeForm = React.useCallback(() => setFormType(null), []);

    const onBack = React.useCallback(() => {
        history.push(`/app/organizations/${block.rootBlockId}/boards`);
    }, [block, history]);

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

    return (
        <StyledContainer
            s={{
                ...style,
                width: "100%",
                alignItems: "center",
                padding: "16px",
                height: 56,
                borderBottom: "1px solid #d9d9d9",
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
                {renderBlockOptionsMenu()}
            </StyledContainer>
            {showFormFor && (
                <BoardStatusResolutionAndLabelsForm
                    visible
                    block={block}
                    onClose={closeForm}
                    active={showFormFor}
                />
            )}
        </StyledContainer>
    );
};

export default BoardHeader;

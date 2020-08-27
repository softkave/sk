import MenuFoldOutlined from "@ant-design/icons/MenuFoldOutlined";
import MenuUnfoldOutlined from "@ant-design/icons/MenuUnfoldOutlined";
import React from "react";
import { ArrowLeft } from "react-feather";
import { useHistory } from "react-router";
import { IBlock } from "../../models/block/block";
import BlockThumbnail from "../block/BlockThumnail";
import StyledContainer from "../styled/Container";
import BoardStatusAndLabelsForm from "./BoardStatusAndLabelsForm";
import SelectBlockOptionsMenu, {
    SettingsMenuKey,
} from "./SelectBlockOptionsMenu";

export interface IBHeader2Props {
    block: IBlock;
    isMobile: boolean;
    isAppMenuFolded: boolean;
    onClickEditBlock: (block: IBlock) => void;
    onClickDeleteBlock: (block: IBlock) => void;
    onToggleFoldAppMenu: () => void;

    style?: React.CSSProperties;
}

const BHeader2: React.FC<IBHeader2Props> = (props) => {
    const {
        block,
        onClickDeleteBlock,
        onClickEditBlock,
        isMobile,
        style,
        isAppMenuFolded: isMenuFolded,
        onToggleFoldAppMenu: onToggleFoldMenu,
    } = props;

    const [showFormFor, setFormType] = React.useState<
        "status" | "labels" | null
    >(null);
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
            }
        },
        []
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
    }, [block]);

    const renderHeaderPrefixButton = () => {
        if (isMobile) {
            return (
                <StyledContainer
                    s={{ marginRight: "16px", cursor: "pointer" }}
                    onClick={onBack}
                >
                    <ArrowLeft />
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
                borderBottom: "1px solid #d9d9d9",
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
            {showFormFor && (
                <BoardStatusAndLabelsForm
                    visible
                    block={block}
                    onClose={closeForm}
                    active={showFormFor}
                />
            )}
        </StyledContainer>
    );
};

export default React.memo(BHeader2);

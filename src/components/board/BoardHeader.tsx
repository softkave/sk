import MenuFoldOutlined from "@ant-design/icons/MenuFoldOutlined";
import MenuUnfoldOutlined from "@ant-design/icons/MenuUnfoldOutlined";
import { Button, Space } from "antd";
import React from "react";
import { ArrowLeft, Plus, Search } from "react-feather";
import { useHistory } from "react-router";
import { IBlock } from "../../models/block/block";
import BlockThumbnail from "../block/BlockThumnail";
import StyledContainer from "../styled/Container";
import { layoutOptions } from "../utilities/layout";
import BoardHeaderOptionsMenu, {
    BoardCurrentView,
    BoardGroupBy,
    BoardHeaderSettingsMenuKey,
} from "./BoardHeaderOptionsMenu";
import SearchTasksInput, { SearchTasksMode } from "./SearchTasksInput";

export interface IBoardHeaderProps {
    block: IBlock;
    isMobile: boolean;
    isAppMenuFolded: boolean;
    view: BoardCurrentView;
    groupBy: BoardGroupBy;
    searchIn: SearchTasksMode;
    onChange: (text: string) => void;
    onChangeSearchMode: (mode: SearchTasksMode) => void;
    onToggleFoldAppMenu: () => void;
    onSelectMenuKey: (key: BoardHeaderSettingsMenuKey) => void;
    onSelectCurrentView: (key: BoardCurrentView) => void;
    onSelectGroupBy: (key: BoardGroupBy) => void;
    style?: React.CSSProperties;
}

const BoardHeader: React.FC<IBoardHeaderProps> = (props) => {
    const {
        block,
        isMobile,
        style,
        isAppMenuFolded: isMenuFolded,
        onToggleFoldAppMenu: onToggleFoldMenu,
        onSelectMenuKey,
    } = props;

    const [showSearch, setShowSearch] = React.useState(false);
    const history = useHistory();

    const onSelectSettingsMenuItem = (key: BoardHeaderSettingsMenuKey) => {
        switch (key) {
            case BoardHeaderSettingsMenuKey.SEARCH_TASKS:
                setShowSearch(true);
                break;

            default:
                onSelectMenuKey(key as BoardHeaderSettingsMenuKey);
                break;
        }
    };

    const onBack = React.useCallback(() => {
        history.push(`/app/organizations/${block.rootBlockId}/boards`);
    }, [block, history]);

    const renderBackButton = () => {
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

    let content: React.ReactNode = null;

    if (showSearch) {
        content = (
            <SearchTasksInput
                {...props}
                onCancel={() => setShowSearch(false)}
            />
        );
    } else {
        content = (
            <React.Fragment>
                {renderBackButton()}
                <BlockThumbnail
                    makeNameBold
                    block={block}
                    showFields={["name"]}
                    style={{ flex: 1 }}
                />
                <StyledContainer s={{ alignItems: "center" }}>
                    {!isMobile && (
                        <Space>
                            <Button
                                onClick={() =>
                                    onSelectMenuKey(
                                        BoardHeaderSettingsMenuKey.ADD_TASK
                                    )
                                }
                                className="icon-btn"
                            >
                                <Plus />
                            </Button>
                            <Button
                                onClick={() => setShowSearch(true)}
                                className="icon-btn"
                            >
                                <Search />
                            </Button>
                        </Space>
                    )}
                    <BoardHeaderOptionsMenu
                        {...props}
                        onSelectMenuKey={onSelectSettingsMenuItem}
                    />
                </StyledContainer>
            </React.Fragment>
        );
    }

    return (
        <StyledContainer
            s={{
                ...style,
                width: "100%",
                alignItems: "center",
                padding: "16px",
                height: layoutOptions.HEADER_HEIGHT,
                borderBottom: "1px solid #d9d9d9",
            }}
        >
            {content}
        </StyledContainer>
    );
};

export default BoardHeader;

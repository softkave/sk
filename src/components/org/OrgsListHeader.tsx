import { Button, Input, Space, Typography } from "antd";
import React from "react";
import { Plus, Search, X as CloseIcon } from "react-feather";
import StyledContainer from "../styled/Container";
import InputSearchIcon from "../utilities/InputSearchIcon";

export interface IOrgsListHeaderProps {
    onClickCreate: () => void;
    onSearchTextChange: (text: string) => void;
    noAddBtn?: boolean;
    noSearchBtn?: boolean;
    placeholder?: string;
    title: string;
    style?: React.CSSProperties;
    disabled?: boolean;
}

const OrgsListHeader: React.FC<IOrgsListHeaderProps> = (props) => {
    const {
        onSearchTextChange,
        onClickCreate,
        style,
        placeholder,
        noAddBtn,
        noSearchBtn,
        title,
        disabled,
    } = props;

    const [inSearchMode, setSearchMode] = React.useState(false);
    const toggleSearchMode = React.useCallback(
        () => setSearchMode(!inSearchMode),
        [inSearchMode]
    );

    const leaveSearchMode = React.useCallback(() => {
        toggleSearchMode();
        onSearchTextChange("");
    }, [toggleSearchMode, onSearchTextChange]);

    const renderSearchMode = () => {
        return (
            <StyledContainer
                s={{
                    justifyContent: "flex-end",
                    flex: 1,
                    "& .ant-space-item:first-of-type": { flex: 1 },
                }}
            >
                <Space style={{ width: "100%" }}>
                    <Input
                        allowClear
                        disabled={disabled}
                        placeholder={placeholder}
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
            <StyledContainer s={{ flex: 1 }}>
                <Typography.Text
                    type="secondary"
                    style={{
                        textTransform: "uppercase",
                        display: "inline-flex",
                        flex: 1,
                        marginRight: "16px",
                        alignItems: "center",
                    }}
                >
                    {title}
                </Typography.Text>
                <Space>
                    {!noAddBtn && (
                        <Button
                            disabled={disabled}
                            onClick={onClickCreate}
                            className="icon-btn"
                        >
                            <Plus />
                        </Button>
                    )}
                    {!noSearchBtn && (
                        <Button
                            disabled={disabled}
                            onClick={toggleSearchMode}
                            className="icon-btn"
                        >
                            <Search />
                        </Button>
                    )}
                </Space>
            </StyledContainer>
        );
    };

    return (
        <StyledContainer s={{ padding: "0 16px", ...style }}>
            {!inSearchMode && renderControls()}
            {inSearchMode && renderSearchMode()}
        </StyledContainer>
    );
};

OrgsListHeader.defaultProps = { style: {} };

export default React.memo(OrgsListHeader);

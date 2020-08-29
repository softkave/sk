import { Button, Input, Space } from "antd";
import React from "react";
import { Plus, Search, X as CloseIcon } from "react-feather";
import StyledContainer from "../styled/Container";
import InputSearchIcon from "../utilities/InputSearchIcon";

export interface IOrgsListHeaderProps {
    onClickCreate: () => void;
    onSearchTextChange: (text: string) => void;
    style?: React.CSSProperties;
}

const OrgsListHeader: React.FC<IOrgsListHeaderProps> = (props) => {
    const { onSearchTextChange, onClickCreate, style } = props;

    const [inSearchMode, setSearchMode] = React.useState(false);
    const toggleSearchMode = React.useCallback(
        () => setSearchMode(!inSearchMode),
        [inSearchMode]
    );

    const leaveSearchMode = React.useCallback(() => {
        toggleSearchMode();
        onSearchTextChange("");
    }, [toggleSearchMode]);

    const renderSearchMode = () => {
        return (
            <StyledContainer
                s={{ justifyContent: "flex-end", flex: 1, ...style }}
            >
                <Space>
                    <Input
                        allowClear
                        placeholder="Search orgs and requests..."
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
            {!inSearchMode && renderControls()}
            {inSearchMode && renderSearchMode()}
        </StyledContainer>
    );
};

OrgsListHeader.defaultProps = { style: {} };

export default React.memo(OrgsListHeader);

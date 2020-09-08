/*eslint no-useless-computed-key: "off"*/

import { Button, Tabs } from "antd";
import React from "react";
import { ArrowLeft } from "react-feather";
import { IBlock } from "../../models/block/block";
import LabelListContainer from "../label/LabelListContainer";
import ResolutionsListContainer from "../status/ResolutionsListContainer";
import StatusListContainer from "../status/StatusListContainer";
import StyledContainer from "../styled/Container";
import withDrawer from "../withDrawer";

export interface IBoardStatusAndLabelsFormProps {
    onClose: () => void;
    block: IBlock;
    active?: "status" | "labels" | "resolutions";
}

const BoardStatusAndLabelsForm: React.FC<IBoardStatusAndLabelsFormProps> = (
    props
) => {
    const { block, onClose, active } = props;

    const renderForms = () => {
        return (
            <StyledContainer
                s={{
                    width: "100%",
                    height: "100%",
                    flexDirection: "column",

                    ["& .ant-tabs"]: {
                        height: "100%",
                    },

                    ["& .ant-tabs-content"]: {
                        height: "100%",
                    },
                }}
            >
                <StyledContainer s={{ padding: "0 16px", paddingTop: "16px" }}>
                    <Button
                        style={{ cursor: "pointer" }}
                        onClick={onClose}
                        className="icon-btn"
                    >
                        <ArrowLeft />
                    </Button>
                </StyledContainer>
                <Tabs defaultActiveKey={active} tabBarGutter={0}>
                    <Tabs.TabPane
                        tab={<span style={tabSpanStyle}>Status List</span>}
                        key="status"
                    >
                        <StatusListContainer block={block} />
                    </Tabs.TabPane>
                    <Tabs.TabPane
                        tab={<span style={tabSpanStyle}>Resolutions</span>}
                        key="resolutions"
                    >
                        <ResolutionsListContainer block={block} />
                    </Tabs.TabPane>
                    <Tabs.TabPane
                        tab={<span style={tabSpanStyle}>Labels</span>}
                        key="labels"
                    >
                        <LabelListContainer block={block} />
                    </Tabs.TabPane>
                </Tabs>
            </StyledContainer>
        );
    };

    return renderForms();
};

export default withDrawer(BoardStatusAndLabelsForm);

const tabSpanStyle: React.CSSProperties = {
    textTransform: "capitalize",
    padding: "0 16px",
};

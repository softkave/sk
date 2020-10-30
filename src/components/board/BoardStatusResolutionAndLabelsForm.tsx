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

export enum BoardStatusResolutionAndLabelsFormType {
    STATUS = "Status",
    LABELS = "Labels",
    RESOLUTIONS = "Resolutions",
}

export interface IBoardStatusResolutionAndLabelsFormProps {
    onClose: () => void;
    block: IBlock;
    active?: BoardStatusResolutionAndLabelsFormType;
}

const BoardStatusResolutionAndLabelsForm: React.FC<IBoardStatusResolutionAndLabelsFormProps> = (
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
                        tab={
                            <span style={tabSpanStyle}>
                                {BoardStatusResolutionAndLabelsFormType.STATUS}
                            </span>
                        }
                        key={BoardStatusResolutionAndLabelsFormType.STATUS}
                    >
                        <StatusListContainer block={block} />
                    </Tabs.TabPane>
                    <Tabs.TabPane
                        tab={
                            <span style={tabSpanStyle}>
                                {
                                    BoardStatusResolutionAndLabelsFormType.RESOLUTIONS
                                }
                            </span>
                        }
                        key={BoardStatusResolutionAndLabelsFormType.RESOLUTIONS}
                    >
                        <ResolutionsListContainer block={block} />
                    </Tabs.TabPane>
                    <Tabs.TabPane
                        tab={
                            <span style={tabSpanStyle}>
                                {BoardStatusResolutionAndLabelsFormType.LABELS}
                            </span>
                        }
                        key={BoardStatusResolutionAndLabelsFormType.LABELS}
                    >
                        <LabelListContainer block={block} />
                    </Tabs.TabPane>
                </Tabs>
            </StyledContainer>
        );
    };

    return renderForms();
};

export default withDrawer(BoardStatusResolutionAndLabelsForm);

const tabSpanStyle: React.CSSProperties = {
    textTransform: "capitalize",
    padding: "0 16px",
};

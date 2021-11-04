/*eslint no-useless-computed-key: "off"*/

import { Button, Tabs } from "antd";
import { RightOutlined } from "@ant-design/icons";
import React from "react";
import { ArrowLeft } from "react-feather";
import { IBlock } from "../../models/block/block";
import LabelListContainer from "../label/LabelListContainer";
import ResolutionsListContainer from "../status/ResolutionsListContainer";
import StatusListContainer from "../status/StatusListContainer";
import withDrawer from "../withDrawer";
import { appClassNames } from "../classNames";
import { css, cx } from "@emotion/css";

export enum BoardStatusResolutionAndLabelsFormType {
    STATUS = "status",
    LABELS = "labels",
    RESOLUTIONS = "resolutions",
}

export interface IBoardStatusResolutionAndLabelsFormProps {
    onClose: () => void;
    block: IBlock;
    active?: BoardStatusResolutionAndLabelsFormType;
}

const classes = {
    backBtnWrapper: css({ padding: "0 16px", paddingTop: "16px" }),
    backBtn: css({ cursor: "pointer" }),
    tabLabel: css({
        textTransform: "capitalize",
        padding: "0 16px",
    }),
};

const BoardStatusResolutionAndLabelsForm: React.FC<IBoardStatusResolutionAndLabelsFormProps> =
    (props) => {
        const { block, onClose, active } = props;

        const renderForms = () => {
            return (
                <div className={appClassNames.tabsWrapper}>
                    <div className={classes.backBtnWrapper}>
                        <Button
                            className={cx(classes.backBtn, "icon-btn")}
                            onClick={onClose}
                        >
                            <ArrowLeft />
                        </Button>
                    </div>
                    <Tabs
                        defaultActiveKey={active}
                        tabBarGutter={0}
                        moreIcon={<RightOutlined />}
                    >
                        <Tabs.TabPane
                            tab={
                                <span className={classes.tabLabel}>Status</span>
                            }
                            key={BoardStatusResolutionAndLabelsFormType.STATUS}
                        >
                            <StatusListContainer block={block} />
                        </Tabs.TabPane>
                        <Tabs.TabPane
                            tab={
                                <span className={classes.tabLabel}>
                                    Resolutions
                                </span>
                            }
                            key={
                                BoardStatusResolutionAndLabelsFormType.RESOLUTIONS
                            }
                        >
                            <ResolutionsListContainer block={block} />
                        </Tabs.TabPane>
                        <Tabs.TabPane
                            tab={
                                <span className={classes.tabLabel}>Labels</span>
                            }
                            key={BoardStatusResolutionAndLabelsFormType.LABELS}
                        >
                            <LabelListContainer block={block} />
                        </Tabs.TabPane>
                    </Tabs>
                </div>
            );
        };

        return renderForms();
    };

export default withDrawer(BoardStatusResolutionAndLabelsForm);

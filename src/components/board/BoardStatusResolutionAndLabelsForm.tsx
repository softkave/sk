import { Button, Tabs } from "antd";
import { RightOutlined } from "@ant-design/icons";
import React from "react";
import { ArrowLeft } from "react-feather";
import LabelListContainer from "../label/LabelListContainer";
import ResolutionsListContainer from "../status/ResolutionsListContainer";
import StatusListContainer from "../status/StatusListContainer";
import withDrawer from "../withDrawer";
import { appClassNames } from "../classNames";
import { css, cx } from "@emotion/css";
import { IBoard } from "../../models/board/types";

export enum BoardStatusResolutionAndLabelsFormType {
  STATUS = "status",
  LABELS = "labels",
  RESOLUTIONS = "resolutions",
}

export interface IBoardStatusResolutionAndLabelsFormProps {
  onClose: () => void;
  board: IBoard;
  active?: BoardStatusResolutionAndLabelsFormType;
}

const classes = {
  backBtnWrapper: css({ padding: "0 16px", paddingTop: "16px" }),
  backBtn: css({ cursor: "pointer" }),
  tabLabel: css({
    textTransform: "capitalize",
    padding: "0 16px",
  }),
  root: css({
    display: "grid",
    gridTemplateColumns: "1fr",
    gridTemplateRows: "auto 1fr",
  }),
};

const BoardStatusResolutionAndLabelsForm: React.FC<
  IBoardStatusResolutionAndLabelsFormProps
> = (props) => {
  const { board, active, onClose } = props;
  return (
    <div className={cx(appClassNames.tabsWrapper, classes.root)}>
      <div className={classes.backBtnWrapper}>
        <Button className={cx(classes.backBtn, "icon-btn")} onClick={onClose}>
          <ArrowLeft />
        </Button>
      </div>
      <Tabs
        defaultActiveKey={active}
        moreIcon={<RightOutlined />}
        tabBarExtraContent={{
          left: <div style={{ marginLeft: "16px" }} />,
        }}
      >
        <Tabs.TabPane
          tab="Status"
          key={BoardStatusResolutionAndLabelsFormType.STATUS}
        >
          <StatusListContainer board={board} />
        </Tabs.TabPane>
        <Tabs.TabPane
          tab="Resolutions"
          key={BoardStatusResolutionAndLabelsFormType.RESOLUTIONS}
        >
          <ResolutionsListContainer board={board} />
        </Tabs.TabPane>
        <Tabs.TabPane
          tab="Labels"
          key={BoardStatusResolutionAndLabelsFormType.LABELS}
        >
          <LabelListContainer board={board} />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default withDrawer(BoardStatusResolutionAndLabelsForm);

import { css, cx } from "@emotion/css";
import { Button } from "antd";
import React from "react";
import { ArrowLeft } from "react-feather";
import { IBoard } from "../../models/board/types";
import { appClassNames } from "../classNames";
import LabelListContainer from "../label/LabelListContainer";
import ResolutionsListContainer from "../status/ResolutionsListContainer";
import StatusListContainer from "../status/StatusListContainer";
import AppTabs from "../utils/page/AppTabs";
import withDrawer from "../withDrawer";

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

const BoardStatusResolutionAndLabelsForm: React.FC<IBoardStatusResolutionAndLabelsFormProps> = (
  props
) => {
  const { board, active, onClose } = props;
  return (
    <div className={cx(appClassNames.tabsWrapper, classes.root)}>
      <div className={classes.backBtnWrapper}>
        <Button className={cx(classes.backBtn, "icon-btn")} onClick={onClose}>
          <ArrowLeft />
        </Button>
      </div>
      <AppTabs
        key={active}
        items={[
          {
            key: BoardStatusResolutionAndLabelsFormType.STATUS,
            label: "Status",
            children: <StatusListContainer board={board} />,
          },
          {
            key: BoardStatusResolutionAndLabelsFormType.RESOLUTIONS,
            label: "Resolutions",
            children: <ResolutionsListContainer board={board} />,
          },
          {
            key: BoardStatusResolutionAndLabelsFormType.LABELS,
            label: "Labels",
            children: <LabelListContainer board={board} />,
          },
        ]}
      />
    </div>
  );
};

export default withDrawer(BoardStatusResolutionAndLabelsForm);

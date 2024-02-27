import { css } from "@emotion/css";
import appTheme from "./theme";
import { cssProperties } from "./utils/fns";

export const appClassNames = {
  tabsWrapper: css({
    width: "100%",
    height: "100%",
    flexDirection: "column",
    "& .ant-tabs": {
      height: "100%",
    },
    "& .ant-tabs-content": {
      height: "100%",
    },
  }),
  item: css({
    padding: "8px 16px",
  }),
  pageListRoot: css({
    display: "flex",
    flex: 1,
    width: "100%",
    flexDirection: "column",
  }),
  clickable: css({
    cursor: "pointer",
    "& .ant-tag": {
      cursor: "pointer",
    },
  }),
  disabled: css({
    cursor: "not-allowed",
  }),
  selectable: css({
    cursor: "pointer",
    "& .ant-tag": {
      cursor: "pointer",
    },
    ":hover": {
      backgroundColor: appTheme.colors.select,
    },
  }),
  selected: css({
    backgroundColor: appTheme.colors.select,
  }),
  flex: css({ display: "flex" }),
  grid: css({ display: "grid" }),
  alignCenter: css({
    alignItems: "center",
  }),
  h100: css({
    height: "100%",
  }),

  // width
  w100Forced: css({
    width: "100% !important",
  }),
  w100: css({
    width: "100%",
  }),
  p16: css({
    padding: "16px",
  }),
  pt8: css({
    paddingTop: "8px",
  }),
  pl8Forced: css({
    paddingLeft: "8px !important",
  }),
  pr8Forced: css({
    paddingRight: "8px !important",
  }),
  pt16: css({
    paddingTop: "16px",
  }),
  pt32: css({
    paddingTop: "32px",
  }),
  pb8: css({
    paddingBottom: "8px",
  }),
  pb16: css({
    paddingBottom: "16px",
  }),
  pb32: css({
    paddingBottom: "32px",
  }),
  pw16: css({
    paddingLeft: "16px",
    paddingRight: "16px",
  }),
  ph8: css({
    paddingTop: "8px",
    paddingBottom: "8px",
  }),

  // margins
  ml8Forced: css({
    marginLeft: "8px !important",
  }),
  mr8Forced: css({
    marginRight: "8px !important",
  }),
  muteMargin: css({
    margin: "0px !important",
  }),
  mb8: css({
    marginBottom: "8px",
  }),
  mw16: css({
    marginLeft: "16px",
    marginRight: "16px",
  }),

  // text
  capitalize: css({
    textTransform: "capitalize",
  }),
};

export const appStyles = {
  p100: cssProperties({ width: "100%" }),
};

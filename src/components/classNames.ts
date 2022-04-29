import { css } from "@emotion/css";

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
  pageListItem: css({
    padding: "8px 16px",
    cursor: "pointer",

    "& .ant-tag": {
      cursor: "pointer",
    },
  }),
  pageListRoot: css({
    display: "flex",
    flex: 1,
    width: "100%",
    flexDirection: "column",
  }),
};

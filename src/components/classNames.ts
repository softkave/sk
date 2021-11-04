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
};

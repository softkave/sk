import React from "react";
import StyledContainer, { IStyledContainerProps } from "../styled/Container";

const ContainMenu: React.FC<IStyledContainerProps> = (props) => {
  const s = props.s || {};

  return (
    <StyledContainer
      {...props}
      s={{
        flex: 1,
        height: "100%",
        overflow: "hidden",
        flexDirection: "column",

        ["& .ant-tabs"]: {
          height: "100%",
        },

        ["& .ant-tabs-content"]: {
          height: "100%",
        },

        ["& .ant-tabs-content-holder"]: {
          overflow: "hidden",
        },

        ["& .ant-tabs-nav"]: {
          marginBottom: "8px",
        },

        ...s,
      }}
    />
  );
};

export default React.memo(ContainMenu);

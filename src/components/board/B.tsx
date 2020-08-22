import { Tabs } from "antd";
import { noop } from "lodash";
import React from "react";
import StyledContainer from "../styled/Container";
import BHeader from "./BHeader";
import BoardBlockHeader from "./BoardBlockHeader";
import { getBoardResourceTypeFullName } from "./utils";

export interface IBProps {}

const B: React.FC<IBProps> = (props) => {
  const renderBoardControls = () => {
    return <StyledContainer></StyledContainer>;
  };

  const renderGroupSelector = () => {};

  const renderContent = () => {};

  const renderTabs = () => {};

  return <React.Fragment></React.Fragment>;
};

export default React.memo(B);

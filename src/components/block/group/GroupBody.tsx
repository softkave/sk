import styled from "@emotion/styled";
import { Button, Col, Row } from "antd";
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import SimpleBar from "simplebar-react";

import { getBlockValidChildrenTypes } from "../../../models/block/utils";
import AddDropdownButton from "../../AddDropdownButton.jsx";
import DeleteButton from "../../DeleteButton";

import { IBlock } from "../../../models/block/block.js";
import { IBlockMethods } from "../methods.js";

import "simplebar/dist/simplebar.css";

const GroupBody = React.memo<IGroupProps>(props => {
  const { render } = props;

  return (
    <GroupScrollContainer>
      <GroupScrollContainerInner>{render()}</GroupScrollContainerInner>
    </GroupScrollContainer>
  );
});

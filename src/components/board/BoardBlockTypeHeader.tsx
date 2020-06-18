import { PlusOutlined } from "@ant-design/icons";
import styled from "@emotion/styled";
import { Typography } from "antd";
import isNumber from "lodash/isNumber";
import React from "react";
import StyledContainer from "../styled/Container";
import StyledFlatButton from "../styled/FlatButton";

export interface IBoardBlockTypeHeaderProps {
  title: string;
  count?: number;
}

const BoardBlockTypeHeader: React.FC<IBoardBlockTypeHeaderProps> = (props) => {
  const { title, count } = props;

  return (
    <StyledContainer s={{ width: "100%", alignItems: "center" }}>
      <Typography.Title
        level={4}
        style={{
          display: "flex",
          flex: 1,
          marginRight: "16px",
          marginBottom: "0",
          textTransform: "capitalize",
        }}
      >
        {title}
        {isNumber(count) && ` (${count})`}
      </Typography.Title>
    </StyledContainer>
  );
};

export default BoardBlockTypeHeader;

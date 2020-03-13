import { PlusOutlined } from "@ant-design/icons";
import styled from "@emotion/styled";
import isNumber from "lodash/isNumber";
import React from "react";
import StyledContainer from "../styled/Container";
import StyledFlatButton from "../styled/FlatButton";

export interface IBoardBlockTypeHeaderProps {
  title: string;
  onClickCreate: () => void;
  count?: number;
}

const BoardBlockTypeHeader: React.FC<IBoardBlockTypeHeaderProps> = props => {
  const { title, onClickCreate, count } = props;

  return (
    <StyledContainer s={{ width: "100%", alignItems: "center" }}>
      <StyledHeaderName>
        {title}
        {isNumber(count) && ` (${count})`}
      </StyledHeaderName>
      <StyledFlatButton onClick={onClickCreate}>
        <PlusOutlined />
      </StyledFlatButton>
    </StyledContainer>
  );
};

export default BoardBlockTypeHeader;

const StyledHeaderName = styled.h1({
  display: "flex",
  flex: 1,
  marginRight: "16px",
  fontSize: "18px",
  marginBottom: "0",
  textTransform: "capitalize"
});

import styled from "@emotion/styled";
import { Icon } from "antd";
import React from "react";
import StyledContainer from "../styled/Container";
import StyledFlatButton from "../styled/FlatButton";

export interface IBoardBlockTypeHeaderProps {
  title: string;
  onClickCreate: () => void;
  onNavigateBack?: (() => void) | null;
}

const BoardBlockTypeHeader: React.FC<IBoardBlockTypeHeaderProps> = props => {
  const { onNavigateBack, title, onClickCreate } = props;

  return (
    <StyledContainer s={{ width: "100%", alignItems: "center" }}>
      {/* {onNavigateBack && (
        <StyledFlatButton
          style={{ paddingRight: "16px" }}
          onClick={onNavigateBack}
        >
          <Icon type="arrow-left" />
        </StyledFlatButton>
      )} */}
      <StyledHeaderName>{title}</StyledHeaderName>
      <StyledFlatButton onClick={onClickCreate}>
        <Icon type="plus" />
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

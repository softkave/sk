import styled from "@emotion/styled";
import React from "react";
import RenderForDevice from "../RenderForDevice";
import StyledContainer from "../styled/Container";

export interface IColumnProps {
  className?: string;
  header?: React.ReactNode;
  body?: React.ReactNode;
}

const Column: React.FC<IColumnProps> = props => {
  const { className, header, body } = props;

  const column = (
    <ColumnContainer className={className}>
      {header && (
        <StyledColumnHeaderContainer>{header}</StyledColumnHeaderContainer>
      )}
      <StyledColumnBodyContainer>{body}</StyledColumnBodyContainer>
    </ColumnContainer>
  );

  return (
    <RenderForDevice
      renderForDesktop={() => (
        <StyledContainer s={{ width: "350px", flex: 1, height: "100%" }}>
          {column}
        </StyledContainer>
      )}
      renderForMobile={() => column}
    />
  );
};

const ColumnContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
  box-sizing: border-box;
  padding: 0 16px;
`;

const StyledColumnHeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding-bottom: 12px;
  border-bottom: 1px solid #d9d9d9;
`;

const StyledColumnBodyContainer = styled.div`
  flex: 1;
  display: flex;
  overflow: auto;
`;

export default Column;

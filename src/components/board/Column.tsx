import styled from "@emotion/styled";
import React from "react";
import RenderForDevice from "../RenderForDevice";
import StyledContainer from "../styled/Container";

export interface IColumnProps {
  header?: React.ReactNode;
  body?: React.ReactNode;
}

const Column: React.FC<IColumnProps> = (props) => {
  const { header, body } = props;

  const renderColumn = (desktop: boolean) => {
    let styles: React.CSSProperties = {
      display: "flex",
      height: "100%",
      width: "100%",
      flexDirection: "column",
      boxSizing: "border-box",
      // padding: "0 16px"
    };

    if (desktop) {
      styles = {
        ...styles,
        width: "350px",
        maxWidth: "350px",
        flex: 1,
        height: "100%",
      };
    }

    return (
      <StyledContainer s={styles}>
        {header && (
          <StyledColumnHeaderContainer>{header}</StyledColumnHeaderContainer>
        )}
        <StyledColumnBodyContainer>{body}</StyledColumnBodyContainer>
      </StyledContainer>
    );
  };

  return (
    <RenderForDevice
      renderForDesktop={() => renderColumn(true)}
      renderForMobile={() => renderColumn(false)}
    />
  );
};

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

export default React.memo(Column);

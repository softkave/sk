import styled from "@emotion/styled";
import { Col } from "antd";
import React from "react";

export interface IColumnHeaderProps {
  controls?: React.ReactNode;
  title?: React.ReactNode;
  disabled?: boolean;
}

const ColumnHeader = React.memo<IColumnHeaderProps>(props => {
  const { title: name, controls, disabled } = props;

  return (
    <ColumnHeaderContainer>
      <ColumnTitle span={controls ? 24 : 12}>{name}</ColumnTitle>
      {controls && !disabled ? (
        <ColumnHeaderControlsContainer>
          {controls}
        </ColumnHeaderControlsContainer>
      ) : null}
    </ColumnHeaderContainer>
  );
});

const ColumnHeaderContainer = styled.div`
  display: flex;
  padding: 12px;
  border-bottom: 1px solid #ddd;
  flex-direction: row;
`;

const ColumnHeaderControlsContainer = styled.div``;

const ColumnTitle = styled(Col)`
  font-weight: bold;
  min-height: 32px;
  flex: 1;
  min-width: 20%;
`;

export default ColumnHeader;

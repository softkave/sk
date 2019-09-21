import styled from "@emotion/styled";
import { Col } from "antd";
import React from "react";

export interface IGroupHeaderProps {
  controls?: React.ReactNode;
  name?: string;
}

const GroupHeader = React.memo<IGroupHeaderProps>(props => {
  const { name, controls } = props;

  return (
    <GroupHeaderContainer>
      <GroupName span={controls ? 24 : 12}>{name}</GroupName>
      {controls ? (
        <GroupHeaderControlsContainer>{controls}</GroupHeaderControlsContainer>
      ) : null}
    </GroupHeaderContainer>
  );
});

const GroupHeaderContainer = styled.div`
  display: flex;
  padding: 12px;
  border-bottom: 1px solid #ddd;
  flex-direction: row;
`;

const GroupHeaderControlsContainer = styled.div``;

const GroupName = styled(Col)`
  font-weight: bold;
  min-height: 32px;
  flex: 1;
  min-width: 20%;
`;

export default GroupHeader;

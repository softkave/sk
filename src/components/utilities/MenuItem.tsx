import { Badge, Icon } from "antd";
import React from "react";
import StyledContainer from "../styled/Container";

export interface IMenuItemProps {
  name: string;
  iconType: string;
  onClick: () => void;
  count?: number;
  unseenCount?: number;
  style?: React.CSSProperties;
}

const MenuItem: React.FC<IMenuItemProps> = props => {
  const { name, count, unseenCount, iconType, style } = props;

  const renderCount = (num: number = 0) => (num > 0 ? `${num}${" "}` : null);
  const renderBadge = (num: number = 0) =>
    num > 0 ? <Badge count={num} /> : null;

  return (
    <StyledContainer style={style}>
      <Icon type={iconType} />
      <StyledContainer s={{ flex: 1, textOverflow: "ellipsis" }}>
        {renderCount(count)}
        {name}
      </StyledContainer>
      {renderBadge(unseenCount)}
    </StyledContainer>
  );
};

export default MenuItem;

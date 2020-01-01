import { Badge, Icon } from "antd";
import React from "react";
import StyledContainer from "../styled/Container";

export interface IMenuItemProps {
  name: string;
  onClick: () => void;
  iconType?: string;
  count?: number;
  unseenCount?: number;
  keepIconSpace?: boolean;
  keepCountSpace?: boolean;
  style?: React.CSSProperties;
}

const MenuItem: React.FC<IMenuItemProps> = props => {
  const {
    name,
    count,
    unseenCount,
    iconType,
    style,
    keepCountSpace,
    keepIconSpace
  } = props;

  const renderBadge = (num: number = 0) =>
    num > 0 ? <Badge count={num} /> : null;

  // TODO: round up after a 1000 -> 1K
  const renderCount = () => {
    if (count && count > 0) {
      return <StyledContainer s={{ width: "48px" }}>{count}</StyledContainer>;
    } else if (keepCountSpace) {
      return <StyledContainer s={{ width: "48px" }} />;
    }

    return null;
  };

  const renderIcon = () => {
    if (iconType) {
      return (
        <StyledContainer s={{ width: "24px" }}>
          <Icon type={iconType} />
        </StyledContainer>
      );
    } else if (keepIconSpace) {
      return <StyledContainer s={{ width: "24px" }} />;
    }

    return null;
  };

  return (
    <StyledContainer style={style}>
      {renderIcon()}
      <StyledContainer s={{ flex: 1, textOverflow: "ellipsis" }}>
        {renderCount()}
        {name}
      </StyledContainer>
      {renderBadge(unseenCount)}
    </StyledContainer>
  );
};

export default MenuItem;

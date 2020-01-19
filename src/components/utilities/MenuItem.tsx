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
  bordered?: boolean;
}

const MenuItem: React.FC<IMenuItemProps> = props => {
  const {
    name,
    count,
    unseenCount,
    iconType,
    style,
    keepCountSpace,
    keepIconSpace,
    onClick,
    bordered
  } = props;

  const renderBadge = (num: number = 0) =>
    num > 0 ? (
      <StyledContainer s={{ marginLeft: "8px" }}>
        <Badge count={num} />
      </StyledContainer>
    ) : null;

  // TODO: round up after a 1000 -> 1K
  // TODO: determine the width by getting the largest count, maybe
  const countWidth = "32px";
  const renderCount = () => {
    if (count && count > 0) {
      return (
        <StyledContainer
          s={{
            width: countWidth,
            display: "inline-block",
            paddingRight: "8px"
          }}
        >
          {count}
        </StyledContainer>
      );
    } else if (keepCountSpace) {
      return <StyledContainer s={{ width: countWidth }} />;
    }

    return null;
  };

  const iconWidth = "16px";
  const renderIcon = () => {
    if (iconType) {
      return (
        <StyledContainer s={{ width: iconWidth, marginRight: "8px" }}>
          <Icon type={iconType} />
        </StyledContainer>
      );
    } else if (keepIconSpace) {
      return <StyledContainer s={{ width: iconWidth }} />;
    }

    return null;
  };

  const hoverSelector = "&:hover";

  return (
    <StyledContainer
      style={style}
      s={{
        padding: "24px",
        alignItems: "center",
        cursor: "pointer",
        borderBottom: bordered ? "1px solid #ddd" : undefined,
        [hoverSelector]: { color: "rgb(66,133,244)" }
      }}
      onClick={onClick}
    >
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

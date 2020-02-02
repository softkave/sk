import { Icon } from "antd";
import isNumber from "lodash/isNumber";
import React from "react";
import StyledContainer from "../styled/Container";

export interface IMenuItemProps {
  content: string;
  onClick: () => void;
  iconType?: string;
  count?: number;
  keepIconSpace?: boolean;
  keepCountSpace?: boolean;
  style?: React.CSSProperties;
}

const MenuItem: React.FC<IMenuItemProps> = props => {
  const {
    content: name,
    count,
    iconType,
    style,
    keepCountSpace,
    keepIconSpace,
    onClick
  } = props;

  // TODO: round up after a 1000 -> 1K
  // TODO: determine the width by getting the largest count, maybe
  const countWidth = "32px";
  const renderCount = () => {
    if (isNumber(count)) {
      return (
        <StyledContainer
          s={{
            width: countWidth,
            display: "inline-block",
            marginLeft: "8px"
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
        padding: "8px 0px",
        alignItems: "center",
        cursor: "pointer",
        [hoverSelector]: { color: "rgb(66,133,244)" }
      }}
      onClick={onClick}
    >
      {renderIcon()}
      <StyledContainer s={{ flex: 1, textOverflow: "ellipsis" }}>
        {name}
      </StyledContainer>
      {renderCount()}
    </StyledContainer>
  );
};

export default MenuItem;

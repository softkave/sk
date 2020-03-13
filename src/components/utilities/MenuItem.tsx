import React from "react";
import StyledContainer from "../styled/Container";

export interface IMenuItemProps {
  content: string;
  onClick: () => void;
  icon?: React.ReactNode;
  count?: number;
  keepIconSpace?: boolean;
  style?: React.CSSProperties;
}

const MenuItem: React.FC<IMenuItemProps> = props => {
  const { content: name, count, icon, style, keepIconSpace, onClick } = props;

  const iconWidth = "16px";
  const renderIcon = () => {
    if (icon) {
      return (
        <StyledContainer s={{ width: iconWidth, marginRight: "8px" }}>
          {icon}
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
        {count ? ` (${count})` : null}
      </StyledContainer>
    </StyledContainer>
  );
};

export default MenuItem;

import React from "react";
import StyledContainer from "../styled/Container";

const wrapMenu = (menu: React.ReactNode) => {
  return (
    <StyledContainer s={{ "& ul": { borderRight: 0 } }}>{menu}</StyledContainer>
  );
};

export default wrapMenu;

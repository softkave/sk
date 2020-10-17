import styled from "@emotion/styled";
import React from "react";

const LogoBackground: React.FC<{}> = () => {
    return <Logo>Softkave</Logo>;
};

export default LogoBackground;

const Logo = styled.div({
    padding: "4px",
    backgroundColor: "#FFAB00",
    textTransform: "uppercase",
});

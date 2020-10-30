import styled from "@emotion/styled";
import React from "react";

const LogoBackground: React.FC<{}> = () => {
    return <Logo>Softkave</Logo>;
};

export default LogoBackground;

const Logo = styled.div({
    padding: "4px",
    backgroundColor: "#00B8D9",
    textTransform: "uppercase",
});

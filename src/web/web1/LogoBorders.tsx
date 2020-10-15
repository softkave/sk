import styled from "@emotion/styled";
import React from "react";

const LogoBorders: React.FC<{}> = () => {
    return <LogoContainer>Softkave</LogoContainer>;
};

export default LogoBorders;

const LogoContainer = styled.div({
    padding: "4px",
    border: "2px solid grey",
    textTransform: "uppercase",
    borderRight: "32px solid grey",
    display: "inline-block",
    fontWeight: "bold",
});

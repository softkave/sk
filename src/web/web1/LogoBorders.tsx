import styled from "@emotion/styled";
import React from "react";

const LogoBorders: React.FC<{}> = () => {
    return <LogoContainer>Softkave</LogoContainer>;
};

export default LogoBorders;

const LogoContainer = styled.div({
    padding: "4px",
    border: "2px solid black",
    textTransform: "uppercase",
    borderRight: "4px solid black",
});

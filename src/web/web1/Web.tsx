import styled from "@emotion/styled";
import React from "react";
import Bottom from "./Bottom";
import Face from "./Face";

const Web1: React.FC<{}> = () => {
    return (
        <StyledWeb>
            <Face />
            {/* <Middle /> */}
            {/* <Pricing /> */}
            <Bottom />
        </StyledWeb>
    );
};

export default Web1;

const StyledWeb = styled.div`
    min-height: 100%;
    height: 100%;
    background-color: #fafafa;
`;

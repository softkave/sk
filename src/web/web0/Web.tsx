import styled from "@emotion/styled";
import React from "react";
import WebBody from "./WebBody";
import WebFooter from "./WebFooter";
import WebHeader from "./WebHeader";

const Web: React.FC<{}> = () => {
    return (
        <StyledWeb>
            <WebHeader />
            <StyledWebBody>
                <WebBody />
            </StyledWebBody>
            <WebFooter />
        </StyledWeb>
    );
};

export default Web;

const StyledWeb = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100%;
    background-color: #fafafa;
`;

const StyledWebBody = styled.div`
    flex: 1;
    display: flex;
`;

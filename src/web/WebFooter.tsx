import MailOutlined from "@ant-design/icons/MailOutlined";
import styled from "@emotion/styled";
import React from "react";
import StyledContainer from "../components/styled/Container";

const WebFooter: React.SFC<{}> = () => {
    return (
        <StyledWebFooter>
            <StyledContainer s={{ width: "100%", flex: 1, margin: "auto" }}>
                <StyledContainer
                    s={{
                        flex: 1,
                    }}
                >
                    &copy;&nbsp;&nbsp;-&nbsp;&nbsp;Softkave&nbsp;&nbsp;-
                    &nbsp;&nbsp;
                    {new Date().getFullYear()}
                </StyledContainer>
                <StyledContainer>
                    <a
                        href="mailto:abayomi@softkave.com"
                        style={{ color: "rgba(0,0,0,0.65)", fontSize: "16px" }}
                    >
                        <MailOutlined />
                    </a>
                </StyledContainer>
            </StyledContainer>
        </StyledWebFooter>
    );
};

export default WebFooter;

const StyledWebFooter = styled.div`
    padding: 16px;
    text-align: center;
`;

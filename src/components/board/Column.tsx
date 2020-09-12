import styled from "@emotion/styled";
import React from "react";
import StyledContainer from "../styled/Container";

export interface IColumnProps {
    header?: React.ReactNode;
    body?: React.ReactNode;
    style?: React.CSSProperties;
}

const Column: React.FC<IColumnProps> = (props) => {
    const { header, body } = props;

    return (
        <StyledContainer
            s={{
                display: "flex",
                height: "100%",
                flexDirection: "column",
                boxSizing: "border-box",
                flex: 1,
                maxWidth: "320px",
                ...(props.style || {}),
            }}
        >
            {header && (
                <StyledColumnHeaderContainer>
                    {header}
                </StyledColumnHeaderContainer>
            )}
            {body}
        </StyledContainer>
    );
};

const StyledColumnHeaderContainer = styled.div`
    display: flex;
    flex-direction: row;
    padding-bottom: 12px;
    border-bottom: 1px solid #d9d9d9;
`;

export default React.memo(Column);

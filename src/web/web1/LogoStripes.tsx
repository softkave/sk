import styled from "@emotion/styled";
import React from "react";

const lineHeight = 22;

const LogoStripes: React.FC<{}> = () => {
    const softkave = "Softkave";
    let len = Math.floor(
        softkave.length * 2 + softkave.length * 2 * (10 / 100)
    );

    const backgroundBars: React.ReactNode[] = [];

    while (len > 0) {
        backgroundBars.push(<BackgroundBar />);
        len--;
    }

    return (
        <LogoContainer>
            <BackgroundBarContainer>{backgroundBars}</BackgroundBarContainer>
            <LogoText>{softkave}</LogoText>
        </LogoContainer>
    );
};

export default LogoStripes;

const BackgroundBar = styled.span({
    borderLeft: "2px solid black",
    height: lineHeight * 2,
});

const BackgroundBarContainer = styled.div({
    display: "flex",
    justifyContent: "space-between",
});

const LogoText = styled.div({
    position: "absolute",
    bottom: 0,
    left: 0,
    lineHeight: `${lineHeight}px`,
    textTransform: "uppercase",
});

const LogoContainer = styled.div({
    position: "relative",
});

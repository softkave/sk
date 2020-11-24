import React from "react";
import StyledContainer from "../styled/Container";
import { ComponentStyle } from "../types";

export interface ISpaceOutContent {
    node: React.ReactNode;
    style?: ComponentStyle;
    key?: string | number;
}

type SpaceOutAlign = "start" | "end" | "center" | "baseline";
type SpaceOutSize = "small" | "middle" | "large" | number;

export interface ISpaceOutProps {
    className?: string;
    style?: ComponentStyle;
    size?: SpaceOutSize;
    direction?: "horizontal" | "vertical";
    align?: SpaceOutAlign;
    split?: React.ReactNode;
    content: ISpaceOutContent[];
}

const kFlexStart = "flex-start";
const kFlexEnd = "flex-end";
const kCenter = "center";

function spaceOutAlignToFlexAlign(
    align?: SpaceOutAlign
): React.CSSProperties["alignItems"] {
    switch (align) {
        case "start":
            return kFlexStart;

        case "end":
            return kFlexEnd;

        case "center":
        case "baseline":
            return align;

        default:
            return kCenter;
    }
}

const kMargin8 = 8;
const kMargin16 = 16;
const kMargin32 = 32;

function spaceOutSizeToCSSSize(
    size?: SpaceOutSize
): React.CSSProperties["marginRight"] {
    if (typeof size === "number") {
        return size;
    }

    switch (size) {
        case "small":
            return kMargin8;

        case "middle":
            return kMargin16;

        case "large":
            return kMargin32;

        default:
            return kMargin8;
    }
}

const SpaceOut: React.FC<ISpaceOutProps> = (props) => {
    const { className, style, size, direction, align, split, content } = props;

    const containerStyle: ComponentStyle = {
        flexDirection: direction === "vertical" ? "column" : "row",
        alignItems: spaceOutAlignToFlexAlign(align),
        ...(style || {}),
    };

    return (
        <StyledContainer className={className} s={containerStyle}>
            {content.map((item, index) => {
                const isNotLastItem = index < content.length - 1;
                let nodeStyle: ComponentStyle = item.style || {};

                if (isNotLastItem) {
                    nodeStyle = {
                        marginRight: spaceOutSizeToCSSSize(size),
                        ...nodeStyle,
                    };
                }

                return (
                    <React.Fragment key={item.key || index}>
                        <StyledContainer s={nodeStyle}>
                            {item.node}
                        </StyledContainer>
                        {isNotLastItem && split ? split : null}
                    </React.Fragment>
                );
            })}
        </StyledContainer>
    );
};

export default SpaceOut;

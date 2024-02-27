import React from "react";

type SpaceOutAlign = "start" | "end" | "center" | "baseline";
type SpaceOutSize = "small" | "middle" | "large" | number;
export interface ISpaceOutContent {
  node: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  key?: string | number;
}

export interface ISpaceOutProps {
  className?: string;
  style?: React.CSSProperties;
  size?: SpaceOutSize;
  direction?: "horizontal" | "vertical";
  align?: SpaceOutAlign;
  split?: React.ReactNode;
  content: ISpaceOutContent[];
}

const kFlexStart = "flex-start";
const kFlexEnd = "flex-end";
const kCenter = "center";
const kMargin8 = 8;
const kMargin16 = 16;
const kMargin32 = 32;

function spaceOutAlignToFlexAlign(align?: SpaceOutAlign): React.CSSProperties["alignItems"] {
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

function spaceOutSizeToCSSSize(size?: SpaceOutSize): React.CSSProperties["marginRight"] {
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
  const containerStyle: React.CSSProperties = {
    // @ts-ignore
    flexDirection: direction === "vertical" ? "column" : "row",
    // @ts-ignore
    alignItems: spaceOutAlignToFlexAlign(align),
    display: "flex",
    ...(style || {}),
  };

  return (
    <div className={className} style={containerStyle}>
      {content.map((item, index) => {
        const isNotLastItem = index < content.length - 1;
        let nodeStyle: React.CSSProperties = item.style || {};

        if (isNotLastItem) {
          nodeStyle = {
            marginRight: spaceOutSizeToCSSSize(size),
            ...nodeStyle,
          };
        }

        return (
          <React.Fragment key={item.key || index}>
            <div style={nodeStyle} className={item.className}>
              {item.node}
            </div>
            {isNotLastItem && split ? split : null}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default SpaceOut;

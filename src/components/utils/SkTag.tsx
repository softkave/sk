import { css, cx } from "@emotion/css";
import { Tag, TagProps } from "antd";
// import colorLib from "color";
import { defaultTo } from "lodash";
import React from "react";

export interface ISkTagProps extends TagProps {
  doNotLightenColor?: boolean;
  centerContent?: boolean;
}

const classes = {
  centerContent: css({
    display: "inline-flex !important",
    alignItems: "center",
  }),
};

const SkTag: React.FC<ISkTagProps> = (props) => {
  const { color, style, doNotLightenColor, centerContent, ...otherProps } = props;
  let tagStyle: React.CSSProperties | undefined = style;
  let tagColor = color;
  if (color && !doNotLightenColor) {
    tagColor = undefined;
    tagStyle = {
      ...defaultTo(style, {}),
      color,
      // backgroundColor: colorLib(color).lighten(1).string(),
    };
  }

  return (
    <Tag
      {...otherProps}
      style={tagStyle}
      color={tagColor}
      className={cx({ [classes.centerContent]: centerContent })}
    />
  );
};

export default SkTag;

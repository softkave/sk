import { css } from "@emotion/css";
import { Button, Space } from "antd";
import React from "react";

export interface IIconLinkProps {
  icon: React.ReactNode;
  text: string;
  href: string;
  style?: React.CSSProperties;
}

const classes = {
  link: css({
    color: "black",
  }),
};

const IconLink: React.FC<IIconLinkProps> = (props) => {
  const { icon, text, href, style } = props;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={style} className={classes.link}>
      <Space>
        <Button style={{ cursor: "pointer" }} className="icon-btn">
          {icon}
        </Button>
        {text}
      </Space>
    </a>
  );
};

export default IconLink;

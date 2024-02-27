import { css } from "@emotion/css";
import { Typography } from "antd";
import React from "react";
import { Link } from "react-router-dom";

const classes = {
  link: css({
    marginRight: "6px",
    color: "white",
    borderRadius: "4px",
    padding: "2px 8px",
    marginBottom: "4px",

    "&:last-of-type": {
      marginRight: 0,
    },

    "&:hover": {
      color: "white",
    },
  }),
};

export interface IFaceLinkProps {
  to: string;
  text: string;
  style?: React.CSSProperties;
}

const FaceLink: React.FC<IFaceLinkProps> = (props) => {
  const { to, text, style } = props;
  return (
    <Link to={to} style={style} className={classes.link}>
      <Typography.Text style={{ color: "inherit" }}>{text}</Typography.Text>
    </Link>
  );
};

export default FaceLink;

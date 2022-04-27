import { css, cx } from "@emotion/css";
import React from "react";

export interface IColumnProps {
  header?: React.ReactNode;
  body?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

const classes = {
  root: css({
    display: "grid",
    gridTemplateColumns: "1fr",
    gridTemplateRows: "auto 1fr",
    height: "100%",
    boxSizing: "border-box",
    flex: 1,
    // maxWidth: "320px",
  }),
  header: css(`
  display: flex;
  flex-direction: row;
  margin-bottom: 16px;
`),
};

const Column: React.FC<IColumnProps> = (props) => {
  const { header, body, style, className } = props;

  return (
    <div style={style} className={cx(classes.root, className)}>
      {header && <div className={classes.header}>{header}</div>}
      {body}
    </div>
  );
};

export default React.memo(Column);

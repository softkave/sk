import { css, cx } from "@emotion/css";
import styled from "@emotion/styled";
import React from "react";

export interface IColumnProps {
  header?: React.ReactNode;
  body?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

const classes = {
  root: css({
    display: "flex",
    height: "100%",
    flexDirection: "column",
    boxSizing: "border-box",
    flex: 1,
    maxWidth: "320px",
  }),
};

const Column: React.FC<IColumnProps> = (props) => {
  const { header, body, style, className } = props;

  return (
    <div style={style} className={cx(classes.root, className)}>
      {header && (
        <StyledColumnHeaderContainer>{header}</StyledColumnHeaderContainer>
      )}
      {body}
    </div>
  );
};

const StyledColumnHeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 16px;
`;

export default React.memo(Column);

import { css } from "@emotion/css";
import React from "react";

export interface IWebCardProps {
  title: React.ReactNode;
  children?: React.ReactNode;
}

const WebCard: React.FC<IWebCardProps> = (props) => {
  const { title, children } = props;
  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        width: "100%",
        padding: "12px",
        maxWidth: "300px",
      })}
    >
      <div>{title}</div>
      <div
        className={css({
          display: "flex",
          justifyContent: "center",
          flex: 1,
          marginTop: "12px",
        })}
      >
        {children}
      </div>
    </div>
  );
};

export default WebCard;

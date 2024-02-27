import { css } from "@emotion/css";
import React from "react";
import Bottom from "./Bottom";
import Face from "./Face";

const Web1: React.FC<{}> = () => {
  return (
    <div
      className={css({
        minHeight: "100vh",
        height: "100%",
      })}
    >
      <Face />
      <Bottom />
    </div>
  );
};

export default Web1;

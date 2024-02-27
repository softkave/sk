import { css } from "@emotion/css";
import React from "react";

const wrapMenu = (menu: React.ReactNode) => {
  return <div className={css({ "& ul": { borderRight: 0 } })}>{menu}</div>;
};

export default wrapMenu;

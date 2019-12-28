import styled from "@emotion/styled";
import { Menu } from "antd";
import { getWindowWidth } from "../../utils/window";

const StyledDrawerMenu = styled(Menu)(() => {
  const windowWidth = getWindowWidth();
  const maxMenuWidth = 500;
  const maxMenuHeight = 400;

  return {
    marginTop: "8px",
    width: windowWidth <= maxMenuWidth ? windowWidth : maxMenuWidth,
    maxHeight: maxMenuHeight,
    overflow: "auto"
  };
});

export default StyledDrawerMenu;

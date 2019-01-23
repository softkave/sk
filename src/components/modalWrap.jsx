import React from "react";
import { Drawer } from "antd";
import { getWindowWidth } from "../utils/window";

export default function modalWrap(component) {
  function ModalWrappedComponent(props) {
    const WrappedComponent = component;
    const { visible, onClose } = props;
    const windowWidth = getWindowWidth();
    let drawerWidth =
      windowWidth / (windowWidth < 500 ? 1 : windowWidth < 900 ? 2 : 3);

    if (!visible) {
      return null;
    }

    return (
      <Drawer visible={visible} onClose={onClose} width={drawerWidth}>
        <WrappedComponent {...props} />
      </Drawer>
    );
  }

  ModalWrappedComponent.displayName = `modalWrap(${component.displayName ||
    component.name ||
    "Component"})`;

  return ModalWrappedComponent;
}

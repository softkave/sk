import React from "react";
import { Drawer } from "antd";
import throttle from "lodash/throttle";

import { getWindowWidth } from "../utils/window";

export default function modalWrap(component, defaultTitle, { className } = {}) {
  class ModalWrappedComponent extends React.Component {
    constructor(props) {
      super(props);
      this.updateWindowData();
      this.updateWindowData = throttle(this.updateWindowData, 300);

      this.state = {
        currentDeviceWidth: getWindowWidth()
      };
    }

    componentDidMount() {
      window.addEventListener("resize", this.updateWindowData);
      this.modalIsMounted = true;
    }

    componentWillUnmount() {
      window.removeEventListener("resize", this.updateWindowData);
      this.modalIsMounted = false;
    }

    updateWindowData = () => {
      if (this.modalIsMounted) {
        this.setState({ currentDeviceWidth: getWindowWidth() });
      }
    };

    render() {
      const WrappedComponent = component;
      const { visible, onClose, title } = this.props;
      const { currentDeviceWidth } = this.state;
      // const windowWidth = getWindowWidth();
      const windowWidth = currentDeviceWidth;
      const divider = windowWidth <= 500 ? 1 : windowWidth <= 700 ? 3 / 2 : 2;
      // : windowWidth <= 1020
      // ? 2
      // : 3;
      let drawerWidth = windowWidth / divider;

      if (!visible) {
        return null;
      }

      return (
        <Drawer
          className={className}
          visible={visible}
          onClose={onClose}
          width={drawerWidth}
          title={title || defaultTitle}
        >
          <WrappedComponent {...this.props} />
        </Drawer>
      );
    }
  }

  ModalWrappedComponent.displayName = `modalWrap(${component.displayName ||
    component.name ||
    "Component"})`;

  return ModalWrappedComponent;
}

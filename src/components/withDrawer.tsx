import { Drawer } from "antd";
import throttle from "lodash/throttle";
import React from "react";
import cast from "../utils/cast";
import { getWindowWidth } from "../utils/window";

export interface IDrawerWrapperProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
}

interface IDrawerWrapperState {
  currentDeviceWidth: number;
}

// export interface IWithDrawerConfirmCloseResult {
//   canClose: boolean;
//   message?: React.ReactNode;
// }

// export interface IWithDrawerConfirmCloseProps {
//   ref: React.RefObject<any>;
// }

export interface IWithDrawerProps {
  className?: string;
  // confirmClose?: (props: IWithDrawerConfirmCloseProps) => IWithDrawerConfirmCloseResult;
  // passProps?: () => any;
}

export default function withDrawer<
  ComponentType extends React.FunctionComponent<any> | React.ComponentClass<any>
>(
  component: ComponentType,
  defaultTitle: React.ReactNode = "",
  options: IWithDrawerProps = {}
) {
  type ComponentProps = React.ComponentPropsWithRef<typeof component>;
  type FinalWrappedComponentProps = IDrawerWrapperProps & ComponentProps;
  type RefType = React.RefObject<ComponentType> | React.Ref<ComponentType>;

  class ModalWrapperComponent extends React.Component<
    FinalWrappedComponentProps & { forwardedRef: RefType },
    IDrawerWrapperState
  > {
    private drawerIsMounted = false;
    // private componentRef: React.RefObject<any> = React.createRef();

    constructor(props) {
      super(props);
      this.updateWindowData();
      this.updateWindowData = throttle(this.updateWindowData, 300);

      this.state = {
        currentDeviceWidth: getWindowWidth(),
      };
    }

    public componentDidMount() {
      window.addEventListener("resize", this.updateWindowData);
      this.drawerIsMounted = true;
    }

    public componentWillUnmount() {
      window.removeEventListener("resize", this.updateWindowData);
      this.drawerIsMounted = false;
    }

    public render() {
      const { forwardedRef, ...rest } = this.props;
      const { visible, onClose, title } = rest;
      const { currentDeviceWidth } = this.state;
      const windowWidth = currentDeviceWidth;
      const divider = windowWidth <= 500 ? 1 : windowWidth <= 700 ? 1 / 3 : 2;
      const maxDrawerWidth = 500;
      let drawerWidth = windowWidth / divider;
      drawerWidth = drawerWidth > maxDrawerWidth ? maxDrawerWidth : drawerWidth;

      if (!visible) {
        return null;
      }

      return (
        <Drawer
          closable={false}
          className={options.className}
          visible={visible}
          onClose={onClose}
          width={drawerWidth}
          title={title || defaultTitle}
        >
          {React.createElement(component, {
            ...rest,
            ref: forwardedRef,
          })}
        </Drawer>
      );
    }

    private updateWindowData = () => {
      if (this.drawerIsMounted) {
        this.setState({ currentDeviceWidth: getWindowWidth() });
      }
    };
  }

  const displayName = `withModal(${
    component.displayName || component.name || "Component"
  })`;

  cast<React.FunctionComponent>(
    ModalWrapperComponent
  ).displayName = displayName;

  function forwardRef(props: FinalWrappedComponentProps, ref: RefType) {
    return <ModalWrapperComponent {...props} forwardedRef={ref} />;
  }

  forwardRef.displayName = displayName;
  return React.forwardRef(forwardRef);
}

import { Drawer, Modal } from "antd";
import { DrawerProps } from "antd/lib/drawer";
import { ModalProps } from "antd/lib/modal";
import throttle from "lodash/throttle";
import React from "react";
import cast from "../utils/cast";
import { getWindowWidth } from "../utils/window";

export enum WithDrawerType {
  Drawer = "drawer",
  Modal = "modal",
}

const windowResizeThrottleSpeedMs = 300;

export interface IDrawerWrapperProps extends Partial<DrawerProps & ModalProps> {
  type?: WithDrawerType;
}

interface IDrawerWrapperState {
  currentDeviceWidth: number;
}

export interface IWithDrawerProps extends Partial<DrawerProps & ModalProps> {
  type?: WithDrawerType;
}

export default function withDrawer<
  ComponentType extends React.FunctionComponent<any> | React.ComponentClass<any>
>(
  component: ComponentType,
  options: IWithDrawerProps = {
    type: WithDrawerType.Drawer,
    closable: false,
    footer: null,
  }
) {
  type ComponentProps = React.ComponentPropsWithRef<typeof component>;
  type WrapperProps = IDrawerWrapperProps & ComponentProps;
  type RefType = React.RefObject<ComponentType> | React.Ref<ComponentType>;

  class Wrapper extends React.Component<
    WrapperProps & { forwardedRef: RefType },
    IDrawerWrapperState
  > {
    private drawerIsMounted = false;

    constructor(props) {
      super(props);
      this.updateWindowData = throttle(
        this.updateWindowData,
        windowResizeThrottleSpeedMs
      );

      this.state = {
        currentDeviceWidth: getWindowWidth(),
      };
    }

    public componentDidMount() {
      this.setupListeners();
      this.drawerIsMounted = true;
    }

    public componentWillUnmount() {
      this.teardownListeners();
      this.drawerIsMounted = false;
    }

    public render() {
      const { visible, type } = this.props;

      if (!visible) {
        return null;
      }

      switch (type) {
        case WithDrawerType.Drawer:
          return this.renderDrawer();

        case WithDrawerType.Modal:
          return this.renderModal();

        default:
          return null;
      }
    }

    private updateWindowData = () => {
      if (this.drawerIsMounted) {
        this.setState({ currentDeviceWidth: getWindowWidth() });
      }
    };

    private setupListeners() {
      const { type } = this.props;

      if (type === WithDrawerType.Drawer) {
        window.addEventListener("resize", this.updateWindowData);
      }
    }

    private teardownListeners() {
      window.removeEventListener("resize", this.updateWindowData);
    }

    private renderWrappedComponent() {
      const { forwardedRef, ...rest } = this.props;

      return React.createElement<any>(component, {
        ...rest,
        ref: forwardedRef,
      });
    }

    private renderDrawer() {
      const { currentDeviceWidth } = this.state;
      const windowWidth = currentDeviceWidth;
      const divider = windowWidth <= 500 ? 1 : windowWidth <= 700 ? 1 / 3 : 2;
      const maxDrawerWidth = 500;
      let drawerWidth = windowWidth / divider;
      drawerWidth = drawerWidth > maxDrawerWidth ? maxDrawerWidth : drawerWidth;

      return (
        <Drawer {...this.props} width={drawerWidth}>
          {this.renderWrappedComponent()}
        </Drawer>
      );
    }

    private renderModal() {
      return <Modal {...this.props}>{this.renderWrappedComponent()}</Modal>;
    }
  }

  const displayName = `withDrawer(${
    component.displayName || component.name || "Component"
  })`;

  cast<React.ComponentClass>(Wrapper).displayName = displayName;
  cast<React.ComponentClass>(Wrapper).defaultProps = options;

  function forwardRef(props: WrapperProps, ref: RefType) {
    return <Wrapper {...props} forwardedRef={ref} />;
  }

  forwardRef.displayName = displayName;
  return React.forwardRef(forwardRef);
}

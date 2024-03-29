import { css } from "@emotion/css";
import React, { ForwardRefRenderFunction, MutableRefObject } from "react";
import Scrollbars, { ScrollbarProps } from "react-custom-scrollbars";
import userAgent from "../userAgent";

export interface IAppScrollbarProps extends ScrollbarProps {
  children: React.ReactNode;
}

export type ScrollbarMethods = Omit<Scrollbars, keyof React.Component<ScrollbarProps>> | undefined;

const nativeScrollbars = ["mobile", "tablet"];
const WINDOWS = "windows";
const classes = {
  root: css({
    flex: 1,
    overflow: "auto",
    flexDirection: "column",
    width: "100%",
  }),
};

function isScrollbar(ref: Scrollbars | HTMLDivElement): ref is Scrollbars {
  // @ts-ignore
  return ref.getValues !== undefined;
}

const ScrollbarRenderFn: ForwardRefRenderFunction<ScrollbarMethods, IAppScrollbarProps> = (
  props,
  ref
) => {
  const { children } = props;
  const containerRef = React.useRef<HTMLDivElement | Scrollbars>();
  const deviceType = userAgent.getDevice().type;
  const operatingSystemName = userAgent.getOS().name;
  React.useImperativeHandle(ref, () => getMethods(containerRef));
  const useCustomScrollbar = React.useMemo(() => {
    if (operatingSystemName && operatingSystemName.toLowerCase() === WINDOWS) {
      return true;
    } else if (deviceType && nativeScrollbars.includes(deviceType)) {
      return false;
    }

    return true;
  }, [deviceType, operatingSystemName]);

  if (useCustomScrollbar) {
    return (
      <Scrollbars
        autoHide
        {...props}
        // @ts-ignore
        ref={containerRef}
      >
        {children}
      </Scrollbars>
    );
  } else {
    return (
      <div
        // @ts-ignore
        ref={containerRef}
        className={classes.root}
      >
        {children}
      </div>
    );
  }
};

const Scrollbar = React.forwardRef(ScrollbarRenderFn);
export default Scrollbar;

const getMethods = (containerRef: MutableRefObject<Scrollbars | HTMLDivElement | undefined>) => {
  if (containerRef.current) {
    // @ts-ignore
    if (isScrollbar(containerRef.current)) {
      return containerRef.current;
    }

    return {
      scrollTop: (top: number) => {
        if (!containerRef.current) {
          return;
        }

        containerRef.current.scrollTop = top;
      },
      scrollLeft: (left: number) => {
        if (!containerRef.current) {
          return;
        }

        containerRef.current.scrollLeft = left;
      },
      scrollToTop: () => {
        if (!containerRef.current) {
          return;
        }

        containerRef.current.scrollTop = 0;
      },
      scrollToBottom: () => {
        if (!containerRef.current) {
          return;
        }

        containerRef.current.scrollTop = (containerRef.current as HTMLDivElement).scrollHeight;
      },
      scrollToLeft: () => {
        if (!containerRef.current) {
          return;
        }

        (containerRef.current as HTMLDivElement).scrollLeft = 0;
      },
      scrollToRight: () => {
        if (!containerRef.current) {
          return;
        }

        containerRef.current.scrollLeft = (containerRef.current as HTMLDivElement).scrollWidth;
      },
      getScrollLeft: () => {
        if (!containerRef.current) {
          return 0;
        }

        return (containerRef.current as HTMLDivElement).scrollLeft as number;
      },
      getScrollTop: () => {
        if (!containerRef.current) {
          return 0;
        }

        return (containerRef.current as HTMLDivElement).scrollTop as number;
      },
      getScrollWidth: () => {
        if (!containerRef.current) {
          return 0;
        }

        return (containerRef.current as HTMLDivElement).scrollWidth;
      },
      getScrollHeight: () => {
        if (!containerRef.current) {
          return 0;
        }

        return (containerRef.current as HTMLDivElement).scrollHeight;
      },
      getClientWidth: () => {
        if (!containerRef.current) {
          return 0;
        }

        return (containerRef.current as HTMLDivElement).clientWidth;
      },
      getClientHeight: () => {
        if (!containerRef.current) {
          return 0;
        }

        return (containerRef.current as HTMLDivElement).clientHeight;
      },
      getValues: () => {
        const { scrollLeft, scrollTop, scrollWidth, scrollHeight, clientWidth, clientHeight } =
          (containerRef.current as HTMLDivElement) || {};

        return {
          left: (scrollLeft as number) / (scrollWidth - clientWidth) || 0,
          top: (scrollTop as number) / (scrollHeight - clientHeight) || 0,
          scrollLeft: (scrollLeft as number) || 0,
          scrollTop: (scrollTop as number) || 0,
          scrollWidth: (scrollWidth as number) || 0,
          scrollHeight: (scrollHeight as number) || 0,
          clientWidth: (clientWidth as number) || 0,
          clientHeight: (clientHeight as number) || 0,
        };
      },
    };
  }
};

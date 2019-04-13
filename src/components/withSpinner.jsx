import React from "react";
import { Spin, Icon } from "antd";

export default function withSpinner(component) {
  const Component = component;
  const displayName = `withSpinner(${component.displayName ||
    component.name ||
    "Component"})`;

  class WithSpinner extends React.Component {
    visible = null;
    state = {
      spinning: false
    };

    componentDidMount() {
      this.visible = true;
    }

    componentDidUpdate() {
      this.visible = true;
    }

    componentWillUnmount() {
      this.visible = false;
    }

    toggleSpinning = () => {
      if (this.visible) {
        this.setState(state => {
          return {
            spinning: !state.spinning
          };
        });
      }
    };

    render() {
      const { spinning } = this.state;
      const { forwardedRef } = this.props;

      return (
        <Spin
          spinning={spinning}
          indicator={<Icon type="loading" style={{ fontSize: "2em" }} />}
        >
          <Component
            {...this.props}
            toggleSpinning={this.toggleSpinning}
            ref={forwardedRef}
          />
        </Spin>
      );
    }
  }

  function forwardRef(props, ref) {
    return <WithSpinner {...props} forwardedRef={ref} ref={props.spinnerRef} />;
  }

  WithSpinner.displayName = displayName;
  forwardRef.displayName = displayName;
  return React.forwardRef(forwardRef);
}

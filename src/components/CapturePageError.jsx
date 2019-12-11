import React from "react";
import { Row, Col, Button } from "antd";

export default class CapturePageError extends React.Component {
  state = {
    error: null
  };

  componentDidCatch(error) {
    this.setState({ error });
  }

  clearError = () => {
    this.setState({ error: null });
  };

  render() {
    const { error } = this.state;
    const { children } = this.props;
    const smallDeviceLayout = {
      span: 22,
      offset: 1
    };

    const mediumDeviceLayout = {
      span: 12,
      offset: 6
    };

    if (error) {
      return (
        <Row type="flex" justify="middle" align="center">
          <Col
            xs={smallDeviceLayout}
            sm={smallDeviceLayout}
            md={mediumDeviceLayout}
          >
            <h1>An error ocurred while loading the page, please try again.</h1>
            <Button icon="refresh" onClick={this.clearError}>
              Reload
            </Button>
          </Col>
        </Row>
      );
    }

    return <>{children}</>;
  }
}

import React from "react";
import dotProp from "dot-prop-immutable";
import { Row, Col, Button } from "antd";
import CollaborationRequestEntryForm from "./CollaborationRequestEntryForm";
import CollaborationRequestEntryThumbnail from "./CollaborationRequestEntryThumbnail";
import withForm from "../form/withForm";

const CollaborationRequestEntryWithForm = withForm(
  CollaborationRequestEntryForm
);

export default class CollaborationRequestForm extends React.Component {
  state = {
    requests: [],
    editing: {}
  };

  isEditing(email) {
    return !!this.state.editing[email];
  }

  getEditingRequestRef(email) {
    return this.isEditing(email) && this.state.editing[email].ref;
  }

  getRequestIndex(email) {
    return requests.findIndex(nextRequest => nextRequest.email === email);
  }

  onSubmitRequest = (request, prev) => {
    const { requests, editing } = this.state;
    const requestIndex = this.getRequestIndex(prev.email);
    const updatedRequests = dotProp.set(requests, requestIndex, request);
    const updatedEditing = dotProp.delete(editing, prev.email);
    this.setState({ requests: updatedRequests, editing: updatedEditing });
  };

  onEditRequest = request => {
    const { editing } = this.state;
    const updatedEditing = dotProp.set(editing, request.email, {
      ref: React.createRef()
    });

    this.setState({ editing: updatedEditing });
  };

  onDeleteRequest = request => {
    const { editing, requests } = this.state;
    const requestIndex = this.getRequestIndex(request.email);
    const updatedRequests = dotProp.delete(requests, requestIndex);
    const updatedEditing = dotProp.delete(editing, request.email);
    this.setState({ requests: updatedRequests, editing: updatedEditing });
  };

  onAddNewRequest = () => {
    const { editing, requests } = this.state;
    const updatedRequests = [...requests];
    updatedRequests.push({});
    const updatedEditing = dotProp.set(editing, request.email, {
      ref: React.createRef()
    });

    this.setState({ editing: updatedEditing, requests: updatedRequests });
  };

  onSendRequests = async () => {
    try {
      const { onSubmit } = this.props;
      const { requests } = this.state;
      let data = requests.map(request => {
        if (this.isEditing(request.email)) {
          const ref = this.getEditingRequestRef(request.email);
          return ref.getFormData();
        } else {
          return Promise.resolve(request);
        }
      });

      data = await Promise.all(data);

      if (onSubmit) {
        onSubmit(data);
      }
    } catch (error) {
      // Do nothing
    }
  };

  render() {
    const { requests } = this.state;
    const renderedRequests = requests.map(request => {
      if (this.isEditing(request.email)) {
        return (
          <CollaborationRequestEntryWithForm
            key={request.email}
            ref={this.getEditingRequestRef(request.email)}
            request={request}
            onDelete={() => this.onDeleteRequest(request)}
            onSubmit={updatedRequest =>
              this.onSubmitRequest(updatedRequest, request)
            }
          />
        );
      } else {
        return (
          <CollaborationRequestEntryThumbnail
            key={request.email}
            request={request}
            onEdit={() => this.onEditRequest(request)}
            onDelete={() => this.onDeleteRequest(request)}
          />
        );
      }
    });

    return (
      <div>
        {renderedRequests}
        <Row gutter={16}>
          <Col span={12}>
            <Button type="dashed" icon="plus" onClick={this.onAddNewRequest}>
              Add New
            </Button>
          </Col>
          <Col span={12}>
            <Button type="primary" onClick={this.onSendRequests}>
              Send Requests
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

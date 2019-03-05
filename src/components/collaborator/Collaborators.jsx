import React from "react";
import CollaboratorThumbnail from "./Thumnail.jsx";
import { List, Button, Tabs } from "antd";
import AddCollaborator from "./AddCollaborator.jsx";
import { canPerformAction } from "../../models/acl";
import "./collaborators.css";

export default class Collaborators extends React.Component {
  state = {
    showForm: false
  };

  toggleCollaboratorForm = () => {
    this.setState(prevState => {
      return {
        showForm: !prevState.showForm
      };
    });
  };

  renderList(items, renderItem) {
    return (
      <List
        dataSource={items}
        renderItem={renderItem}
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 3,
          lg: 4
        }}
      />
    );
  }

  renderCollaborators(collaborators = []) {
    return this.renderList(collaborators, c => {
      return (
        <List.Item key={c.id}>
          <CollaboratorThumbnail collaborator={c} />
        </List.Item>
      );
    });
  }

  renderCollaborationRequests(collaborationRequests = []) {
    return this.renderList(collaborationRequests, c => {
      return (
        <List.Item key={c.id}>
          <CollaboratorThumbnail collaborator={c} labelPropName="email" />
        </List.Item>
      );
    });
  }

  render() {
    const {
      collaborators,
      permissions,
      onBack,
      roles,
      onAddCollaborators,
      collaborationRequests
    } = this.props;
    const { showForm } = this.state;

    return (
      <div className="sk-collaborators">
        <AddCollaborator
          roles={roles}
          onSubmit={collaborators => {
            onAddCollaborators(collaborators);
            this.toggleCollaboratorForm();
          }}
          visible={showForm}
          onClose={this.toggleCollaboratorForm}
        />
        <div className="sk-collaborators-btns">
          <Button icon="arrow-left" onClick={onBack} />
          {canPerformAction(permissions, "collaboration", "send-request") && (
            <Button
              icon="plus"
              onClick={this.toggleCollaboratorForm}
              style={{ marginLeft: "1em" }}
            >
              Add collaborator
            </Button>
          )}
        </div>
        <div className="sk-collaborators-content">
          <Tabs>
            <Tabs.TabPane tab="Collaborators" key="collaborators">
              {this.renderCollaborators(collaborators)}
            </Tabs.TabPane>
            <Tabs.TabPane
              tab="Collaboration Requests"
              key="collaboration-requests"
            >
              {this.renderCollaborationRequests(collaborationRequests)}
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

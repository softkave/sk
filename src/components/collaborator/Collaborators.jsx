import React from "react";
import CollaboratorThumbnail from "./Thumnail.jsx";
import { List, Button, Tabs } from "antd";
import AddCollaborator from "./AddCollaborator.jsx";
import { canPerformAction } from "../../models/block/acl";
import CollaboratorForm from "./CollaboratorForm";
import "./collaborators.css";

export default class Collaborators extends React.Component {
  state = {
    showAddCollaboratorForm: false,
    showCollaborator: null
  };

  toggleCollaboratorForm = () => {
    this.setState(prevState => {
      return {
        showAddCollaboratorForm: !prevState.showAddCollaboratorForm
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
        style={{ alignItems: "flex-start" }}
      />
    );
  }

  renderCollaborators(collaborators = []) {
    return this.renderList(collaborators, c => {
      return (
        <List.Item key={c.id}>
          <CollaboratorThumbnail
            collaborator={c}
            onClick={() => {
              this.setState({ showCollaborator: c });
            }}
          />
        </List.Item>
      );
    });
  }

  renderCollaborationRequests(collaborationRequests = []) {
    return this.renderList(collaborationRequests, c => {
      return (
        <List.Item key={c.id}>
          <CollaboratorThumbnail collaborator={c} />
        </List.Item>
      );
    });
  }

  render() {
    const {
      collaborators,
      permissions,
      onBack,
      onAddCollaborators,
      collaborationRequests,
      block,
      roles,
      onUpdateCollaborator
    } = this.props;
    const { showAddCollaboratorForm, showCollaborator } = this.state;

    return (
      <div className="sk-collaborators">
        <CollaboratorForm
          visible={!!showCollaborator}
          onClose={this.toggleBenchForm}
          collaborator={showCollaborator}
          onSubmit={data => {
            onUpdateCollaborator(showCollaborator, data);
            this.setState({ showCollaborator: null });
          }}
          roles={roles}
          block={block}
        />
        <AddCollaborator
          onSubmit={data => {
            onAddCollaborators(data);
            this.toggleCollaboratorForm();
          }}
          visible={showAddCollaboratorForm}
          onClose={this.toggleCollaboratorForm}
          existingCollaborators={collaborators}
          existingCollaborationRequests={collaborationRequests}
        />
        <div className="sk-collaborators-header">
          <Button icon="arrow-left" onClick={onBack} />
          {canPerformAction(block, permissions, "SEND_REQUEST") && (
            <Button
              icon="plus"
              onClick={this.toggleCollaboratorForm}
              style={{ marginLeft: "1em" }}
            >
              Add collaborator
            </Button>
          )}
          <span className="sk-gl-block-name">{block.name}</span>
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

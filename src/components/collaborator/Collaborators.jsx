import React from "react";
import { List, Button, Tabs } from "antd";

import CollaboratorThumbnail from "./Thumnail.jsx";
// import AddCollaborator from "./AddCollaborator.jsx";
import "./collaborators.css";
import AC from "./AC";

export default class Collaborators extends React.Component {
  state = {
    showAddCollaboratorForm: false
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
        <List.Item key={c.customId}>
          <CollaboratorThumbnail collaborator={c} />
        </List.Item>
      );
    });
  }

  renderCollaborationRequests(collaborationRequests = []) {
    return this.renderList(collaborationRequests, c => {
      return (
        <List.Item key={c.customId}>
          <CollaboratorThumbnail collaborator={c} />
        </List.Item>
      );
    });
  }

  render() {
    const {
      collaborators,
      onBack,
      onAddCollaborators,
      collaborationRequests,
      block,
      error
    } = this.props;
    const { showAddCollaboratorForm } = this.state;

    if (error) {
      return (
        <React.Fragment>
          <p style={{ color: "red" }}>{error.message || "An error occurred"}</p>
          <p>Please reload the page</p>
        </React.Fragment>
      );
    }

    return (
      <div className="sk-collaborators">
        <AC
          visible={showAddCollaboratorForm}
          onClose={this.toggleCollaboratorForm}
          existingCollaborators={collaborators}
          existingCollaborationRequests={collaborationRequests}
          onSendRequests={async data => {
            await onAddCollaborators(data);
            this.toggleCollaboratorForm();
          }}
        />
        {/* <AddCollaborator
          onSubmit={data => {
            onAddCollaborators(data);
            this.toggleCollaboratorForm();
          }}
          visible={showAddCollaboratorForm}
          onClose={this.toggleCollaboratorForm}
          existingCollaborators={collaborators}
          existingCollaborationRequests={collaborationRequests}
        /> */}
        <div className="sk-collaborators-header">
          <Button icon="arrow-left" onClick={onBack} />
          <Button
            icon="plus"
            onClick={this.toggleCollaboratorForm}
            style={{ marginLeft: "1em" }}
          >
            Add Collaborator
          </Button>
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

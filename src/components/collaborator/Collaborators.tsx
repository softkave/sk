import { Button, List, Tabs } from "antd";
import React from "react";

import { IBlock } from "../../models/block/block.js";
import { IUser } from "../../models/user/user.js";
import AC, { IACValue } from "./AC";
import "./collaborators.css";
import CollaboratorThumbnail from "./Thumnail.jsx";

export interface ICollaboratorsProps {
  // TODO: Define collaborators' right type
  collaborators: IUser[];

  // TODO: Define type
  collaborationRequests: any[];
  block: IBlock;
  error?: Error;
  onBack: () => void;
  onAddCollaborators: (values: IACValue) => void;
}

interface ICollaboratorsState {
  showAddCollaboratorForm: boolean;
}

export default class Collaborators extends React.Component<
  ICollaboratorsProps,
  ICollaboratorsState
> {
  public state = {
    showAddCollaboratorForm: false
  };

  public toggleCollaboratorForm = () => {
    this.setState(prevState => {
      return {
        showAddCollaboratorForm: !prevState.showAddCollaboratorForm
      };
    });
  };

  public renderList(items, renderItem) {
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

  // TODO: Define type
  public renderCollaborators(collaborators: any[] = []) {
    return this.renderList(collaborators, c => {
      return (
        <List.Item key={c.customId}>
          <CollaboratorThumbnail collaborator={c} />
        </List.Item>
      );
    });
  }

  // TODO: Define type
  public renderCollaborationRequests(collaborationRequests: any[] = []) {
    return this.renderList(collaborationRequests, c => {
      return (
        <List.Item key={c.customId}>
          <CollaboratorThumbnail collaborator={c} />
        </List.Item>
      );
    });
  }

  public render() {
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

import { Button, List, Tabs } from "antd";
import React from "react";

import { IBlock } from "../../models/block/block.js";
import { INotification } from "../../models/notification/notification.js";
import { IUser } from "../../models/user/user.js";
import AC, { IACValue } from "./AC";
import "./collaborators.css";
import CollaboratorThumbnail from "./Thumnail.jsx";

export interface ICollaboratorsProps {
  // TODO: Define collaborators' right type
  collaborators: IUser[];

  collaborationRequests: INotification[];
  block: IBlock;
  error?: Error;
  onBack: () => void;
  onAddCollaborators: (values: IACValue) => void;
}

interface ICollaboratorsState {
  showAddCollaboratorsForm: boolean;
}

export default class Collaborators extends React.Component<
  ICollaboratorsProps,
  ICollaboratorsState
> {
  public state = {
    showAddCollaboratorsForm: false
  };

  public toggleCollaboratorForm = () => {
    this.setState(prevState => {
      return {
        showAddCollaboratorsForm: !prevState.showAddCollaboratorsForm
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
    return this.renderList(collaborators, collaborator => {
      return (
        <List.Item key={collaborator.customId}>
          <CollaboratorThumbnail collaborator={collaborator} />
        </List.Item>
      );
    });
  }

  // TODO: Define type
  public renderCollaborationRequests(collaborationRequests: any[] = []) {
    return this.renderList(collaborationRequests, request => {
      return (
        <List.Item key={request.customId}>
          <CollaboratorThumbnail collaborator={request} />
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
    const { showAddCollaboratorsForm } = this.state;

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
          visible={showAddCollaboratorsForm}
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

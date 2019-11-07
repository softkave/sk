import { Button, List, Tabs } from "antd";
import React from "react";
import { IBlock } from "../../models/block/block";
import { INotification } from "../../models/notification/notification";
import { IUser } from "../../models/user/user.js";
import { IOperationFuncOptions } from "../../redux/operations/operation";
import { addCollaboratorsOperationID } from "../../redux/operations/operationIDs";
import { IAddCollaboratorFormValues } from "./AddCollaboratorForm";
import AddCollaboratorFormWithModal from "./AddCollaboratorFormWithModal";
import "./collaborators.css";
import CollaboratorThumbnail from "./CollaboratorThumbnail";

// TODO: After adding collaborator, control unmounts Collaborator and goes back to board
// This is not expected behaviour.
export interface ICollaboratorsProps {
  // TODO: Define collaborators' right type
  collaborators: IUser[];

  collaborationRequests: INotification[];
  block: IBlock;
  error?: Error;
  onBack: () => void;
  onAddCollaborators: (
    values: IAddCollaboratorFormValues,
    options: IOperationFuncOptions
  ) => void;
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

  public renderCollaborationRequests(
    collaborationRequests: INotification[] = []
  ) {
    // TODO: Use the user's avatar color for the collaboration request also
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
        <AddCollaboratorFormWithModal
          customId={block.customId}
          existingCollaborationRequests={collaborationRequests}
          existingCollaborators={collaborators}
          onClose={this.toggleCollaboratorForm}
          onSubmit={async (data, options) => {
            await onAddCollaborators(data, options);
          }}
          operationID={addCollaboratorsOperationID}
          title="Add Collaborator"
          visible={showAddCollaboratorsForm}
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

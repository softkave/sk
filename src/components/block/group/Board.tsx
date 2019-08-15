import styled from "@emotion/styled";
import { Button } from "antd";
import React from "react";

import { IBlock } from "../../../models/block/block";
import {
  assignTask,
  getBlockValidChildrenTypes
} from "../../../models/block/utils";
import { IUser } from "../../../models/user/user";
import AddDropdownButton from "../../AddDropdownButton";
import AvatarList, { IAvatarItem } from "../../collaborator/AvatarList";
import Collaborators from "../../collaborator/Collaborators";
import { IBlockMethods } from "../methods";
import EditProject from "../project/EditProject";
import EditTask from "../task/EditTask";
import BoardContainer from "./BoardContainer";
import DataLoader from "./DataLoader";
import EditGroup from "./EditGroup";
import ExpandedGroup from "./ExpandedGroup";
import KanbanBoard from "./KanbanBoard";
import SplitView, { ISplit } from "./SplitView";

export interface IBoardProps {
  block: IBlock;
  blockHandlers: IBlockMethods;
  user: IUser;
  onBack: () => void;
  isFromRoot?: boolean;
  isUserRootBlock?: boolean;

  // TODO: Define the right type
  collaborators: IUser[];
}

interface IBoardState {
  form: {
    task: boolean;
    project: boolean;
    group: boolean;
  };
  showCollaborators: boolean;
  boardContext: "task" | "project";
  parent?: IBlock | null;
  project?: IBlock | null;
  block?: IBlock | null;
  selectedCollaborators: { [key: string]: boolean };
  selectedGroup: IBlock | null;
}

class Board extends React.Component<IBoardProps, IBoardState> {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        task: false,
        project: false,
        group: false
      },
      project: null,
      block: null,
      parent: null,
      showCollaborators: false,
      boardContext: "task",
      selectedCollaborators: {},
      selectedGroup: null
    };
  }

  public render() {
    const { selectedGroup } = this.state;
    const splits: ISplit[] = [
      {
        showControls: false,
        render: this.renderMain,
        flex: 1
      }
    ];

    if (selectedGroup) {
      splits.push({
        showControls: true,
        title: selectedGroup.name,
        flex: 1,
        onClose: () => {
          this.setState({ selectedGroup: null });
        },
        render() {
          return <ExpandedGroup />;
        }
      });
    }

    return <SplitView splits={splits} />;
  }

  private renderMain = () => {
    const {
      block: rootBlock,
      blockHandlers,
      user,
      onBack,
      isFromRoot,
      isUserRootBlock
    } = this.props;
    const {
      form,
      project,
      block,
      showCollaborators,
      parent,
      boardContext,
      selectedCollaborators
    } = this.state;

    const collaborators = this.getCollaborators();
    const childrenTypes = this.getChildrenTypes(rootBlock);
    const actLikeRootBlock = isUserRootBlock || isFromRoot;

    /**
     * This should be only for collaboration requests,
     * cause we need collaborators throughout the block, not only here.
     *
     * TODO: move fetching collaborators upward
     */
    if (showCollaborators) {
      return (
        <DataLoader
          render={this.renderCollaborators}
          isDataLoaded={this.isCollaboratorDataLoaded}
          loadData={this.fetchCollaborationData}
        />
      );
    }

    if (project) {
      return (
        <BoardContainer
          path={project.path}
          collaborators={collaborators}
          user={user}
          onBack={() => this.setCurrentProject(null)}
          blockHandlers={blockHandlers}
          parentBlock={rootBlock}
          isFromRoot={actLikeRootBlock}
          type={boardContext}
        />
      );
    }

    return (
      <Content>
        {form.project && (
          <EditProject
            visible={form.project}
            onSubmit={data => this.onSubmitData(data, "project")}
            onClose={() => this.toggleForm("project")}
            data={block}
            existingProjects={
              form.project && this.getExistingNames(parent!.project)
            }
            submitLabel={block && "Update Project"}
          />
        )}
        {form.group && (
          <EditGroup
            visible={form.group}
            onSubmit={data => this.onSubmitData(data, "group")}
            onClose={() => this.toggleForm("group")}
            data={block}
            existingGroups={form.group && this.getExistingNames(parent!.group)}
            submitLabel={block && "Update Group"}
          />
        )}
        {form.task && (
          <EditTask
            defaultAssignedTo={actLikeRootBlock && [assignTask(user)]}
            collaborators={collaborators}
            visible={form.task}
            onSubmit={data => this.onSubmitData(data, "task")}
            onClose={() => this.toggleForm("task")}
            data={block}
            user={user}
            submitLabel={block && "Update Task"}
          />
        )}
        <Header>
          {onBack && <Button onClick={onBack} icon="arrow-left" />}
          {childrenTypes.length > 0 && (
            <CreateButton
              types={childrenTypes}
              label="Create"
              onClick={type => this.toggleForm(type, rootBlock)}
            />
          )}
          <ContextButtons>
            <Button.Group>
              <Button
                onClick={() => this.toggleContext("task")}
                type={boardContext === "task" ? "primary" : "default"}
              >
                Task
              </Button>
              <Button
                onClick={() => this.toggleContext("project")}
                type={boardContext === "project" ? "primary" : "default"}
              >
                Project
              </Button>
            </Button.Group>
          </ContextButtons>
          {rootBlock.type === "org" && (
            <CollaboratorsButtonContainer>
              <Button onClick={this.toggleShowCollaborators}>
                Collaborators
              </Button>
            </CollaboratorsButtonContainer>
          )}
          <BlockName>{isUserRootBlock ? "Root" : rootBlock.name}</BlockName>
        </Header>
        <CollaboratorAvatarsContainer>
          <AvatarList
            collaborators={collaborators.map(collaborator => {
              // TODO: Remove avatar list from personal or root kanban boards
              return {
                key: collaborator.customId,
                color: collaborator.color,
                active: selectedCollaborators[collaborator.customId],
                extra: collaborator.name
              };
            })}
            onClick={this.onSelectCollaborator}
          />
        </CollaboratorAvatarsContainer>
        <BoardContent>
          <DataLoader
            isDataLoaded={this.isCollaboratorDataLoaded}
            loadData={this.fetchCollaborationData}
            render={() => {
              return (
                <KanbanBoard
                  blockHandlers={blockHandlers}
                  rootBlock={rootBlock}
                  onClickAddChild={this.toggleForm}
                  user={user}
                  collaborators={collaborators}
                  setCurrentProject={this.setCurrentProject}
                  type={boardContext}
                  toggleForm={this.toggleForm}
                  selectedCollaborators={selectedCollaborators}
                  onSelectGroup={() => null}
                />
              );
            }}
          />
        </BoardContent>
      </Content>
    );
  };

  private isBlockCollaboratorsLoaded() {
    const { block: rootBlock } = this.props;
    if (rootBlock.type === "org" && !rootBlock.collaborators) {
      return false;
    }

    return true;
  }

  private isBlockCollaborationRequestsLoaded() {
    const { block: rootBlock } = this.props;
    if (rootBlock.type === "org" && !rootBlock.collaborationRequests) {
      return false;
    }

    return true;
  }

  private isCollaboratorDataLoaded = () => {
    return (
      this.isBlockCollaboratorsLoaded() &&
      this.isBlockCollaborationRequestsLoaded()
    );
  };

  private async fetchCollaborators() {
    const { block: rootBlock, blockHandlers } = this.props;
    await blockHandlers.getCollaborators({ block: rootBlock });
  }

  private async fetchCollaborationRequests() {
    const { block: rootBlock, blockHandlers } = this.props;
    await blockHandlers.getCollaborationRequests({ block: rootBlock });
  }

  private fetchCollaborationData = async () => {
    await this.fetchCollaborators();
    await this.fetchCollaborationRequests();
  };

  private onSelectCollaborator = (
    collaborator: IAvatarItem,
    selected: boolean
  ) => {
    this.setState(state => {
      return {
        selectedCollaborators: {
          ...state.selectedCollaborators,
          [collaborator.key]: selected
        }
      };
    });
  };

  private onSubmitData = async (data, formType) => {
    const { user } = this.props;
    const { parent, block } = this.state;

    if (block) {
      await this.props.blockHandlers.onUpdate({
        block,
        data
      });
    } else {
      await this.props.blockHandlers.onAdd({
        user,
        parent: parent!,
        block: data
      });
    }

    this.toggleForm(formType);
  };

  private toggleForm = (type: string, parent?: IBlock, block?: IBlock) => {
    this.setState(prevState => {
      return {
        parent,
        block,
        form: { ...prevState.form, [type]: !prevState.form[type] }
      };
    });
  };

  private setCurrentProject = project => {
    this.setState({ project });
  };

  private toggleShowCollaborators = () => {
    this.setState(prevState => {
      return {
        showCollaborators: !prevState.showCollaborators
      };
    });
  };

  private toggleContext = context => {
    this.setState({ boardContext: context });
  };

  private getCollaborators() {
    const { user, collaborators } = this.props;
    return collaborators || [user];
  }

  private getExistingNames(blocks = {}) {
    return Object.keys(blocks).map(customId => blocks[customId].name);
  }

  private getChildrenTypes(block) {
    const { boardContext } = this.state;

    const remove = boardContext === "task" ? "project" : "task";
    const childrenTypes = getBlockValidChildrenTypes(block);
    const typeIndex = childrenTypes.indexOf(remove);

    if (typeIndex !== -1) {
      childrenTypes.splice(typeIndex, 1);
    }

    return childrenTypes;
  }

  private renderCollaborators = () => {
    const { block: rootBlock, blockHandlers } = this.props;

    return (
      <Collaborators
        block={rootBlock}
        onBack={this.toggleShowCollaborators}
        collaborators={this.getCollaborators()}
        onAddCollaborators={async data => {
          return blockHandlers.onAddCollaborators({
            ...data,
            block: rootBlock
          });
        }}
        collaborationRequests={rootBlock.collaborationRequests}
      />
    );
  };
}

const Content = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const BoardContent = styled.div`
  flex: 1;
  display: inline-flex;
`;

const Header = styled.div`
  white-space: normal;
  padding: 1em;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const BlockName = styled.span`
  display: inline-block;
  margin-left: 1em;
  font-weight: bold;
`;

const CreateButton = styled(AddDropdownButton)`
  margin-left: 16px;
`;

const CollaboratorsButtonContainer = styled.span`
  margin-left: 16px;
`;

const ContextButtons = styled.div`
  display: inline-block;
  margin-left: 16px;
`;

const CollaboratorAvatarsContainer = styled.div`
  padding: 1em;
`;

export default Board;

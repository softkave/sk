import styled from "@emotion/styled";
import { Button } from "antd";
import React from "react";

import { BlockType, IBlock } from "../../../models/block/block";
import { assignTask } from "../../../models/block/utils";
import { INotification } from "../../../models/notification/notification";
import { IUser } from "../../../models/user/user";
import AddDropdownButton from "../../AddDropdownButton";
import AvatarList, { IAvatarItem } from "../../collaborator/AvatarList";
import Collaborators from "../../collaborator/Collaborators";
import { IBlockMethods } from "../methods";
import EditProject from "../project/EditProject";
import EditTask from "../task/EditTask";
import BoardContainer from "./BoardContainer";
import { getChildrenTypesForContext } from "./childrenTypes";
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
  projects?: IBlock[];
  groups?: IBlock[];
  tasks?: IBlock[];

  // TODO: Define the right type for collaborators
  collaborators: IUser[];
  collaborationRequests: INotification[];
}

export type BoardContext = "task" | "project";

interface IBoardState {
  formType: BlockType | null;
  showCollaborators: boolean;
  boardContext: BoardContext;
  parent?: IBlock | null;
  projectID?: string | null;
  block?: IBlock | null;
  selectedCollaborators: { [key: string]: boolean };
  selectedGroup: IBlock | null;
}

class Board extends React.Component<IBoardProps, IBoardState> {
  constructor(props) {
    super(props);
    this.state = {
      formType: null,
      projectID: null,
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
        render: this.renderMain,
        flex: 1,
        id: "main"
      }
    ];

    if (selectedGroup) {
      splits.push({
        id: "group",
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

  private findBlock(blocks: IBlock[] = [], id: string) {
    return blocks.find(block => block.customId === id);
  }

  private canHaveContextButtons(block: IBlock) {
    switch (block.type) {
      case "org":
      case "root":
        return true;

      default:
        return false;
    }
  }

  private renderMain = () => {
    const {
      block,
      blockHandlers,
      user,
      onBack,
      isFromRoot,
      isUserRootBlock,
      projects,
      groups,
      tasks
    } = this.props;
    const {
      formType,
      projectID,
      showCollaborators,
      boardContext,
      selectedCollaborators,
      block: formBlock
    } = this.state;

    const collaborators = this.getCollaborators();
    const childrenTypes = getChildrenTypesForContext(block, boardContext);
    const actLikeRootBlock = isUserRootBlock || isFromRoot;

    if (showCollaborators) {
      return this.renderCollaborators();
    }

    if (projectID) {
      const project = this.findBlock(projects, projectID);
      return (
        <BoardContainer
          onBack={() => this.setCurrentProject(null)}
          blockID={projectID}
          block={project}
          isFromRoot={actLikeRootBlock}
        />
      );
    }

    return (
      <Content>
        {formType === "project" && (
          <EditProject
            visible
            onSubmit={data => this.onSubmitData(data, "project")}
            onClose={() => this.toggleForm("project")}
            data={formBlock}
            existingProjects={this.getExistingNames(projects)}
            submitLabel={formBlock ? "Update Project" : "Create Project"}
          />
        )}
        {formType === "group" && (
          <EditGroup
            visible
            onSubmit={data => this.onSubmitData(data, "group")}
            onClose={() => this.toggleForm("group")}
            data={formBlock}
            existingGroups={this.getExistingNames(groups)}
            submitLabel={formBlock ? "Update Group" : "Create Group"}
          />
        )}
        {formType === "task" && (
          <EditTask
            visible
            defaultAssignedTo={actLikeRootBlock && [assignTask(user)]}
            collaborators={collaborators}
            onSubmit={data => this.onSubmitData(data, "task")}
            onClose={() => this.toggleForm("task")}
            data={formBlock}
            user={user}
            submitLabel={formBlock ? "Update Task" : "Create Task"}
          />
        )}
        <Header>
          {onBack && <Button onClick={onBack} icon="arrow-left" />}
          {childrenTypes.length > 0 && (
            <CreateButton
              types={childrenTypes}
              label="Create"
              onClick={type => this.toggleForm(type, block)}
            />
          )}
          {this.canHaveContextButtons(block) && (
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
          )}
          {block.type === "org" && (
            <CollaboratorsButtonContainer>
              <Button onClick={this.toggleShowCollaborators}>
                Collaborators
              </Button>
            </CollaboratorsButtonContainer>
          )}
          <BlockName>{isUserRootBlock ? "Root" : block.name}</BlockName>
        </Header>
        {/** TODO: undo */}
        {/* {!actLikeRootBlock && (
          <CollaboratorAvatarsContainer>
            <AvatarList
              collaborators={collaborators.map(collaborator => {
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
        )} */}
        <BoardContent>
          <KanbanBoard
            blockHandlers={blockHandlers}
            block={block}
            onClickAddChild={this.toggleForm}
            user={user}
            collaborators={collaborators}
            setCurrentProject={this.setCurrentProject}
            context={boardContext}
            toggleForm={this.toggleForm}
            selectedCollaborators={selectedCollaborators}
            onSelectGroup={() => null}
            groups={groups}
            projects={projects}
            tasks={tasks}
          />
        </BoardContent>
      </Content>
    );
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

  private getChildrenBlocksContainer(type: BlockType) {
    const { tasks, projects, groups } = this.props;

    switch (type) {
      case "group":
        return groups;

      case "project":
        return projects;

      case "task":
        return tasks;

      default:
        return [];
    }
  }

  private onSubmitData = async (data, formType) => {
    const { user } = this.props;
    const { parent, block } = this.state;

    if (block) {
      await this.props.blockHandlers.onUpdate({
        data,
        block: block!
      });
    } else {
      await this.props.blockHandlers.onAdd({
        user,
        parent,
        block: data
      });
    }

    this.toggleForm(formType);
  };

  private toggleForm = (type: BlockType, parent?: IBlock, block?: IBlock) => {
    this.setState(prevState => {
      return {
        parent,
        block,
        formType: prevState.formType ? null : type
      };
    });
  };

  private setCurrentProject = (project: IBlock | null) => {
    this.setState({ projectID: project ? project.customId : null });
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

  private getExistingNames(blocks?: IBlock[]) {
    if (Array.isArray(blocks)) {
      return blocks.map(block => block.name);
    }

    return [];
  }

  private renderCollaborators = () => {
    const {
      block: rootBlock,
      blockHandlers,
      collaborationRequests
    } = this.props;

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
        collaborationRequests={collaborationRequests}
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
  display: flex;
  overflow-x: auto;
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

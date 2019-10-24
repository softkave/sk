import styled from "@emotion/styled";
import { Button } from "antd";
import isString from "lodash/isString";
import React from "react";
import { BlockType, IBlock } from "../../models/block/block";
import { assignTask } from "../../models/block/utils";
import { INotification } from "../../models/notification/notification";
import { IUser } from "../../models/user/user";
import {
  addBlockOperationID,
  updateBlockOperationID
} from "../../redux/operations/operationIDs";
import AddDropdownButton from "../AddDropdownButton";
import getNewBlock, { INewBlock } from "../block/getNewBlock";
import { IBlockMethods } from "../block/methods";
import AvatarList, { IAvatarItem } from "../collaborator/AvatarList";
import Collaborators from "../collaborator/Collaborators";
import EditGroupContainer from "../group/EditGroupContainer";
import ExpandedGroup from "../group/ExpandedGroup";
import EditProjectContainer from "../project/EditProjectContainer";
import EditTaskContainer from "../task/EditTaskContainer";
import SplitView, { ISplit } from "../view/SplitView";
import { getChildrenTypesForContext } from "./childrenTypes";
import KanbanBoard from "./KanbanBoard";

export interface IBoardProps {
  block: IBlock;
  blockHandlers: IBlockMethods;
  user: IUser;
  onBack: () => void;
  onSelectProject: (project: IBlock) => void;
  isFromRoot?: boolean;
  isUserRootBlock?: boolean;
  projects: IBlock[];
  groups: IBlock[];
  tasks: IBlock[];

  // TODO: Define the right type for collaborators
  collaborators: IUser[];
  collaborationRequests: INotification[];
}

export type BoardContext = "task" | "project";

interface IBoardState {
  formType: BlockType | null;
  showCollaborators: boolean;
  boardContext: BoardContext;
  selectedCollaborators: { [key: string]: boolean };
  selectedGroup: IBlock | null;
  parent?: IBlock | null;
  isFormForAddBlock?: boolean;
  formAddBlock?: INewBlock;
  formUpdateBlock?: IBlock;
}

class Board extends React.Component<IBoardProps, IBoardState> {
  constructor(props) {
    super(props);
    this.state = {
      formType: null,
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

  private canHaveContext(block: IBlock) {
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
      tasks,
      onSelectProject
    } = this.props;
    const {
      formType,
      showCollaborators,
      boardContext,
      selectedCollaborators,
      isFormForAddBlock
    } = this.state;

    const collaborators = this.getCollaborators();
    const childrenTypes = getChildrenTypesForContext(
      block,
      boardContext
    ) as BlockType[];
    const actLikeRootBlock = isUserRootBlock || isFromRoot;
    const blockFormOperationId = isFormForAddBlock
      ? addBlockOperationID
      : updateBlockOperationID;

    const formBlock = this.getFormBlock();

    if (showCollaborators) {
      return this.renderCollaborators();
    }

    return (
      <Content>
        {formType === "project" && (
          <EditProjectContainer
            visible
            operationID={blockFormOperationId}
            customId={formBlock!.customId}
            onSubmit={data => this.onSubmitData(data, formType)}
            onClose={() => this.toggleForm(formType)}
            data={formBlock}
            existingProjects={this.getExistingNames(projects)}
            submitLabel={
              !isFormForAddBlock ? "Update Project" : "Create Project"
            }
          />
        )}
        {formType === "group" && (
          <EditGroupContainer
            visible
            operationID={blockFormOperationId}
            customId={formBlock!.customId}
            onSubmit={data => this.onSubmitData(data, formType)}
            onClose={() => this.toggleForm(formType)}
            data={formBlock}
            existingGroups={this.getExistingNames(groups)}
            submitLabel={!isFormForAddBlock ? "Update Group" : "Create Group"}
          />
        )}
        {formType === "task" && (
          <EditTaskContainer
            visible
            operationID={blockFormOperationId}
            customId={formBlock!.customId}
            defaultAssignedTo={actLikeRootBlock && [assignTask(user)]}
            collaborators={collaborators}
            onSubmit={data => this.onSubmitData(data, formType)}
            onClose={() => this.toggleForm(formType)}
            data={formBlock}
            user={user}
            submitLabel={!isFormForAddBlock ? "Update Task" : "Create Task"}
          />
        )}
        <Header>
          {onBack && <Button onClick={onBack} icon="arrow-left" />}
          {childrenTypes.length > 0 && (
            <CreateButton
              types={childrenTypes}
              label="Create"
              onClick={type => this.toggleForm(type as BlockType, block)}
            />
          )}
          {this.canHaveContext(block) && (
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
        {!actLikeRootBlock && (
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
        )}
        <BoardContent>
          <KanbanBoard
            blockHandlers={blockHandlers}
            block={block}
            onClickAddChild={this.toggleForm}
            user={user}
            collaborators={collaborators}
            setCurrentProject={onSelectProject}
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

  private getFormBlock = () => {
    const {
      formAddBlock,
      formUpdateBlock,
      formType,
      isFormForAddBlock
    } = this.state;
    const assertBlock = (block?: INewBlock | IBlock) => {
      if (!block) {
        // TODO: Make sure this error is handled (maybe in CapturePageError), and add error message to it
        // TODO: Maybe make a global error type of AppRuntimeError for runtime assertion errors
        throw new Error();
      }
    };

    if (isString(formType)) {
      if (isFormForAddBlock) {
        assertBlock(formAddBlock);
        return formAddBlock;
      } else {
        assertBlock(formUpdateBlock);
        return formUpdateBlock;
      }
    }
  };

  private onSelectCollaborator = (
    collaborator: IAvatarItem,
    selected: boolean
  ) => {
    this.setState(state => {
      const selectedCollaborators = { ...state.selectedCollaborators };

      if (selected) {
        selectedCollaborators[collaborator.key] = selected;
      } else if (selectedCollaborators[collaborator.key]) {
        delete selectedCollaborators[collaborator.key];
      }

      return {
        selectedCollaborators
      };
    });
  };

  private onSubmitData = async (data, formType) => {
    const { user } = this.props;
    const { parent, isFormForAddBlock } = this.state;
    const formBlock = this.getFormBlock();

    if (!isFormForAddBlock) {
      await this.props.blockHandlers.onUpdate(formBlock!, data);
    } else {
      await this.props.blockHandlers.onAdd(
        user,
        { ...formBlock!, ...data },
        parent!
      );
    }

    this.toggleForm(formType);
  };

  private toggleForm = (type: BlockType, parent?: IBlock, block?: IBlock) => {
    const { user } = this.props;

    this.setState(prevState => {
      const showForm = prevState.formType ? false : true;
      const isAddBlock = showForm && !block;
      const formAddBlock = isAddBlock
        ? getNewBlock(user, type, parent)
        : undefined;
      const formUpdateBlock = showForm ? block : undefined;

      return {
        parent,
        formAddBlock,
        formUpdateBlock,
        formType: showForm ? type : null,
        isFormForAddBlock: isAddBlock ? true : false
      };
    });
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
    const { block, blockHandlers, collaborationRequests } = this.props;

    return (
      <Collaborators
        block={block}
        onBack={this.toggleShowCollaborators}
        collaborators={this.getCollaborators()}
        onAddCollaborators={async data => {
          return blockHandlers.onAddCollaborators(
            block,
            data.requests,
            data.message,
            data.expiresAt
          );
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
  padding: 2em 1em;
  padding-bottom: 12px;
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

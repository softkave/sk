import React from "react";
import { Button } from "antd";
import styled from "@emotion/styled";
import EditGroup from "./EditGroup.jsx";
import EditTask from "../task/EditTask.jsx";
import EditProject from "../project/EditProject.jsx";
import AddDropdownButton from "../../AddDropdownButton.jsx";
import {
  assignTask,
  getBlockValidChildrenTypes
} from "../../../models/block/utils";
import BoardContainer from "./BoardContainer";
import Collaborators from "../../collaborator/Collaborators.jsx";
import KanbanBoard from "./KanbanBoard";
import DataLoader from "./DataLoader.jsx";
import withForm from "../../form/withForm.jsx";

class Board extends React.Component {
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
      boardContext: "task"
    };
  }

  isBlockCollaboratorsLoaded() {
    const { rootBlock } = this.props;
    if (rootBlock.type === "org" && !rootBlock.collaborators) {
      return false;
    }

    return true;
  }

  isBlockCollaborationRequestsLoaded() {
    const { rootBlock } = this.props;
    if (rootBlock.type === "org" && !rootBlock.collaborationRequests) {
      return false;
    }

    return true;
  }

  isCollaboratorDataLoaded = () => {
    return (
      this.isBlockCollaboratorsLoaded() &&
      this.isBlockCollaborationRequestsLoaded()
    );
  };

  async fetchCollaborators() {
    const { rootBlock, blockHandlers } = this.props;
    await blockHandlers.getCollaborators(rootBlock);
  }

  async fetchCollaborationRequests() {
    const { rootBlock, blockHandlers } = this.props;
    await blockHandlers.getCollaborationRequests(rootBlock);
  }

  fetchCollaborationData = async () => {
    await this.fetchCollaborators();
    await this.fetchCollaborationRequests();
  };

  onSubmitData = async (data, formType) => {
    const { parent, block } = this.state;

    if (block) {
      await this.props.blockHandlers.onUpdate(block, data);
    } else {
      await this.props.blockHandlers.onAdd(data, parent);
    }

    this.toggleForm(formType);
  };

  toggleForm = (type, parent, block) => {
    this.setState(prevState => {
      return {
        parent: parent,
        block: block,
        form: { ...prevState.form, [type]: !prevState.form[type] }
      };
    });
  };

  setCurrentProject = project => {
    this.setState({ project });
  };

  toggleShowCollaborators = () => {
    this.setState(prevState => {
      return {
        showCollaborators: !prevState.showCollaborators
      };
    });
  };

  toggleContext = context => {
    this.setState({ boardContext: context });
  };

  getCollaborators() {
    const { user, rootBlock, collaborators } = this.props;
    return rootBlock.collaborators || collaborators || [user];
  }

  getExistingNames(blocks = {}) {
    return Object.keys(blocks).map(customId => blocks[customId].name);
  }

  getChildrenTypes(block) {
    const { boardContext } = this.state;

    const remove = boardContext === "task" ? "project" : "task";
    const childrenTypes = getBlockValidChildrenTypes(block);
    console.log(childrenTypes, remove, block);
    const typeIndex = childrenTypes.indexOf(remove);

    if (typeIndex !== -1) {
      childrenTypes.splice(typeIndex, 1);
    }

    return childrenTypes;
  }

  renderCollaborators = () => {
    const { rootBlock, blockHandlers } = this.props;

    return (
      <Collaborators
        block={rootBlock}
        onBack={this.toggleShowCollaborators}
        collaborators={rootBlock.collaborators}
        onAddCollaborators={async data => {
          console.log(data);
          return blockHandlers.onAddCollaborators(rootBlock, data);
        }}
        collaborationRequests={rootBlock.collaborationRequests}
        bench={rootBlock.bench}
        onUpdateCollaborator={(collaborator, data) => {
          blockHandlers.onUpdateCollaborator(rootBlock, collaborator, data);
        }}
      />
    );
  };

  render() {
    const {
      rootBlock,
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
      boardContext
    } = this.state;

    const collaborators = this.getCollaborators();
    // const childrenTypes = getBlockValidChildrenTypes(rootBlock);
    const childrenTypes = this.getChildrenTypes(rootBlock);
    const actLikeRootBlock = isUserRootBlock || isFromRoot;
    // const InternalEditTask = withForm(EditTask);
    console.log(this);

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
              form.project && this.getExistingNames(parent.project)
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
            existingGroups={form.group && this.getExistingNames(parent.group)}
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
          {onBack && <OnBackButton onClick={onBack} icon="arrow-left" />}
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
            <CollaboratorsButton onClick={this.toggleShowCollaborators}>
              Collaborators
            </CollaboratorsButton>
          )}
          <BlockName>{isUserRootBlock ? "Root" : rootBlock.name}</BlockName>
        </Header>
        <BoardContent>
          <DataLoader
            isDataLoaded={this.isCollaboratorDataLoaded}
            loadData={this.fetchCollaborationData}
            render={() => {
              return (
                <KanbanBoard
                  blockHandlers={blockHandlers}
                  rootBlock={rootBlock}
                  onEdit={group => {
                    this.toggleForm("group", rootBlock, group);
                  }}
                  onClickAddChild={this.toggleForm}
                  user={user}
                  collaborators={collaborators}
                  setCurrentProject={this.setCurrentProject}
                  type={boardContext}
                  toggleForm={this.toggleForm}
                />
              );
            }}
          />
        </BoardContent>
      </Content>
    );
  }
}

const Content = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const BoardContent = styled.div`
  flex: 1;
  display: inline-flex;
  // overflow-x: hidden;
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

const OnBackButton = styled(Button)``;
const CreateButton = styled(AddDropdownButton)`
  margin-left: 16px;
`;

const CollaboratorsButton = styled(Button)`
  margin-left: 16px;
`;

const ContextButtons = styled.div`
  display: inline-block;
  margin-left: 16px;
`;

export default Board;

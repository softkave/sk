import React from "react";
import { Button } from "antd";
import styled from "styled-components";
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
import Brd from "./Brd";

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
      showCollaborators: false
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

  onSubmitData = (data, formType) => {
    const { parent, block } = this.state;

    if (block) {
      this.props.blockHandlers.onUpdate(block, data);
    } else {
      this.props.blockHandlers.onAdd(data, parent);
    }

    this.toggleForm(formType);
  };

  toggleForm = (type, parent = null, block = null) => {
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

  getCollaborators() {
    const { user, rootBlock, collaborators } = this.props;
    return rootBlock.collaborators || collaborators || [user];
  }

  getExistingNames(blocks = {}) {
    return Object.keys(blocks).map(customId => blocks[customId].name);
  }

  renderCollaborators = () => {
    const { rootBlock, blockHandlers } = this.props;

    return (
      <Collaborators
        block={rootBlock}
        onBack={this.toggleShowCollaborators}
        collaborators={rootBlock.collaborators}
        onAddCollaborators={data => {
          blockHandlers.onAddCollaborators(rootBlock, data);
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
    const { form, project, block, showCollaborators, parent } = this.state;

    const collaborators = this.getCollaborators();
    const childrenTypes = getBlockValidChildrenTypes(rootBlock);
    const actLikeRootBlock = isUserRootBlock || isFromRoot;

    /**
     * This should be only for collaboration requests, cause we need collaborators
     * throughout the block, not only here.
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
        />
      );
    }

    return (
      <Content>
        <EditProject
          visible={form.project}
          onSubmit={data => this.onSubmitData(data, "project")}
          onClose={() => this.toggleForm("project")}
          data={block}
          existingProjects={
            form.project && this.getExistingNames(parent.project)
          }
        />
        <EditGroup
          visible={form.group}
          onSubmit={data => this.onSubmitData(data, "group")}
          onClose={() => this.toggleForm("group")}
          data={block}
          existingGroups={form.group && this.getExistingNames(parent.group)}
        />
        <EditTask
          defaultAssignedTo={actLikeRootBlock && [assignTask(user)]}
          collaborators={collaborators}
          visible={form.task}
          onSubmit={data => this.onSubmitData(data, "task")}
          onClose={() => this.toggleForm("task")}
          data={block}
          user={user}
        />
        <Header>
          {onBack && <OnBackButton onClick={onBack} icon="arrow-left" />}
          {childrenTypes.length > 0 && (
            <CreateButton
              types={childrenTypes}
              label="Create"
              onClick={type => this.toggleForm(type, rootBlock)}
            />
          )}
          {rootBlock.type === "org" && (
            <CollaboratorsButton onClick={this.toggleShowCollaborators}>
              Collaborators
            </CollaboratorsButton>
          )}
          <BlockName>{isUserRootBlock ? "Root" : rootBlock.name}</BlockName>
        </Header>
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
        />
        {/* <Brd
          withScrollableColumns
          initial={rootBlock.group}
          handlers={blockHandlers}
          onEdit={group => {
            this.toggleForm("group", rootBlock, group);
          }}
          onClickAddChild={this.toggleForm}
        /> */}
      </Content>
    );
  }
}

const Content = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
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

export default Board;

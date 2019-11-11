import isString from "lodash/isString";
import React from "react";
import { BlockType, IBlock } from "../../models/block/block";
import { assignTask } from "../../models/block/utils";
import { IUser } from "../../models/user/user";
import { IOperationFuncOptions } from "../../redux/operations/operation";
import {
  addBlockOperationID,
  updateBlockOperationID
} from "../../redux/operations/operationIDs";
import getNewBlock, { INewBlock } from "../block/getNewBlock";
import { IBlockMethods } from "../block/methods";
import GroupFormWithModal from "../group/GroupFormWithModal";
import ProjectFormWithModal from "../project/ProjectFormWithModal";
import TaskFormWithModal from "../task/TaskFormWithModal";
import SplitView, { ISplit } from "../view/SplitView";

export interface IBoardProps {
  block: IBlock;
  blockHandlers: IBlockMethods;
  user: IUser;
  isFromRoot?: boolean;
  isUserRootBlock?: boolean;
  projects: IBlock[];
  groups: IBlock[];
  tasks: IBlock[];

  // TODO: Define the right type for collaborators
  collaborators: IUser[];
  renderMain: () => React.ReactNode;
}

export type BoardContext = "task" | "project";

interface IBoardState {
  formType: BlockType | null;
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
      parent: null
    };
  }

  public render() {
    const splits: ISplit[] = [
      {
        render: this.renderMain,
        flex: 1,
        id: "main"
      }
    ];

    return <SplitView splits={splits} />;
  }

  private renderMain = () => {
    const { user, isFromRoot, isUserRootBlock, projects, groups } = this.props;
    const { formType, isFormForAddBlock } = this.state;

    const collaborators = this.getCollaborators();
    const actLikeRootBlock = isUserRootBlock || isFromRoot;
    const blockFormOperationId = isFormForAddBlock
      ? addBlockOperationID
      : updateBlockOperationID;

    const formBlock = this.getFormBlock();
    const formTitle = this.getFormTitle();

    return (
      <React.Fragment>
        {formType === "project" && (
          <ProjectFormWithModal
            visible
            customId={formBlock!.customId}
            existingProjects={this.getExistingNames(projects)}
            initialValues={formBlock}
            onClose={() => this.toggleForm(formType)}
            onSubmit={(data, options) => this.onSubmitData(data, options)}
            operationID={blockFormOperationId}
            submitLabel={formTitle}
            title={formTitle}
          />
        )}
        {formType === "group" && (
          <GroupFormWithModal
            visible
            operationID={blockFormOperationId}
            customId={formBlock!.customId}
            onSubmit={(data, options) => this.onSubmitData(data, options)}
            onClose={() => this.toggleForm(formType)}
            initialValues={formBlock}
            existingGroups={this.getExistingNames(groups)}
            submitLabel={formTitle}
            title={formTitle}
          />
        )}
        {formType === "task" && (
          <TaskFormWithModal
            visible
            operationID={blockFormOperationId}
            customId={formBlock!.customId}
            collaborators={collaborators}
            onSubmit={(data, options) => this.onSubmitData(data, options)}
            onClose={() => this.toggleForm(formType)}
            initialValues={
              isFormForAddBlock && actLikeRootBlock
                ? {
                    ...formBlock!,
                    taskCollaborators: [assignTask(user)]
                  }
                : formBlock
            }
            user={user}
            submitLabel={formTitle}
            title={formTitle}
          />
        )}
      </React.Fragment>
    );
  };

  private getFormTitle() {
    const { formType, isFormForAddBlock } = this.state;

    switch (formType) {
      case "group":
        return isFormForAddBlock ? "Create Group" : "Update Group";

      case "org":
        return isFormForAddBlock
          ? "Create Organization"
          : "Update Organization";

      case "project":
        return isFormForAddBlock ? "Create Project" : "Update Project";

      case "task":
        return isFormForAddBlock ? "Create Task" : "Update Task";

      default:
        return "Form";
    }
  }

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

  private onSubmitData = async (data, options: IOperationFuncOptions) => {
    const { user } = this.props;
    const { parent, isFormForAddBlock } = this.state;
    const formBlock = this.getFormBlock();

    if (!isFormForAddBlock) {
      await this.props.blockHandlers.onUpdate(
        { data, block: formBlock! },
        options
      );
    } else {
      await this.props.blockHandlers.onAdd(
        {
          user,
          block: { ...formBlock!, ...data },
          parent: parent!
        },
        options
      );
    }

    // this.toggleForm(formType);
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
}

export default Board;

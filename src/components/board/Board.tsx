import { message } from "antd";
import { isBoolean } from "lodash";
import path from "path-browserify";
import React from "react";
import { useHistory, useRouteMatch } from "react-router";
import { Route, Switch } from "react-router-dom";
import { IBoard } from "../../models/board/types";
import { appBoardRoutes } from "../../models/board/utils";
import { ISprint } from "../../models/sprint/types";
import { ITask } from "../../models/task/types";
import SprintFormInDrawer from "../sprint/SprintFormInDrawer";
import SprintOptionsFormInDrawer from "../sprint/SprintOptionsFormInDrawer";
import StyledContainer from "../styled/Container";
import TaskFormInDrawer from "../task/TaskFormInDrawer";
import BoardFormInDrawer from "./BoardFormInDrawer";
import BoardHeader from "./BoardHeader";
import {
  BoardCurrentView,
  BoardGroupBy,
  BoardHeaderSettingsMenuKey,
} from "./BoardHeaderOptionsMenu";
import BoardStatusResolutionAndLabelsForm, {
  BoardStatusResolutionAndLabelsFormType,
} from "./BoardStatusResolutionAndLabelsForm";
import CurrentSprintHeader from "./CurrentSprintHeader";
import GroupedTasks from "./GroupedTasks";
import SprintsContainer from "./SprintsContainer";
import TasksContainer, { ITasksContainerRenderFnProps } from "./TasksContainer";

export interface IBoardProps {
  board: IBoard;
  isMobile: boolean;
  isAppMenuFolded: boolean;
  onToggleFoldAppMenu: () => void;
  onClickDeleteBoard: (board: IBoard) => void;
  onCloseSprint: () => void;
}

const Board: React.FC<IBoardProps> = (props) => {
  const {
    board,
    isMobile,
    isAppMenuFolded,
    onToggleFoldAppMenu,
    onClickDeleteBoard,
    onCloseSprint,
  } = props;

  const history = useHistory();
  const boardPath = appBoardRoutes.board(board.rootBlockId, board.customId);
  const sprintsPath = path.normalize(`${boardPath}/sprints`);
  const tasksPath = path.normalize(`${boardPath}/tasks`);
  const sprintsRouteMatch = useRouteMatch(sprintsPath);
  const isSprintsRoute = !!sprintsRouteMatch;
  const [groupBy, setGroupBy] = React.useState(BoardGroupBy.STATUS);
  const [view, setView] = React.useState(() => {
    return window.location.pathname.includes(SPRINT)
      ? BoardCurrentView.SPRINTS
      : board.currentSprintId
      ? BoardCurrentView.CURRENT_SPRINT
      : BoardCurrentView.ALL_TASKS;
  });

  const [showSearch, setShowSearch] = React.useState(false);
  const [searchText, setSearchText] = React.useState("");
  const [boardForm, setBoardForm] = React.useState(false);
  const [taskForm, setTaskForm] = React.useState<ITask | boolean>();
  const [sprintOptionsForm, setSprintOptionsForm] = React.useState(false);
  const [sprintForm, setSprintForm] = React.useState<ISprint | boolean>();

  const [otherResourcesForm, setOtherResourcesForm] = React.useState<
    BoardStatusResolutionAndLabelsFormType | undefined
  >();

  React.useEffect(() => {
    if (isSprintsRoute && view !== BoardCurrentView.SPRINTS) {
      setView(BoardCurrentView.SPRINTS);
    }
  }, [isSprintsRoute, view]);

  React.useEffect(() => {
    if (view === BoardCurrentView.CURRENT_SPRINT && !board.currentSprintId) {
      // most likely another collaborator closed the sprint
      // TODO: should we show a modal and allow the user to click continue
      // TODO: show the name of the person who closed the sprint
      message.info("The current sprint has been closed.");
      history.push(sprintsPath);
    }
  }, [view, sprintsPath, board.currentSprintId, history]);

  const closeBoardForm = React.useCallback(() => {
    setBoardForm(false);
  }, []);

  const closeTaskForm = React.useCallback(() => {
    setTaskForm(undefined);
  }, []);

  const onSelectMenuKey = React.useCallback(
    (key: BoardHeaderSettingsMenuKey) => {
      switch (key) {
        case BoardHeaderSettingsMenuKey.EDIT:
          setBoardForm(true);
          break;

        case BoardHeaderSettingsMenuKey.DELETE:
          onClickDeleteBoard(board);
          break;

        case BoardHeaderSettingsMenuKey.EDIT_STATUS:
          setOtherResourcesForm(BoardStatusResolutionAndLabelsFormType.STATUS);
          break;

        case BoardHeaderSettingsMenuKey.EDIT_LABELS:
          setOtherResourcesForm(BoardStatusResolutionAndLabelsFormType.LABELS);
          break;

        case BoardHeaderSettingsMenuKey.EDIT_RESOLUTIONS:
          setOtherResourcesForm(
            BoardStatusResolutionAndLabelsFormType.RESOLUTIONS
          );
          break;

        case BoardHeaderSettingsMenuKey.ADD_TASK:
          setTaskForm(true);
          break;

        case BoardHeaderSettingsMenuKey.SEARCH_TASKS:
          setShowSearch(true);
          break;

        case BoardHeaderSettingsMenuKey.SETUP_SPRINTS:
          setSprintOptionsForm(true);
          break;

        case BoardHeaderSettingsMenuKey.ADD_SPRINT:
          setSprintForm(true);
          break;

        case BoardHeaderSettingsMenuKey.END_SPRINT:
          onCloseSprint();
          break;
      }
    },
    [board, onClickDeleteBoard, onCloseSprint]
  );

  const onSelectView = React.useCallback(
    (key: BoardCurrentView) => {
      setView(key);
      switch (key) {
        case BoardCurrentView.SPRINTS: {
          history.push(sprintsPath);
          break;
        }

        default:
          history.push(tasksPath);
          break;
      }
    },
    [history, sprintsPath, tasksPath]
  );

  const renderTaskForm = () => {
    if (!taskForm) {
      return null;
    }

    return (
      <TaskFormInDrawer
        visible
        orgId={board.rootBlockId}
        task={isBoolean(taskForm) ? undefined : taskForm}
        board={board}
        onClose={closeTaskForm}
      />
    );
  };

  const renderBoardForm = () => {
    if (!boardForm) {
      return null;
    }

    return (
      <BoardFormInDrawer
        visible
        orgId={board.rootBlockId!}
        board={board}
        onClose={closeBoardForm}
      />
    );
  };

  const renderOtherResourcesForm = () => {
    if (!otherResourcesForm) {
      return null;
    }

    return (
      <BoardStatusResolutionAndLabelsForm
        visible
        board={board}
        active={otherResourcesForm}
        onClose={() => setOtherResourcesForm(undefined)}
      />
    );
  };

  const renderSprintForms = () => {
    if (!sprintOptionsForm && !sprintForm) {
      return null;
    }

    if (sprintOptionsForm) {
      return (
        <SprintOptionsFormInDrawer
          visible
          board={board}
          onClose={() => setSprintOptionsForm(false)}
        />
      );
    }

    if (sprintForm) {
      return (
        <SprintFormInDrawer
          visible
          navigateOnCreate
          board={board}
          sprint={isBoolean(sprintForm) ? undefined : sprintForm}
          onClose={() => setSprintForm(undefined)}
        />
      );
    }
  };

  const renderGroupedTasks = React.useCallback(
    (args: ITasksContainerRenderFnProps) => (
      <GroupedTasks
        {...args}
        board={board}
        groupType={groupBy}
        onClickUpdateTask={setTaskForm}
      />
    ),
    [board, groupBy]
  );

  const renderSprintsContainer = React.useCallback(
    (args: ITasksContainerRenderFnProps) => (
      <SprintsContainer
        {...args}
        board={board}
        onUpdateSprint={setSprintForm}
        onClickUpdateTask={setTaskForm}
      />
    ),
    [board]
  );

  const renderTasksPathView = React.useCallback(() => {
    const content = (
      <TasksContainer
        board={board}
        searchText={searchText}
        useCurrentSprint={view === BoardCurrentView.CURRENT_SPRINT}
        render={renderGroupedTasks}
      />
    );

    if (!board.currentSprintId || view !== BoardCurrentView.CURRENT_SPRINT) {
      return content;
    }

    return (
      <StyledContainer s={{ flexDirection: "column", width: "100%", flex: 1 }}>
        <StyledContainer s={{ margin: "16px 16px 0px 16px" }}>
          <CurrentSprintHeader board={board} />
        </StyledContainer>
        {content}
      </StyledContainer>
    );
  }, [board, searchText, view, renderGroupedTasks]);

  const renderSprintsPathView = React.useCallback(() => {
    return (
      <TasksContainer
        board={board}
        searchText={searchText}
        useCurrentSprint={view === BoardCurrentView.CURRENT_SPRINT}
        render={renderSprintsContainer}
      />
    );
  }, [board, searchText, view, renderSprintsContainer]);

  // TODO: should we move what TaskContainer does higher up so that it only happens once
  return (
    <StyledContainer
      s={{ flexDirection: "column", flex: 1, width: "100%", display: "flex" }}
    >
      {renderBoardForm()}
      {renderOtherResourcesForm()}
      {renderSprintForms()}
      {renderTaskForm()}
      <BoardHeader
        block={board}
        groupBy={groupBy}
        isAppMenuFolded={isAppMenuFolded}
        isMobile={isMobile}
        view={view}
        isSearchMode={showSearch}
        onChangeSearchText={setSearchText}
        onSelectCurrentView={onSelectView}
        onSelectGroupBy={setGroupBy}
        onSelectMenuKey={onSelectMenuKey}
        onToggleFoldAppMenu={onToggleFoldAppMenu}
      />
      <Switch>
        <Route path={tasksPath} render={renderTasksPathView} />
        <Route path={sprintsPath} render={renderSprintsPathView} />
      </Switch>
    </StyledContainer>
  );
};

export default Board;

const SPRINT = "sprint";

import path from "path";
import React from "react";
import { useHistory, useRouteMatch } from "react-router";
import { Route, Switch } from "react-router-dom";
import { BlockType, IBlock } from "../../models/block/block";
import { ISprint } from "../../models/sprint/types";
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
import GroupedTasks from "./GroupedTasks";
import SprintsContainer from "./SprintsContainer";
import TasksContainer from "./TasksContainer";
import { IBoardFormData, OnClickDeleteBlock } from "./types";

export interface IBoardProps {
    board: IBlock;
    blockPath: string;
    isMobile: boolean;
    isAppMenuFolded: boolean;
    onToggleFoldAppMenu: () => void;
    onClickDeleteBlock: OnClickDeleteBlock;
    onCloseSprint: () => void;
}

interface ISprintFormData {
    sprint?: ISprint;
}

const Board: React.FC<IBoardProps> = (props) => {
    const {
        board,
        blockPath,
        isMobile,
        isAppMenuFolded,
        onToggleFoldAppMenu,
        onClickDeleteBlock,
        onCloseSprint,
    } = props;

    const history = useHistory();

    const SPRINTS_PATH = path.normalize(`${blockPath}/sprints`);
    const TASKS_PATH = path.normalize(`${blockPath}/tasks`);
    const sprintsRouteMatch = useRouteMatch(SPRINTS_PATH);
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
    const [boardForm, setBoardForm] = React.useState<
        IBoardFormData | undefined
    >();

    const [sprintOptionsForm, setSprintOptionsForm] = React.useState(false);

    const [sprintForm, setSprintForm] = React.useState<
        ISprintFormData | undefined
    >();

    const [otherResourcesForm, setOtherResourcesForm] = React.useState<
        BoardStatusResolutionAndLabelsFormType | undefined
    >();

    React.useEffect(() => {
        if (isSprintsRoute && view !== BoardCurrentView.SPRINTS) {
            setView(BoardCurrentView.SPRINTS);
        }
    }, [isSprintsRoute, view]);

    const closeBoardForm = () => {
        setBoardForm(undefined);
    };

    const onSelectMenuKey = (key: BoardHeaderSettingsMenuKey) => {
        switch (key) {
            case BoardHeaderSettingsMenuKey.EDIT:
                setBoardForm({
                    type: BlockType.Board,
                    block: board,
                });
                break;

            case BoardHeaderSettingsMenuKey.DELETE:
                onClickDeleteBlock(board);
                break;

            case BoardHeaderSettingsMenuKey.EDIT_STATUS:
                setOtherResourcesForm(
                    BoardStatusResolutionAndLabelsFormType.STATUS
                );
                break;

            case BoardHeaderSettingsMenuKey.EDIT_LABELS:
                setOtherResourcesForm(
                    BoardStatusResolutionAndLabelsFormType.LABELS
                );
                break;

            case BoardHeaderSettingsMenuKey.EDIT_RESOLUTIONS:
                setOtherResourcesForm(
                    BoardStatusResolutionAndLabelsFormType.RESOLUTIONS
                );
                break;

            case BoardHeaderSettingsMenuKey.ADD_TASK:
                setBoardForm({
                    type: BlockType.Task,
                    parentBlock: board,
                });
                break;

            case BoardHeaderSettingsMenuKey.SEARCH_TASKS:
                setShowSearch(true);
                break;

            case BoardHeaderSettingsMenuKey.SETUP_SPRINTS:
                setSprintOptionsForm(true);
                break;

            case BoardHeaderSettingsMenuKey.ADD_SPRINT:
                setSprintForm({});
                break;

            case BoardHeaderSettingsMenuKey.END_SPRINT:
                onCloseSprint();
                break;
        }
    };

    const onSelectView = (key: BoardCurrentView) => {
        setView(key);

        switch (key) {
            case BoardCurrentView.SPRINTS: {
                history.push(SPRINTS_PATH);
                break;
            }

            default:
                history.push(TASKS_PATH);
                break;
        }
    };

    const updateTask = React.useCallback((task) => {
        setBoardForm({
            type: BlockType.Task,
            block: task,
        });
    }, []);

    const renderBoardForm = () => {
        if (!boardForm) {
            return null;
        }

        switch (boardForm.type) {
            case BlockType.Task: {
                return (
                    <TaskFormInDrawer
                        visible
                        orgId={board.rootBlockId!}
                        block={boardForm.block}
                        parentBlock={boardForm.parentBlock}
                        onClose={closeBoardForm}
                    />
                );
            }

            case BlockType.Board: {
                return (
                    <BoardFormInDrawer
                        visible
                        orgId={board.rootBlockId!}
                        block={boardForm.block}
                        onClose={closeBoardForm}
                    />
                );
            }

            default:
                return null;
        }
    };

    const renderOtherResourcesForm = () => {
        if (!otherResourcesForm) {
            return null;
        }

        return (
            <BoardStatusResolutionAndLabelsForm
                visible
                block={board}
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
                    sprint={sprintForm.sprint}
                    onClose={() => setSprintForm(undefined)}
                />
            );
        }
    };

    // TODO: should we move what TaskContainer does higher up so that it only happens once
    return (
        <StyledContainer
            s={{ flexDirection: "column", flex: 1, width: "100%" }}
        >
            {renderBoardForm()}
            {renderOtherResourcesForm()}
            {renderSprintForms()}
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
                <Route
                    path={TASKS_PATH}
                    render={() => (
                        <TasksContainer
                            board={board}
                            searchText={searchText}
                            useCurrentSprint={
                                view === BoardCurrentView.CURRENT_SPRINT
                            }
                            render={(args) => (
                                <GroupedTasks
                                    {...args}
                                    block={board}
                                    groupType={groupBy}
                                    onClickUpdateBlock={updateTask}
                                />
                            )}
                        />
                    )}
                />
                <Route
                    path={SPRINTS_PATH}
                    render={() => (
                        <TasksContainer
                            board={board}
                            searchText={searchText}
                            useCurrentSprint={
                                view === BoardCurrentView.CURRENT_SPRINT
                            }
                            render={(args) => (
                                <SprintsContainer
                                    {...args}
                                    board={board}
                                    onUpdateSprint={(sprint) =>
                                        setSprintForm({ sprint })
                                    }
                                    onClickUpdateBlock={updateTask}
                                />
                            )}
                        />
                    )}
                />
            </Switch>
        </StyledContainer>
    );
};

export default Board;

const SPRINT = "sprint";

import React from "react";
import { BlockType, IBlock } from "../../models/block/block";
import { ISprint } from "../../models/sprint/types";
import BoardFormInDrawer from "../boardBlock/BoardFormInDrawer";
import StyledContainer from "../styled/Container";
import TaskFormInDrawer from "../task/TaskFormInDrawer";
import BoardHeader from "./BoardHeader";
import {
    BoardCurrentView,
    BoardGroupBy,
    BoardHeaderSettingsMenuKey,
} from "./BoardHeaderOptionsMenu";
import BoardStatusResolutionAndLabelsForm, {
    BoardStatusResolutionAndLabelsFormType,
} from "./BoardStatusResolutionAndLabelsForm";
import { SearchTasksMode } from "./SearchTasksInput";
import TasksContainer from "./TasksContainer";
import { IBoardFormData, OnClickDeleteBlock } from "./types";

export interface IBoardProps {
    board: IBlock;
    isMobile: boolean;
    isAppMenuFolded: boolean;
    onToggleFoldAppMenu: () => void;
    onClickDeleteBlock: OnClickDeleteBlock;
}

interface IUpdateSprintFormData {
    sprint: ISprint;
}

const Board: React.FC<IBoardProps> = (props) => {
    const {
        board,
        isMobile,
        isAppMenuFolded,
        onToggleFoldAppMenu,
        onClickDeleteBlock,
    } = props;

    const [groupBy, setGroupBy] = React.useState(BoardGroupBy.STATUS);
    const [view, setView] = React.useState(BoardCurrentView.CURRENT_SPRINT);
    const [searchIn, setSearchIn] = React.useState(SearchTasksMode.ALL_TASKS);
    const [showSearch, setShowSearch] = React.useState(false);
    const [searchText, setSearchText] = React.useState("");
    const [boardForm, setBoardForm] = React.useState<
        IBoardFormData | undefined
    >();

    const [showSetupSprintsForm, setShowSetupSprintsForm] = React.useState(
        false
    );

    const [updateSprintForm, setUpdateSprintForm] = React.useState<
        IUpdateSprintFormData | undefined
    >();

    const [otherResourcesForm, setOtherResourcesForm] = React.useState<
        BoardStatusResolutionAndLabelsFormType | undefined
    >();

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
                setShowSetupSprintsForm(true);
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
        if (!showSetupSprintsForm || !updateSprintForm) {
            return null;
        }

        if (showSetupSprintsForm) {
            return null;
        }

        if (updateSprintForm) {
            return null;
        }
    };

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
                searchIn={searchIn}
                view={view}
                isSearchMode={showSearch}
                onChangeSearchMode={setSearchIn}
                onChangeSearchText={setSearchText}
                onSelectCurrentView={setView}
                onSelectGroupBy={setGroupBy}
                onSelectMenuKey={onSelectMenuKey}
                onToggleFoldAppMenu={onToggleFoldAppMenu}
            />
            <TasksContainer
                block={board}
                groupType={groupBy}
                searchText={searchText}
                useCurrentSprint={view === BoardCurrentView.CURRENT_SPRINT}
                onClickUpdateBlock={updateTask}
            />
        </StyledContainer>
    );
};

export default Board;

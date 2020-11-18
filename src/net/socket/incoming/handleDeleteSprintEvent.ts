import BlockSelectors from "../../../redux/blocks/selectors";
import { completeDeleteSprint } from "../../../redux/operations/sprint/deleteSprint";
import SprintActions from "../../../redux/sprints/actions";
import SprintSelectors from "../../../redux/sprints/selectors";
import { IStoreLikeObject } from "../../../redux/types";
import { IIncomingDeleteSprintPacket } from "../incomingEventTypes";

export default function handleDeleteSprintEvent(
    store: IStoreLikeObject,
    data: IIncomingDeleteSprintPacket
) {
    if (!data.errors) {
        const innerData = data;
        const sprint = SprintSelectors.getSprint(
            store.getState(),
            innerData.sprintId
        );
        const board = BlockSelectors.getBlock(store.getState(), sprint.boardId);

        completeDeleteSprint(sprint, board);
        store.dispatch(SprintActions.deleteSprint(innerData.sprintId));
    }
}

import BlockSelectors from "../../../redux/blocks/selectors";
import { completeDeleteSprint } from "../../../redux/operations/sprint/deleteSprint";
import SprintActions from "../../../redux/sprints/actions";
import SprintSelectors from "../../../redux/sprints/selectors";
import store from "../../../redux/store";
import { IIncomingDeleteSprintPacket } from "../incomingEventTypes";

export default function handleDeleteSprintEvent(
    data: IIncomingDeleteSprintPacket
) {
    if (data.data) {
        const innerData = data.data;
        const sprint = SprintSelectors.getSprint(
            store.getState(),
            innerData.sprintId
        );
        const board = BlockSelectors.getBlock(store.getState(), sprint.boardId);

        completeDeleteSprint(sprint, board);
        store.dispatch(SprintActions.deleteSprint(innerData.sprintId));
    }
}

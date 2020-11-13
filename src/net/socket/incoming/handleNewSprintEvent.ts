import BlockSelectors from "../../../redux/blocks/selectors";
import { completeAddSprint } from "../../../redux/operations/sprint/addSprint";
import SprintActions from "../../../redux/sprints/actions";
import store from "../../../redux/store";
import { IIncomingNewSprintPacket } from "../incomingEventTypes";

export default function handleNewSprintEvent(data: IIncomingNewSprintPacket) {
    if (data.data) {
        const innerData = data.data;
        const board = BlockSelectors.getBlock(
            store.getState(),
            innerData.sprint.boardId
        );

        store.dispatch(SprintActions.addSprint(innerData.sprint));
        completeAddSprint(innerData.sprint, board);
    }
}

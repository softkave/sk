import BlockSelectors from "../../../redux/blocks/selectors";
import { completeAddSprint } from "../../../redux/operations/sprint/addSprint";
import SprintActions from "../../../redux/sprints/actions";
import { IStoreLikeObject } from "../../../redux/types";
import { IIncomingNewSprintPacket } from "../incomingEventTypes";

export default function handleNewSprintEvent(
    store: IStoreLikeObject,
    data: IIncomingNewSprintPacket
) {
    if (data && !data.errors) {
        const board = BlockSelectors.getBlock(
            store.getState(),
            data.sprint.boardId
        );

        store.dispatch(SprintActions.addSprint(data.sprint));
        completeAddSprint(data.sprint, board);
    }
}

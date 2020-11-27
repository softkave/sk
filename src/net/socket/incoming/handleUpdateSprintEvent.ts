import SprintActions from "../../../redux/sprints/actions";
import { IStoreLikeObject } from "../../../redux/types";
import { IIncomingUpdateSprintPacket } from "../incomingEventTypes";

export default function handleUpdateSprintEvent(
    store: IStoreLikeObject,
    data: IIncomingUpdateSprintPacket
) {
    if (data && !data.errors) {
        store.dispatch(
            SprintActions.updateSprint({
                id: data.sprintId,
                data: data.data,
            })
        );
    }
}

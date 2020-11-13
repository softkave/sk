import SprintActions from "../../../redux/sprints/actions";
import store from "../../../redux/store";
import { IIncomingUpdateSprintPacket } from "../incomingEventTypes";

export default function handleUpdateSprintEvent(
    data: IIncomingUpdateSprintPacket
) {
    if (data.data) {
        const innerData = data.data;
        store.dispatch(
            SprintActions.updateSprint({
                id: innerData.sprintId,
                data: innerData.data,
            })
        );
    }
}

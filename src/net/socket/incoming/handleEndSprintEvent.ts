import { completeEndSprint } from "../../../redux/operations/sprint/endSprint";
import SprintActions from "../../../redux/sprints/actions";
import SprintSelectors from "../../../redux/sprints/selectors";
import store from "../../../redux/store";
import { IIncomingEndSprintPacket } from "../incomingEventTypes";

export default function handleEndSprintEvent(data: IIncomingEndSprintPacket) {
    if (data.data) {
        const result = data.data;
        const sprint = SprintSelectors.getSprint(
            store.getState(),
            result.sprintId
        );

        completeEndSprint(sprint, result.endedAt);
        store.dispatch(
            SprintActions.updateSprint({
                id: result.sprintId,
                data: {
                    endDate: result.endedAt,
                    endedBy: result.endedBy,
                },
            })
        );
    }
}

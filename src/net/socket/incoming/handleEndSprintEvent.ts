import { completeEndSprint } from "../../../redux/operations/sprint/endSprint";
import SprintActions from "../../../redux/sprints/actions";
import SprintSelectors from "../../../redux/sprints/selectors";
import { IStoreLikeObject } from "../../../redux/types";
import { IIncomingEndSprintPacket } from "../incomingEventTypes";

export default function handleEndSprintEvent(
    store: IStoreLikeObject,
    data: IIncomingEndSprintPacket
) {
    if (data && !data.errors) {
        const sprint = SprintSelectors.getSprint(
            store.getState(),
            data.sprintId
        );

        completeEndSprint(sprint, data.endedAt);
        store.dispatch(
            SprintActions.updateSprint({
                id: data.sprintId,
                data: {
                    endDate: data.endedAt,
                    endedBy: data.endedBy,
                },
            })
        );
    }
}

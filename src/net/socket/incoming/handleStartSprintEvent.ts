import { completeStartSprint } from "../../../redux/operations/sprint/startSprint";
import SprintActions from "../../../redux/sprints/actions";
import SprintSelectors from "../../../redux/sprints/selectors";
import { IStoreLikeObject } from "../../../redux/types";
import { IIncomingStartSprintPacket } from "../incomingEventTypes";

export default function handleStartSprintEvent(
    store: IStoreLikeObject,
    data: IIncomingStartSprintPacket
) {
    if (!data.errors) {
        store.dispatch(
            SprintActions.updateSprint({
                id: data.sprintId,
                data: {
                    startDate: data.startedAt,
                    startedBy: data.startedBy,
                },
            })
        );

        const sprint = SprintSelectors.getSprint(
            store.getState(),
            data.sprintId
        );

        completeStartSprint(sprint);
    }
}

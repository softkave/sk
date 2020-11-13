import { completeStartSprint } from "../../../redux/operations/sprint/startSprint";
import SprintActions from "../../../redux/sprints/actions";
import SprintSelectors from "../../../redux/sprints/selectors";
import store from "../../../redux/store";
import { IIncomingStartSprintPacket } from "../incomingEventTypes";

export default function handleStartSprintEvent(
    data: IIncomingStartSprintPacket
) {
    if (data.data) {
        const innerData = data.data;

        store.dispatch(
            SprintActions.updateSprint({
                id: innerData.sprintId,
                data: {
                    startDate: innerData.startedAt,
                    startedBy: innerData.startedBy,
                },
            })
        );

        const sprint = SprintSelectors.getSprint(
            store.getState(),
            innerData.sprintId
        );

        completeStartSprint(sprint);
    }
}

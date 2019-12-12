import moment from "moment";
import { IBlock } from "../../models/block/block";

export function sortAssignedTasksByDueDate(tasks: IBlock[]) {
  const startOfDay = moment()
    .hour(0)
    .minute(0)
    .second(0);
  const endOfDay = moment()
    .hour(23)
    .minute(59)
    .second(59);
  const endOfTomorrow = moment()
    .add(1, "day")
    .hour(23)
    .minute(59)
    .second(59);
  const endOfWeek = moment()
    .day("Saturday")
    .hour(23)
    .minute(59)
    .second(59);
  const endOfMonth = moment()
    .date(31)
    .hour(23)
    .minute(59)
    .second(59);
  const dueAlready: IBlock[] = [];
  const dueToday: IBlock[] = [];
  const dueTomorrow: IBlock[] = [];
  const dueThisWeek: IBlock[] = [];
  const dueThisMonth: IBlock[] = [];
  const rest: IBlock[] = [];

  tasks.forEach(task => {
    const dueDate = task.expectedEndAt && moment(task.expectedEndAt);

    if (dueDate) {
      if (dueDate.isBefore(startOfDay)) {
        dueAlready.push(task);
      } else if (dueDate.isBefore(endOfDay)) {
        dueToday.push(task);
      } else if (dueDate.isBefore(endOfTomorrow)) {
        dueTomorrow.push(task);
      } else if (dueDate.isBefore(endOfWeek)) {
        dueThisWeek.push(task);
      } else if (dueDate.isBefore(endOfMonth)) {
        dueThisMonth.push(task);
      } else {
        rest.push(task);
      }
    } else {
      rest.push(task);
    }
  });

  return {
    dueAlready,
    dueToday,
    dueTomorrow,
    dueThisWeek,
    dueThisMonth,
    rest
  };
}

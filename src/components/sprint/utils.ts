import * as yup from "yup";
import { sprintConstants } from "../../models/sprint/constants";
import { textPattern } from "../../models/user/validation";

const BACKLOG = "Backlog";

// TODO: add error messages and help to form items, like the max strings, and if they are required
const name = yup
    .string()
    .max(sprintConstants.maxNameLength)
    .matches(textPattern)
    .notOneOf(
        [BACKLOG],
        "'Backlog' is used by the system to describe tasks that do not have sprints"
    );

const duration = yup
    .string()
    .matches(new RegExp(`(${sprintConstants.durationOptions.join("|")})`));

const sprintValidationSchemas = {
    name,
    duration,
};

export default sprintValidationSchemas;

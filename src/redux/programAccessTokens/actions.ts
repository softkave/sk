import { IProgramAccessToken } from "../../definitions/programAccessToken";
import { getActions } from "../utils";

const ProgramAccessTokenActions = getActions<IProgramAccessToken>(
    "programAccessToken"
);

export default ProgramAccessTokenActions;

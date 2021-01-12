import { IProgramAccessToken } from "../../models/programAccessTokens/programAccessToken";
import { getActions } from "../utils";

const ProgramAccessTokenActions = getActions<IProgramAccessToken>(
    "programAccessToken"
);

export default ProgramAccessTokenActions;

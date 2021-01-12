import { IProgramAccessToken } from "../../models/programAccessTokens/programAccessToken";
import { getSelectors } from "../utils";

const ProgramAccessTokenSelectors = getSelectors<IProgramAccessToken>(
    "programAccessTokens"
);

export default ProgramAccessTokenSelectors;

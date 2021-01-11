import { IProgramAccessToken } from "../../definitions/programAccessToken";
import { getSelectors } from "../utils";

const ProgramAccessTokenSelectors = getSelectors<IProgramAccessToken>(
    "programAccessTokens"
);

export default ProgramAccessTokenSelectors;

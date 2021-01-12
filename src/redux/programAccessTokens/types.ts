import { IProgramAccessToken } from "../../models/programAccessTokens/programAccessToken";

export interface IProgramAccessTokensState {
    [key: string]: IProgramAccessToken;
}

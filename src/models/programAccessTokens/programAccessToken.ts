import { getFields, makeExtract } from "../../utils/extract";

// TODO: Add other fine-grain permission types
export enum ProgramAccessTokenPermission {
    Feedback = "Feedback", // Read feedback fields and create feedback
    FullAccess = "FullAccess", // Can  do everything in an organization
}

export interface IProgramAccessToken {
    programAccessTokenId: string;
    name: string;
    description?: string;
    organizationId: string;
    boardId?: string;
    createdBy: string;
    createdAt: string;
    updatedBy?: string;
    updatedAt?: string;
    token: string;
    requireHost?: boolean;
    hosts?: string[];
    permission: ProgramAccessTokenPermission;
}

export interface IProgramAccessTokenInput {
    name: string;
    description?: string;
    hosts?: string[];
    permission: ProgramAccessTokenPermission;
    requireHost?: boolean;
}

export const programAccessTokenConstants = {
    maxHosts: 20,
};

const tokenInputFields = getFields<IProgramAccessTokenInput>({
    name: true,
    description: true,
    hosts: true,
    permission: true,
    requireHost: true,
});

export const tokenInputExtractor = makeExtract(tokenInputFields);

import { BlockType } from "../block/block";

export interface IOrganization {
    customId: string;
    createdBy: string;
    createdAt: Date;
    type: BlockType.Organization;
    name?: string;
    description?: string;
    updatedAt?: Date;
    updatedBy?: string;
    color?: string;
}

export interface INewOrganizationInput {
    name: string;
    description?: string;
    color: string;
}

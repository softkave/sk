import {
    IPermission,
    IPermissionGroup,
    IUserAssignedPermissionGroup,
} from "../../models/access-control/types";
import auth from "../auth";
import { GetEndpointResult } from "../types";
import {
    addPermissionGroupsMutation,
    deletePermissionGroupsMutation,
    getResourcePermissionGroupsQuery,
    getResourcePermissionsQuery,
    getUserPermissionsQuery,
    permissionGroupExistsQuery,
    setPermissionsMutation,
    updatePermissionGroupsMutation,
} from "./schema";

interface IPermissionInput {
    permissionGroups: string[];
    users: string[];
}

export interface ISetPermissionsAPIParams {
    blockId: string;
    permissions: Array<{
        customId: string;
        data: Partial<IPermissionInput>;
    }>;
}

export type ISetPermissionsAPIResult = GetEndpointResult<{
    permissions: Array<{
        customId: string;
        updatedAt: string;
        updatedBy: string;
    }>;
}>;

async function setPermissions(
    params: ISetPermissionsAPIParams
): Promise<ISetPermissionsAPIResult> {
    return auth(
        null,
        setPermissionsMutation,
        params,
        "data.accessControl.setPermissions"
    );
}

interface IPermissionGroupInput {
    name: string;
    description?: string;
    prevId?: string;
    nextId?: string;
}

interface IAddPermissionGroupsPermissionGroupInput
    extends IPermissionGroupInput {
    users?: string[];
}

export interface IAddPermissionGroupsAPIParams {
    blockId: string;
    permissionGroups: Array<{
        tempId: string;
        data: IAddPermissionGroupsPermissionGroupInput;
    }>;
}

export type IAddPermissionGroupsAPIResult = GetEndpointResult<{
    permissionGroups: Array<{
        tempId: string;
        permissionGroup: IPermissionGroup;
    }>;
}>;

async function addPermissionGroups(
    params: IAddPermissionGroupsAPIParams
): Promise<IAddPermissionGroupsAPIResult> {
    return auth(
        null,
        addPermissionGroupsMutation,
        params,
        "data.accessControl.addPermissionGroups"
    );
}

export interface IUpdatePermissionGroupsPermissionGroupInput
    extends Partial<IPermissionGroupInput> {
    users?: {
        add: string[];
        remove: string[];
    };
}

export interface IUpdatePermissionGroupsAPIParams {
    blockId: string;
    permissionGroups: Array<{
        customId: string;
        data: Partial<IUpdatePermissionGroupsPermissionGroupInput>;
    }>;
}

export type IUpdatePermissionGroupsAPIResult = GetEndpointResult<{
    permissionGroups: Array<{
        customId: string;
        updatedAt: string;
        updatedBy: string;
    }>;
}>;

async function updatePermissionGroups(
    params: IUpdatePermissionGroupsAPIParams
): Promise<IUpdatePermissionGroupsAPIResult> {
    return auth(
        null,
        updatePermissionGroupsMutation,
        params,
        "data.accessControl.updatePermissionGroups"
    );
}

export interface IDeletePermissionGroupsAPIParams {
    blockId: string;
    permissionGroups: string[];
}

export type IDeletePermissionGroupsAPIResult = GetEndpointResult<{}>;

async function deletePermissionGroups(
    params: IDeletePermissionGroupsAPIParams
): Promise<IDeletePermissionGroupsAPIResult> {
    return auth(
        null,
        deletePermissionGroupsMutation,
        params,
        "data.accessControl.deletePermissionGroups"
    );
}

export interface IGetResourcePermissionsAPIParams {
    blockId: string;
}

export type IGetResourcePermissionsAPIResult = GetEndpointResult<{
    permissions: IPermission[];
}>;

async function getResourcePermissions(
    params: IGetResourcePermissionsAPIParams
): Promise<IGetResourcePermissionsAPIResult> {
    return auth(
        null,
        getResourcePermissionsQuery,
        params,
        "data.accessControl.getResourcePermissions"
    );
}

export interface IGetResourcePermissionGroupsAPIParams {
    blockId: string;
}

export type IGetResourcePermissionGroupsAPIResult = GetEndpointResult<{
    permissionGroups: IPermissionGroup[];
}>;

async function getResourcePermissionGroups(
    params: IGetResourcePermissionGroupsAPIParams
): Promise<IGetResourcePermissionGroupsAPIResult> {
    return auth(
        null,
        getResourcePermissionGroupsQuery,
        params,
        "data.accessControl.getResourcePermissionGroups"
    );
}

export interface IPermissionGroupExistsAPIParams {
    blockId: string;
    name: string;
}

export type IPermissionGroupExistsAPIResult = GetEndpointResult<{
    exists: boolean;
}>;

async function permissionGroupExists(
    params: IPermissionGroupExistsAPIParams
): Promise<IPermissionGroupExistsAPIResult> {
    return auth(
        null,
        permissionGroupExistsQuery,
        params,
        "data.accessControl.permissionGroupExists"
    );
}

export type IGetUserPermissionsAPIResult = GetEndpointResult<{
    permissionGroups: IUserAssignedPermissionGroup[];
}>;

async function getUserPermissions(): Promise<IGetUserPermissionsAPIResult> {
    return auth(
        null,
        getUserPermissionsQuery,
        {},
        "data.accessControl.getUserPermissions"
    );
}

export default class AccessControlAPI {
    public static setPermissions = setPermissions;
    public static addPermissionGroups = addPermissionGroups;
    public static updatePermissionGroups = updatePermissionGroups;
    public static deletePermissionGroups = deletePermissionGroups;
    public static getResourcePermissions = getResourcePermissions;
    public static getResourcePermissionGroups = getResourcePermissionGroups;
    public static permissionGroupExists = permissionGroupExists;
    public static getUserPermissions = getUserPermissions;
}

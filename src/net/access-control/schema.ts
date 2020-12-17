import { errorFragment } from "../fragments";

export const permissionGroupFragment = `
    fragment permissionGroupFragment on PermissionGroup {
        customId
        name
        lowerCasedName
        description
        createdBy
        createdAt
        updatedBy
        updatedAt
        resourceId
        resourceType
        prevId
        nextId
    }
`;

export const permissionFragment = `
    fragment permissionFragment on Permission {
        customId
        resourceType
        action
        permissionGroups
        users
        orgId
        permissionOwnerId
        createdBy
        createdAt
        updatedBy
        updatedAt
        available
    }
`;

export const userAssignedPermissionGroupFragment = `
    fragment userAssignedPermissionGroupFragment on UserAssignedPermissionGroup {
        userId
        orgId
        resourceId
        resourceType
        permissionGroupId
        addedAt
        addedBy
    }
`;

export const setPermissionsMutation = `
    ${errorFragment}
    mutation SetPermissionsMutation (
        $blockId: String!,
        $permissions: [SetPermissionsPermissionInput!]!
    ) {
        accessControl {
            setPermissions (
                blockId: $blockId,
                permissions: $permissions
            ) {
                errors {
                    ...errorFragment
                }
                permissions {
                    customId
                    updatedAt
                    updatedBy
                }
            }
        }
    }
`;

export const addPermissionGroupsMutation = `
    ${errorFragment}
    ${permissionGroupFragment}
    mutation AddPermissionGroupsMutation (
        $blockId: String!,
        $permissionGroups: [AddPermissionGroupsPermissionGroupInput!]!
    ) {
        accessControl {
            addPermissionGroups (
                blockId: $blockId,
                permissionGroups: $permissionGroups
            ) {
                errors {
                    ...errorFragment
                }
                permissionGroups {
                    tempId
                    permissionGroup {
                        ...permissionGroupFragment
                    }
                }
            }
        }
    }
`;

export const updatePermissionGroupsMutation = `
    ${errorFragment}
    mutation UpdatePermissionGroupsMutation (
        $blockId: String!,
        $permissionGroups: [UpdatePermissionGroupsPermissionGroupInput!]!
    ) {
        accessControl {
            updatePermissionGroups (
                blockId: $blockId,
                permissionGroups: $permissionGroups
            ) {
                errors {
                    ...errorFragment
                }
                permissionGroups {
                    customId
                    updatedAt
                    updatedBy
                }
            }
        }
    }
`;

export const deletePermissionGroupsMutation = `
    ${errorFragment}
    mutation DeletePermissionGroupMutation (
        $blockId: String!,
        $permissionGroups: [String!]!
    ) {
        accessControl {
            deletePermissionGroups (
                blockId: $blockId,
                permissionGroups: $permissionGroups
            ) {
                errors {
                    ...errorFragment
                }
            }
        }
    }
`;

export const getResourcePermissionsQuery = `
    ${permissionFragment}
    ${errorFragment}
    query GetResourcePermissionsQuery (
        $blockId: String!
    ) {
        accessControl {
            getResourcePermissions (blockId: $blockId) {
                errors {
                    ...errorFragment
                }
                permissions {
                    ...permissionFragment
                }
            }
        }
    }
`;

export const getResourcePermissionGroupsQuery = `
    ${permissionGroupFragment}
    ${errorFragment}
    query GetResourcePermissionGroupsQuery ($blockId: String!) {
        accessControl {
            getResourcePermissionGroups (blockId: $blockId) {
                errors {
                    ...errorFragment
                }
                permissionGroups {
                    ...permissionGroupFragment
                }
            }
        }
    }
`;

export const permissionGroupExistsQuery = `
    ${errorFragment}
    query PermissionGroupExistsQuery (
        $blockId: String!, 
        $name: String!
    ) {
        accessControl {
            permissionGroupExists (
                blockId: $blockId, 
                name: $name
            ) {
                errors {
                    ...errorFragment
                }
                exists
            }
        }
    }
`;

export const getUserPermissionsQuery = `
    ${userAssignedPermissionGroupFragment}
    ${errorFragment}
    query GetUserAssignedPermissionGroups {
        accessControl {
            getUserPermissions {
                errors {
                    ...errorFragment
                }
                permissionGroups {
                    ...userAssignedPermissionGroupsFragment
                }
            }
        }
    }
`;

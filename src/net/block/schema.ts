import {
    blockFragment,
    commentFragment,
    errorFragment,
    notificationFragment,
} from "../fragments";

const addBlockMutation = `
    ${errorFragment}
    ${blockFragment}
    mutation AddBlockMutation ($block: AddBlockInput!) {
        block {
            addBlock (block: $block) {
                errors {
                    ...errorFragment
                }
                block {
                    ...blockFragment
                }
            }
        }
    }
`;

const updateBlockMutation = `
    ${errorFragment}
    ${blockFragment}
    mutation UpdateBlockMutation ($blockId: String!, $data: UpdateBlockInput!) {
        block {
            updateBlock (blockId: $blockId, data: $data) {
                errors {
                    ...errorFragment
                }
                block {
                    ...blockFragment
                }
            }
        }
    }
`;

const deleteBlockMutation = `
    ${errorFragment}
    mutation DeleteBlockMutation ($blockId: String!) {
        block {
            deleteBlock (blockId: $blockId) {
                errors {
                    ...errorFragment
                }
            }
        }
    }
`;

const getRootBlocksQuery = `
    ${blockFragment}
    ${errorFragment}
    query GetUserRootBlocksQuery {
        block {
            getUserRootBlocks {
                errors {
                    ...errorFragment
                }
                blocks {
                    ...blockFragment
                }
            }
        }
    }
`;

const getBlockChildrenQuery = `
    ${blockFragment}
    ${errorFragment}
    query GetBlockChildrenQuery ($blockId: String!, $typeList: [String!]) {
        block {
            getBlockChildren (blockId: $blockId, typeList: $typeList) {
                errors {
                    ...errorFragment
                }
                blocks {
                    ...blockFragment
                }
            }
        }
    }
`;

const getTaskCommentsQuery = `
    ${commentFragment}
    ${errorFragment}
    query GetTaskCommentsQuery (
        $taskId: String!, 
    ) {
        comment {
            getComments (taskId: $taskId) {
                errors {
                    ...errorFragment
                }
                comments {
                    ...commentFragment
                }
            }
        }
    }
`;

const addCollaboratorsMutation = `
    ${errorFragment}
    ${notificationFragment}
    mutation AddCollaborators (
        $blockId: String!,
        $collaborators: [AddCollaboratorInput!]!
    ) {
        block {
            addCollaborators (blockId: $blockId, collaborators: $collaborators) {
                errors {
                    ...errorFragment
                }
                requests {
                    ...notificationFragment
                }
            }
        }
    }
`;

const removeCollaboratorMutation = `
    ${errorFragment}
    mutation RemoveCollaboratorsMutation ($blockId: String!, $collaboratorId: String!) {
        block {
            removeCollaborator (blockId: $blockId, collaboratorId: $collaboratorId) {
                errors {
                    ...errorFragment
                }
            }
        }
    }
`;

const revokeRequestMutation = `
    ${errorFragment}
    mutation RevokeCollaborationRequestMutation ($blockId: String!, $requestId: String!) {
        block {
            revokeCollaborationRequest (blockId: $blockId, requestId: $requestId) {
                errors {
                    ...errorFragment
                }
            }
        }
    }
`;

export {
    addBlockMutation,
    updateBlockMutation,
    deleteBlockMutation,
    getBlockChildrenQuery,
    blockFragment,
    addCollaboratorsMutation,
    getRootBlocksQuery,
    removeCollaboratorMutation,
    revokeRequestMutation,
    getTaskCommentsQuery,
};

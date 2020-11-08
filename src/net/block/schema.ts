import {
    blockFragment,
    errorFragment,
    notificationFragment,
} from "../fragments";

const addBlockMutation = `
    ${errorFragment}
    mutation AddBlockMutation ($block: AddBlockInput!) {
        block {
            addBlock (block: $block) {
                errors {
                    ...errorFragment
                }
            }
        }
    }
`;

const updateBlockMutation = `
  ${errorFragment}
  mutation UpdateBlockMutation ($blockId: String!, $data: UpdateBlockInput!) {
    block {
      updateBlock (blockId: $blockId, data: $data) {
        errors {
          ...errorFragment
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

const getUserRootBlocksQuery = `
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
                data {
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

const transferBlockMutation = `
  ${errorFragment}
  mutation DragAndDropMutation (
    $draggedBlockId: String!,
    $destinationBlockId: String!
  ) {
    block {
      transferBlock (
        draggedBlockId: $draggedBlockId,
        destinationBlockId: $destinationBlockId
      ) {
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
    getUserRootBlocksQuery as getRootBlocksQuery,
    removeCollaboratorMutation,
    revokeRequestMutation,
    transferBlockMutation,
};

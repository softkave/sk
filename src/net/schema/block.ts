import { blockFragment, errorFragment } from "../../models/fragments";

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
  mutation UpdateBlockMutation ($customId: String!, $data: UpdateBlockInput!) {
    block {
      updateBlock (customId: $customId, data: $data) {
        errors {
          ...errorFragment
        }
      }
    }
  }
`;

const deleteBlockMutation = `
  ${errorFragment}
  mutation DeleteBlockMutation ($customId: String!) {
    block {
      deleteBlock (customId: $customId) {
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
  query GetRootBlocksQuery {
    block {
      getRootBlocks {
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
  query GetBlockChildrenQuery ($customId: String!, $typeList: [String!]) {
    block {
      getBlockChildren (customId: $customId, typeList: $typeList) {
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
  mutation AddCollaborators (
    $customId: String!,
    $collaborators: [AddCollaboratorInput!]!
  ) {
    block {
      addCollaborators (customId: $customId, collaborators: $collaborators) {
        errors {
          ...errorFragment
        }
      }
    }
  }
`;

const removeCollaboratorMutation = `
  ${errorFragment}
  mutation RemoveCollaboratorsMutation ($customId: String!, $collaborator: String!) {
    block {
      removeCollaborator (customId: $customId, collaborator: $collaborator) {
        errors {
          ...errorFragment
        }
      }
    }
  }
`;

const revokeRequestMutation = `
  ${errorFragment}
  mutation RevokeCollaborationRequestMutation ($customId: String!, $request: String!) {
    block {
      revokeCollaborationRequest (customId: $customId, request: $request) {
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
    $draggedBlock: String!,
    $destinationBlock: String!
  ) {
    block {
      transferBlock (
        draggedBlock: $draggedBlock,
        destinationBlock: $destinationBlock
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
  getRootBlocksQuery,
  removeCollaboratorMutation,
  revokeRequestMutation,
  transferBlockMutation,
};

const { errorFragment } = require("./error");

const blockFragment = `
  fragment blockFragment on Block {
    customId
    name
    description
    priority
    expectedEndAt
    createdAt
    color
    updatedAt
    type
    parents
    createdBy
    position
    positionTimestamp
    tasks
    groups
    projects
    groupTaskContext
    groupProjectContext
    taskCollaborators {
      userId
      assignedAt
      assignedBy
      completedAt
    }
  }
`;

const addBlockMutation = `
  mutation AddBlockMutation ($block: AddBlockInput!) {
    block {
      addBlock (block: $block) {
        errors {
          field
          message
        }
      }
    }
  }
`;

const updateBlockMutation = `
  mutation UpdateBlockMutation ($block: BlockParamInput!, $data: UpdateBlockInput!) {
    block {
      updateBlock (block: $block, data: $data) {
        errors {
          field
          message
        }
      }
    }
  }
`;

const deleteBlockMutation = `
  mutation DeleteBlockMutation ($block: BlockParamInput!) {
    block {
      deleteBlock (block: $block) {
        errors {
          field
          message
        }
      }
    }
  }
`;

const getRoleBlocksQuery = `
  ${blockFragment}
  ${errorFragment}
  query GetRoleBlocksQuery {
    block {
      getRoleBlocks {
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
  query GetBlockChildrenQuery ($block: BlockParamInput!, $types: [String!]) {
    block {
      getBlockChildren (block: $block, types: $types) {
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
  mutation AddCollaborators (
    $block: BlockParamInput!, 
    $collaborators: [AddCollaboratorInput!]!
  ) {
    block {
      addCollaborators (block: $block, collaborators: $collaborators) {
        errors {
          field
          message
        }
      }
    }
  }
`;

const getCollaboratorsQuery = `
  ${errorFragment}
  query GetCollaboratorsQuery ($block: BlockParamInput!) {
    block {
      getCollaborators (block: $block) {
        errors {
          ...errorFragment
        }
        collaborators {
          name
          email
          customId
        }
      }
    }
  }
`;

const getCollabRequestsQuery = `
  ${errorFragment}
  query GetCollabRequestsQuery ($block: BlockParamInput!) {
    block {
      getCollabRequests (block: $block) {
        errors {
          ...errorFragment
        }
        requests {
          customId
          from {
            userId
            name
            blockId
            blockName
            blockType
          }
          createdAt
          body
          readAt
          to {
            email
            userId
          }
          statusHistory {
            status
            date
          }
          sentEmailHistory {
            date
          }
          type
          root
        }
      }
    }
  }
`;

const removeCollaboratorMutation = `
  ${errorFragment}
  mutation RemoveCollaboratorsMutation ($block: BlockParamInput!, $collaborator: String!) {
    block {
      removeCollaborator (block: $block, collaborator: $collaborator) {
        errors {
          ...errorFragment
        }
      }
    }
  }
`;

const toggleTaskMutation = `
  ${errorFragment}
  mutation ToggleTaskMutation ($block: BlockParamInput!,  $data: Boolean!) {
    block {
       toggleTask (block: $block, data: $data) {
        errors {
          ...errorFragment
        }
      }
    }
  }
`;

const revokeRequestMutation = `
  ${errorFragment}
  mutation RevokeRequestMutation ($block: BlockParamInput!, $request: String!) {
    block {
       revokeRequest (block: $block, request: $request) {
        errors {
          ...errorFragment
        }
      }
    }
  }
`;

const dragAndDropMutation = `
  ${errorFragment}
  mutation DragAndDropMutation (
    $sourceBlock: BlockParamInput!,
    $draggedBlock: BlockParamInput!,
    $destinationBlock: BlockParamInput,
    $dropPosition: Float!,
    $blockPosition: Float!,
    $draggedBlockType: String!,
    $groupContext: String!
  ) {
    block {
       dragAndDrop (
        sourceBlock: $sourceBlock,
        draggedBlock: $draggedBlock,
        destinationBlock: $destinationBlock,
        dropPosition: $dropPosition,
        blockPosition: $blockPosition,
        draggedBlockType: $draggedBlockType,
        groupContext: $groupContext
       ) {
        errors {
          ...errorFragment
        }
      }
    }
  }
`;

module.exports = {
  addBlockMutation,
  updateBlockMutation,
  deleteBlockMutation,
  getBlockChildrenQuery,
  blockFragment,
  addCollaboratorsMutation,
  getCollabRequestsQuery,
  getCollaboratorsQuery,
  getRoleBlocksQuery,
  removeCollaboratorMutation,
  toggleTaskMutation,
  revokeRequestMutation,
  dragAndDropMutation
};

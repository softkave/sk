import { errorFragment } from "./error";

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
  mutation UpdateBlockMutation ($block: BlockParamInput!, $data: UpdateBlockInput!) {
    block {
      updateBlock (block: $block, data: $data) {
        errors {
          ...errorFragment
        }
      }
    }
  }
`;

const deleteBlockMutation = `
  ${errorFragment}
  mutation DeleteBlockMutation ($block: BlockParamInput!) {
    block {
      deleteBlock (block: $block) {
        errors {
          ...errorFragment
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
  query GetBlockChildrenQuery ($block: BlockParamInput!, $types: [String!], $isBacklog: Boolean) {
    block {
      getBlockChildren (block: $block, types: $types, isBacklog: $isBacklog) {
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
    $block: BlockParamInput!, 
    $collaborators: [AddCollaboratorInput!]!
  ) {
    block {
      addCollaborators (block: $block, collaborators: $collaborators) {
        errors {
          ...errorFragment
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

const transferBlockMutation = `
  ${errorFragment}
  mutation DragAndDropMutation (
    $sourceBlock: BlockParamInput!,
    $draggedBlock: BlockParamInput!,
    $destinationBlock: BlockParamInput,
    $dropPosition: Float!,
    $blockPosition: Float!,
    $draggedBlockType: String!,
    $groupContext: String
  ) {
    block {
      transferBlock (
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

const updateAccessControlDataMutation = `
  ${errorFragment}
  mutation UpdateAccessControlDataMutation (
    $block: BlockParamInput!, $accessControlData: [AccessControlInput!]!) {
    block {
      updateAccessControlData (block: $block, accessControlData: $accessControlData) {
        errors {
          ...errorFragment
        }
      }
    }
  }
`;

const updateRolesMutation = `
  ${errorFragment}
  mutation UpdateRolesMutation ($block: BlockParamInput!, $roles: [String!]!) {
    block {
      updateRoles (block: $block, roles: $roles) {
        errors {
          ...errorFragment
        }
      }
    }
  }
`;

const assignRoleMutation = `
  ${errorFragment}
  mutation AssignRoleMutation (
    $block: BlockParamInput!, $collaborator: String!, $roleName: String!) {
    block {
      assignRole (block: $block, collaborator: $collaborator, roleName: $roleName) {
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
  getCollabRequestsQuery,
  getCollaboratorsQuery,
  getRoleBlocksQuery,
  removeCollaboratorMutation,
  toggleTaskMutation,
  revokeRequestMutation,
  transferBlockMutation,
  updateAccessControlDataMutation,
  updateRolesMutation,
  assignRoleMutation
};

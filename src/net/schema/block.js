const { errorFragment } = require("./error");
const { userPermissionFragment } = require("./user");

const blockFragment = `
  fragment blockFragment on Block {
    _id
    id
    name
    description
    priority
    expectedEndAt
    completedAt
    createdAt
    color
    updatedAt
    type
    parents
    data {
      dataType
      data
    }
    createdBy
    collaborators {
      userId
      data
      addedAt
      assignedAt
      assignedBy
    }
    acl {
      action
      level
    }
    roles {
      role
      level
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

const getBlocksQuery = `
  ${blockFragment}
  ${errorFragment}
  query GetBlocksQuery ($blocks: [BlockParamInput!]!) {
    block {
      getBlock (blocks: $blocks) {
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

const getPermissionBlocksQuery = `
  ${blockFragment}
  ${errorFragment}
  query GetPermissionBlocksQuery {
    block {
      getPermissionBlocks {
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
  Query GetBlockChildrenQuery ($block: BlockParamInput!, $types: [String!]) {
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
    $collaborators: [AddCollaboratorInput!]!,
    $body: String,
      $expiresAt: Float
  ) {
    block {
      addCollaborators (block: $block, collaborators: $collaborators, body: $body, expiresAt: $expiresAt) {
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
  ${userPermissionFragment}
  Query GetCollaboratorsQuery ($block: BlockParamInput!) {
    block {
      getCollaborators (block: $block) {
        errors {
          ...errorFragment
        }
        collaborators {
          name
          email
          id
          _id
          permissions {
            ...userPermissionFragment
          }
        }
      }
    }
  }
`;

const getCollabRequestsQuery = `
  ${errorFragment}
  ${userPermissionFragment}
  Query GetCollabRequestsQuery ($block: BlockParamInput!) {
    block {
      getCollabRequests (block: $block) {
        errors {
          ...errorFragment
        }
        requests {
          _id
          id
          from {
            userId
            name
            blockId
            blockName
          }
          createdAt
          body
          readAt
          to {
            email
            userId
          }
          response
          respondedAt
          type
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

const updateRolesMutation = `
  ${errorFragment}

  mutation UpdateRolesMutation ($block: BlockParamInput!,  $roles: [RoleInput!]!) {
    block {
       updateRoles (block: $block, roles: $roles) {
        errors {
          ...errorFragment
        }
      }
    }
  }
`;

const updateAclMutation = `
  ${errorFragment}

  mutation UpdateAclMutation ($block: BlockParamInput!, $acl: [AclItemInput!]!) {
    block {
       updateAcl (block: $block, acl: $acl) {
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

const assignRoleMutation = `
  ${errorFragment}

  mutation AssignRoleMutation ($block: BlockParamInput!, $collaborator: String!, $role: RoleInput!) {
    block {
       assignRole (block: $block, collaborator: $collaborator, role: $role) {
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
  getBlocksQuery,
  blockFragment,
  addCollaboratorsMutation,
  getCollabRequestsQuery,
  getCollaboratorsQuery,
  getPermissionBlocksQuery,
  removeCollaboratorMutation,
  toggleTaskMutation,
  updateRolesMutation,
  updateAclMutation,
  revokeRequestMutation,
  assignRoleMutation
};
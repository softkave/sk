import { blockFragment } from "./block";

export const userExistsQuery = `
  query UserExistsQuery (email: String!) {
    user {
      userExists(email: $email) {
        errors {
          field
          message
        }
        userExists
      }
    }
  }
`;

export const updateUserMutation = `
  mutation UpdateUserMutation($data: UpdateUserInput!) {
    user {
      updateUser(user: $user) {
        errors {
          field
          message
        }
      }
    }
  }
`;

export const userPermissionFragment = `
  fragment userPermissionFragment {
    role
    level
    assignedAt
    assignedBy
    type
    blockId
  }
`;

export const userLoginFragement = `
  ${userPermissionFragment}
  fragment userQueryResult on UserQueryResult {
    errors {
      field
      message
    }
    user {
      name
      email
      _id
      id
      createdAt
      lastNotificationCheckTime
      permissions {
        ...userPermissionFragment
      }
    }
    token
  }
`;

export const userSignupMutation = `
  ${userLoginFragement}
  mutation UserSignupMutation ($user: UserSignupInput!) {
    user {
      signup (user: $user) {
        ...userQueryResult
      }
    }
  }
`;

export const userLoginMutation = `
  ${userLoginFragement}
  mutation UserLoginMutation ($user: UserLoginInput!) {
    user {
      login (user: $user) {
        ...userQueryResult
      }
    }
  }
`;

export const forgotPasswordMutation = `
  mutation UserForgotPasswordMutation ($email: String!) {
    user {
      forgotPassword {
        errors {
          field
          message
        }
      }
    }
  }
`;

export const changePasswordMutation = `
  ${userLoginFragement}
  mutation UserChangePasswordMutation ($password: String!) {
    user {
      changePassword (password: $password) {
        ...userQueryResult
      }
    }
  }
`;

export const changePasswordWithTokenMutation = `
  ${userLoginFragement}
  mutation UserChangeWithTokenPasswordMutation (
    $password: String!
  ) {
    user {
      changePasswordWithToken(password: $password) {
        ...userQueryResult
      }
    }
  }
`;

export const getCollaborationRequestsQuery = `
  query GetCollaborationRequestsQuery {
    user {
      getCollaborationRequests {
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
          }
          response
          respondedAt
          permission {
            ...userPermissionFragment
          }
        }
      }
    }
  }
`;

export const updateCollaborationRequestMutation = `
  ${userLoginFragement}
  mutation UpdateCollaborationRequestMutation (
    $id: String!, $data: UpdateCollabRequestInput!
  ) {
    user {
      updateCollaborationRequest (id: $id, data: $data) {
        errors {
          field
          message
        }
      }
    }
  }
`;

export const respondToCollaborationRequestMutation = `
  ${blockFragment}
  mutation RespondToCollaborationRequestMutation (
    $id: String!, $response: String!
  ) {
    user {
      respondToCollaborationRequest (id: $id, response: $response) {
        errors {
          field
          message
        }
        block {
          ...blockFragment
        }
      }
    }
  }
`;

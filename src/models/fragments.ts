export const errorFragment = `
fragment errorFragment on Error {
  field
  message
  action
  name
}
`;

export const collaboratorFragment = `
fragment collaboratorFragment on Collaborator {
  name
  email
  customId
  color
}
`;

export const notificationFragment = `
fragment notificationFragment on Notification {
  customId
  to {
    email
  }
  body
  collaborationRequestFrom {
    userId
    name
    blockId
    blockName
    blockType
  }
  createdAt
  type
  readAt
  expiresAt
  statusHistory {
    status
    date
  }
  sentEmailHistory {
    date
  }
}
`;

export const userFragment = `
fragment userFragment on User {
  customId
  name
  email
  createdAt
  rootBlockId
  orgs {
    customId
  }
  color
  notificationsLastCheckedAt
}
`;

export const blockFragment = `
fragment blockFragment on Block {
  customId
  createdBy
  createdAt
  type
  name
  lowerCasedName
  description
  dueAt
  color
  updatedAt
  updatedBy
  parent
  rootBlockId
  assignees {
    userId
    assignedAt
    assignedBy
  }
  priority
  subTasks {
    customId
    description
    createdAt
    createdBy
    completedBy
    completedAt
  }
  boardStatuses {
    customId
    name
    color
    createdBy
    createdAt
    description
    updatedBy
    updatedAt
  }
  boardLabels {
    customId
    name
    color
    createdBy
    createdAt
    description
    updatedBy
    updatedAt
  }
  status
  statusAssignedBy
  statusAssignedAt
  labels {
    customId
    assignedBy
    assignedAt
  }
}
`;

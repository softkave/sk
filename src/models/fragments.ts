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
    from {
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
        updatedAt
        updatedBy
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
    boardResolutions {
        customId
        name
        createdBy
        createdAt
        description
        updatedBy
        updatedAt
    }
    status
    statusAssignedBy
    statusAssignedAt
    taskResolution
    labels {
        customId
        assignedBy
        assignedAt
    }
}
`;

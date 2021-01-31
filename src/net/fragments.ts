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

export const commentFragment = `
fragment commentFragment on Comment {
    customId
    taskId
    comment
    createdBy
    createdAt
    updatedAt
    updatedBy
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
    priority
    status
    statusAssignedBy
    statusAssignedAt
    taskResolution
    currentSprintId
    lastSprintId
    assignees {
        userId
        assignedAt
        assignedBy
    }
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
        position
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
    labels {
        customId
        assignedBy
        assignedAt
    }
    sprintOptions {
        duration
        updatedAt
        updatedBy
        createdAt
        createdBy
    }
    taskSprint {
        sprintId
        assignedAt
        assignedBy
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
}
`;

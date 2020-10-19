import { errorFragment } from "../../models/fragments";

export const sprintFragment = `
    fragment sprintFragment on Sprint {
        customId
        boardId
        orgId
        duration
        sprintIndex
        name
        startDate
        startedBy
        endDate
        endedBy
        createdAt
        createdBy
        updatedAt
        updatedBy
        createdAt
        createdBy
    }
`;

export const addSprintMutation = `
    ${errorFragment}
    ${sprintFragment}
    mutation AddSprintMutation ($boardId: String!, $name: String) {
        sprint {
            addSprint (boardId: $boardId, name: $name) {
                errors {
                    ...errorFragment
                }
                data {
                    ...sprintFragment
                }
            }
        }
    }
`;

export const deleteSprintMutation = `
    ${errorFragment}
    mutation DeleteSprintMutation ($sprintId: String!) {
        sprint {
            deleteSprint (sprintId: $sprintId) {
                errors {
                    ...errorFragment
                }
            }
        }
    }
`;

export const startSprintMutation = `
    ${errorFragment}
    mutation StartSprintMutation ($sprintId: String!) {
        sprint {
            startSprint (sprintId: $sprintId) {
                errors {
                    ...errorFragment
                }
                data {
                    startDate
                }
            }
        }
    }
`;

export const endSprintMutation = `
    ${errorFragment}
    mutation EndSprintMutation ($sprintId: String!) {
        sprint {
            endSprint (sprintId: $sprintId) {
                errors {
                    ...errorFragment
                }
                data {
                    endDate
                }
            }
        }
    }
`;

export const setupSprintMutation = `
    ${errorFragment}
    mutation SetupSprintMutation ($boardId: String!, $duration: String!) {
        sprint {
            setupSprint (boardId: $boardId, duration: $duration) {
                errors {
                    ...errorFragment
                }
                data {
                    createdAt: String
                }
            }
        }
    }
`;

export const updateSprintMutation = `
    ${errorFragment}
    mutation UpdateSprintMutation ($sprintId: String!, $data: UpdateSprintInput!) {
        sprint {
            updateSprint (sprintId: $sprintId, data: $data) {
                errors {
                    ...errorFragment
                }
                data {
                    updatedAt
                }
            }
        }
    }
`;

export const updateSprintOptionsMutation = `
    ${errorFragment}
    mutation UpdateSprintOptionsMutation ($boardId: String!, $data: UpdateSprintOptionsInput) {
        sprint {
            updateSprintOptions (boardId: $boardId, data: $data) {
                errors {
                    ...errorFragment
                }
                data {
                    updatedAt
                }
            }
        }
    }
`;

export const getSprintsQuery = `
    ${errorFragment}
    ${sprintFragment}
    query GetSprintsQuery ($boardId: String!) {
        sprint {
            getSprints (boardId: $boardId) {
                errors {
                    ...errorFragment
                }
                data {
                    ...sprintFragment
                }
            }
        }
    }
`;

export const sprintExistsQuery = `
    ${errorFragment}
    query SprintExistsQuery ($boardId: String!, $name: String!) {
        sprint {
            sprintExists (boardId: $boardId, name: $name) {
                errors {
                    ...errorFragment
                }
                data
            }
        }
    }
`;

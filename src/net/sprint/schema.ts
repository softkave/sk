import { errorFragment } from "../fragments";

export const sprintFragment = `
    fragment sprintFragment on Sprint {
        customId
        boardId
        orgId
        duration
        sprintIndex
        prevSprintId
        nextSprintId
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
    mutation AddSprintMutation ($boardId: String!, $data: NewSprintInput!) {
        sprint {
            addSprint (boardId: $boardId, data: $data) {
                errors {
                    ...errorFragment
                }
                sprint {
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
                startDate
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
                endDate
            }
        }
    }
`;

export const setupSprintMutation = `
    ${errorFragment}
    mutation SetupSprintMutation ($boardId: String!, $data: SprintOptionsInput!) {
        sprint {
            setupSprints (boardId: $boardId, data: $data) {
                errors {
                    ...errorFragment
                }
                sprintOptions {
                    createdAt
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
                sprint {
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
                sprintOptions {
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
                sprints {
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
                exists
            }
        }
    }
`;

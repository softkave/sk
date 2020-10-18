import { errorFragment } from "../../models/fragments";

export const addSprintMutation = `
  ${errorFragment}
  mutation AddSprintMutation () {
    sprint {
      addSprint () {
        errors {
          ...errorFragment
        }
      }
    }
  }
`;

export const deleteSprintMutation = `
  ${errorFragment}
  mutation DeleteSprintMutation () {
    sprint {
      deleteSprint () {
        errors {
          ...errorFragment
        }
      }
    }
  }
`;

export const startSprintMutation = `
  ${errorFragment}
  mutation StartSprintMutation () {
    sprint {
      startSprint () {
        errors {
          ...errorFragment
        }
      }
    }
  }
`;

export const endSprintMutation = `
  ${errorFragment}
  mutation EndSprintMutation () {
    sprint {
      endSprint () {
        errors {
          ...errorFragment
        }
      }
    }
  }
`;

export const setupSprintMutation = `
  ${errorFragment}
  mutation SetupSprintMutation () {
    sprint {
      setupSprint () {
        errors {
          ...errorFragment
        }
      }
    }
  }
`;

export const getSprintsMutation = `
  ${errorFragment}
  mutation GetSprintsMutation () {
    sprint {
      getSprints () {
        errors {
          ...errorFragment
        }
      }
    }
  }
`;

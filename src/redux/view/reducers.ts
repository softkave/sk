import { IViewAction } from "./actions";
import { CLEAR_VIEWS_FROM, POP_VIEW, PUSH_VIEW } from "./constants";
import IView from "./IView";
import { makeOrgsView } from "./orgs";

export interface IViewState {
  viewHistory: IView[];
}

export default function viewsReducer(
  state: IViewState = { viewHistory: [makeOrgsView()] },
  action: IViewAction
) {
  switch (action.type) {
    case PUSH_VIEW: {
      return {
        viewHistory: state.viewHistory.concat(action.payload.view)
      };
    }

    case POP_VIEW: {
      const newViewHistory = [...state.viewHistory];
      newViewHistory.pop();

      return {
        viewHistory: newViewHistory
      };
    }

    case CLEAR_VIEWS_FROM: {
      const viewIndex = state.viewHistory.findIndex(view => {
        return view.viewName === action.payload.viewName;
      });

      if (viewIndex !== -1) {
        const newViewHistory = state.viewHistory.slice(0, viewIndex);

        return {
          viewHistory: newViewHistory
        };
      } else {
        return state;
      }
    }

    default:
      return state;
  }
}

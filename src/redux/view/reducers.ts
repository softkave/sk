import { ILogoutUserAction } from "../session/actions";
import { LOGOUT_USER } from "../session/constants";
import { IViewAction } from "./actions";
import {
  CLEAR_VIEWS_FROM,
  POP_VIEW,
  PUSH_VIEW,
  REPLACE_VIEW
} from "./constants";
import { makeOrgsView } from "./orgs";
import IView from "./view";

export interface IViewState {
  viewHistory: IView[];
}

export default function viewsReducer(
  state: IViewState = { viewHistory: [makeOrgsView()] },
  action: IViewAction | ILogoutUserAction
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

    case REPLACE_VIEW: {
      const { viewName, view } = action.payload;
      const viewIndex = state.viewHistory.findIndex(
        nextView => nextView.viewName === viewName
      );

      if (viewIndex !== -1) {
        const newViewHistory = state.viewHistory.slice(0, viewIndex);
        newViewHistory.push(view);
        return { viewHistory: newViewHistory };
      }

      return state;
    }

    case CLEAR_VIEWS_FROM: {
      const { viewName } = action.payload;
      const viewIndex = state.viewHistory.findIndex(
        nextView => nextView.viewName === viewName
      );

      if (viewIndex !== -1) {
        const newViewHistory = state.viewHistory.slice(0, viewIndex);
        return { viewHistory: newViewHistory };
      }

      return state;
    }

    case LOGOUT_USER: {
      return { viewHistory: [] };
    }

    default:
      return state;
  }
}

import { ILogoutUserAction } from "../session/actions";
import { LOGOUT_USER } from "../session/constants";
import { IViewAction } from "./actions";
import { POP_VIEW, PUSH_VIEW } from "./constants";
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

    case LOGOUT_USER: {
      return {};
    }

    default:
      return state;
  }
}

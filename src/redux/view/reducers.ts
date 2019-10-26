import { ILogoutUserAction } from "../session/actions";
import { LOGOUT_USER } from "../session/constants";
import { IViewAction } from "./actions";
import { POP_VIEW, PUSH_VIEW, SET_ROOT_VIEW } from "./constants";
import IView from "./view";

export interface IViewState {
  viewHistory: IView[];
}

export default function viewsReducer(
  state: IViewState = { viewHistory: [] },
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

    case SET_ROOT_VIEW: {
      const views = [action.payload.view];
      return { viewHistory: views };
    }

    case LOGOUT_USER: {
      return { viewHistory: [] };
    }

    default:
      return state;
  }
}

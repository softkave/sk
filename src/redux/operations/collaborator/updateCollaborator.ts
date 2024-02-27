import { ICollaborator } from "../../../models/collaborator/types";
import { IStoreLikeObject } from "../../types";
import UserActions from "../../users/actions";

export function completeUpdateCollaborator(
  thunkAPI: IStoreLikeObject,
  collaborator: ICollaborator
) {
  thunkAPI.dispatch(
    UserActions.update({
      id: collaborator.customId,
      data: collaborator,
      meta: { arrayUpdateStrategy: "replace" },
    })
  );
}

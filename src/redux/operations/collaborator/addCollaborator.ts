import { ICollaborator } from "../../../models/collaborator/types";
import OrganizationActions from "../../organizations/actions";
import OrganizationSelectors from "../../organizations/selectors";
import { IStoreLikeObject } from "../../types";
import UserActions from "../../users/actions";
import UserSelectors from "../../users/selectors";

export function completeAddCollaborator(
  thunkAPI: IStoreLikeObject,
  collaborator: ICollaborator,
  organizationId: string
) {
  const exists = !!UserSelectors.getOne(thunkAPI.getState(), collaborator.customId);
  if (!exists) {
    thunkAPI.dispatch(
      UserActions.update({
        id: collaborator.customId,
        data: collaborator,
        meta: { arrayUpdateStrategy: "replace" },
      })
    );
  } else {
    thunkAPI.dispatch(
      UserActions.update({
        id: collaborator.customId,
        data: collaborator,
        meta: { arrayUpdateStrategy: "replace" },
      })
    );
  }

  let organization = OrganizationSelectors.assertGetOne(thunkAPI.getState(), organizationId);
  organization = { ...organization };
  organization.collaboratorIds = [...organization.collaboratorIds, collaborator.customId];
  thunkAPI.dispatch(
    OrganizationActions.update({
      id: organization.customId,
      data: organization,
      meta: { arrayUpdateStrategy: "replace" },
    })
  );
}

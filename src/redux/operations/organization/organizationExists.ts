import OrganizationAPI, {
  IWorkspaceExistsEndpointParams,
} from "../../../net/organization/endpoints";
import OrganizationSelectors from "../../organizations/selectors";
import { makeAsyncOp02NoPersist } from "../utils";

export const organizationExistsOpAction = makeAsyncOp02NoPersist(
  "op/organizations/organizationExists",
  async (arg: IWorkspaceExistsEndpointParams, thunkAPI, extras) => {
    if (extras.isDemoMode) {
      const name = arg.name.toLowerCase();
      const exists = OrganizationSelectors.filter(
        thunkAPI.getState(),
        (org) => org.name.toLowerCase() === name
      );
      return { exists };
    } else {
      return await OrganizationAPI.organizationExists(arg);
    }
  }
);

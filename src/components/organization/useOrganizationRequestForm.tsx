import React from "react";
import { IAppWorkspace } from "../../models/organization/types";
import AddCollaboratorFormInDrawer from "../collaborator/AddCollaboratorFormInDrawer";

export interface IUseOrganizationRequestFormHookProps {
  organization: IAppWorkspace;
}

const useOrganizationRequestForm = (props: IUseOrganizationRequestFormHookProps) => {
  const { organization } = props;
  const [showRequestForm, setShowRequestForm] = React.useState(false);
  const openRequestForm = React.useCallback(() => {
    setShowRequestForm(true);
  }, []);

  const closeRequestForm = React.useCallback(() => {
    // TODO: prompt the user if the user has unsaved changes
    setShowRequestForm(false);
  }, []);

  const formNode = showRequestForm && (
    <AddCollaboratorFormInDrawer visible orgId={organization.customId} onClose={closeRequestForm} />
  );

  return { formNode, openRequestForm, closeRequestForm };
};

export default useOrganizationRequestForm;

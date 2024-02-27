import { unwrapResult } from "@reduxjs/toolkit";
import { message } from "antd";
import assert from "assert";
import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { appOrganizationPaths } from "../../models/app/routes";
import { IAppWorkspace } from "../../models/organization/types";
import { formOrganizationFromExisting, newFormOrganization } from "../../models/organization/utils";
import { createOrganizationOpAction } from "../../redux/operations/organization/createOrganization";
import { updateOrganizationOpAction } from "../../redux/operations/organization/updateOrganization";
import { AppDispatch } from "../../redux/types";
import { clone } from "../../utils/utils";
import blockValidationSchemas from "../block/validation";
import { useFormBag } from "../hooks/useFormBag";
import PageDrawer from "../utils/PageDrawer";
import AppForm from "../utils/form/AppForm";
import { blockFormItemInputs } from "../utils/form/inputs/blockInputs";
import { generalFormItemInputs } from "../utils/form/inputs/inputRenders";
import { IFormBagHelpers, IFormItem } from "../utils/form/types";
import { handleFormError, makeFormItemSaveFn } from "../utils/form/utils";

export interface IWorkspaceFormValues {
  name: string;
  color: string;
  description?: string;
}

export interface IWorkspaceFormProps {
  org?: IAppWorkspace;
  onClose: () => void;
}

const OrganizationForm: React.FC<IWorkspaceFormProps> = (props) => {
  const { org, onClose } = props;
  const dispatch: AppDispatch = useDispatch();
  const history = useHistory();

  const onCreate = async (
    values: IWorkspaceFormValues,
    helpers: IFormBagHelpers<IWorkspaceFormValues>
  ) => {
    const result = await dispatch(createOrganizationOpAction({ organization: values }));
    const loadingState = unwrapResult(result);
    if (loadingState.value) {
      message.success("Organization created successfully");
      history.push(appOrganizationPaths.organization(loadingState.value.customId));
      onClose();
    } else {
      handleFormError(loadingState, helpers, "Error creating organization", "organization");
    }

    helpers.setSubmitting(false);
  };

  const onUpdate = async (
    values: Partial<IWorkspaceFormValues>,
    helpers: IFormBagHelpers<IWorkspaceFormValues>
  ) => {
    assert(org);
    const result = await dispatch(
      updateOrganizationOpAction({ organizationId: org.customId, data: values })
    );
    const loadingState = unwrapResult(result);
    if (loadingState.value) {
      message.success("Organization updated successfully");
      onClose();
      return;
    }
    handleFormError(loadingState, helpers, "Error updating organization", "data");
  };

  const [initialValues] = React.useState<IWorkspaceFormValues>(() =>
    org ? formOrganizationFromExisting(org) : newFormOrganization()
  );
  const { bag } = useFormBag({
    onSubmit: onCreate,
    initialValues: initialValues,
    validationSchema: blockValidationSchemas.org,
  });

  const isNewOrg = !org;
  const formItems: Array<IFormItem<IWorkspaceFormValues>> = [
    {
      formItemProps: {
        label: "Name",
        required: true,
      },
      name: "name",
      input: clone(blockFormItemInputs.name, {
        autoFocus: true,
        placeholder: "Organization name",
      }),
      save: makeFormItemSaveFn(onUpdate),
      defaultEditing: isNewOrg,
      disabled: bag.isSubmitting,
      excludeButtons: isNewOrg,
    },
    {
      formItemProps: {
        label: "Select Color",
      },
      name: "color",
      render: generalFormItemInputs.renderColor,
      save: makeFormItemSaveFn(onUpdate),
      defaultEditing: isNewOrg,
      disabled: bag.isSubmitting,
      excludeButtons: isNewOrg,
    },
    {
      formItemProps: {
        label: "Description",
      },
      name: "description",
      input: clone(blockFormItemInputs.description, {
        placeholder: "Organization description",
      }),
      save: makeFormItemSaveFn(onUpdate),
      defaultEditing: isNewOrg,
      disabled: bag.isSubmitting,
      excludeButtons: isNewOrg,
    },
  ];

  return (
    <PageDrawer defaultOpen onClose={onClose} title={org ? org.name : "Organization"}>
      <AppForm
        includeSaveBtn
        bag={bag as any}
        items={formItems as any}
        isSubmitting={bag.isSubmitting}
      />
    </PageDrawer>
  );
};

export default React.memo(OrganizationForm);

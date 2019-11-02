import { Button, Form, Input } from "antd";
import moment from "moment";
import React from "react";
import { blockConstants } from "../../models/block/constants";
import { INotification } from "../../models/notification/notification";
import { notificationErrorMessages } from "../../models/notification/notificationErrorMessages";
import { IUser } from "../../models/user/user";
import findItem from "../../utils/findItem";
import FormError from "../form/FormError";
import { getGlobalError, IFormikFormBaseProps } from "../form/formik-utils";
import {
  FormBody,
  FormBodyContainer,
  FormControls,
  FormScrollList,
  StyledForm
} from "../form/FormStyledComponents";
import {
  IAddCollaboratorFormItemError,
  IAddCollaboratorFormItemValues
} from "./AddCollaboratorFormItem.jsx";
import AddCollaboratorFormItemList from "./AddCollaboratorFormItemList";
import ExpiresAt from "./ExpiresAt";

const emailExistsErrorMessage = "Email addresss has been entered already";

// TODO: Test not allowing action on an expired collaboration request
export interface IAddCollaboratorFormValues {
  message?: string;
  expiresAt?: number;
  requests: IAddCollaboratorFormItemValues[];
}

export interface IAddCollaboratorFormProps
  extends IFormikFormBaseProps<IAddCollaboratorFormValues> {
  existingCollaborators: IUser[];
  existingCollaborationRequests: INotification[];
}

export default class AddCollaboratorForm extends React.PureComponent<
  IAddCollaboratorFormProps
> {
  public render() {
    const {
      values,
      errors,
      touched,
      handleChange,
      handleBlur,
      handleSubmit,
      isSubmitting,
      setFieldValue,
      setFieldError
    } = this.props;

    const globalError = getGlobalError(errors);

    return (
      <StyledForm onSubmit={handleSubmit}>
        <FormBodyContainer>
          <FormScrollList>
            <FormBody>
              {globalError && (
                <Form.Item>
                  <FormError error={globalError} />
                </Form.Item>
              )}
              <Form.Item
                label="Default Message"
                help={
                  touched.message && <FormError>{errors.message}</FormError>
                }
              >
                <Input.TextArea
                  autosize={{ minRows: 2, maxRows: 6 }}
                  autoComplete="off"
                  name="message"
                  value={values.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Form.Item>
              <Form.Item
                label="Default Expiration Date"
                help={<FormError>{errors.expiresAt}</FormError>}
              >
                <ExpiresAt
                  minDate={moment()
                    .subtract(1, "day")
                    .endOf("day")}
                  onChange={value => setFieldValue("expiresAt", value)}
                  value={values.expiresAt}
                />
              </Form.Item>
              <Form.Item label="Requests">
                <AddCollaboratorFormItemList
                  value={values.requests}
                  maxRequests={blockConstants.maxAddCollaboratorValuesLength}
                  onChange={value => {
                    setFieldValue("requests", value);
                    setFieldError("requests", this.getErrorFromRequests(
                      value
                    ) as any);
                  }}
                  errors={errors.requests}
                />
              </Form.Item>
            </FormBody>
          </FormScrollList>
          <FormControls>
            <Button
              block
              type="primary"
              htmlType="submit"
              loading={isSubmitting}
            >
              Send Requests
            </Button>
          </FormControls>
        </FormBodyContainer>
      </StyledForm>
    );
  }

  private getErrorFromRequests(requests: IAddCollaboratorFormItemValues[]) {
    const { existingCollaborationRequests, existingCollaborators } = this.props;
    const errors: Array<
      IAddCollaboratorFormItemError | undefined
    > = requests.map((req, index) => {
      const existingRequest = findItem(
        requests,
        req,
        (request1, request2) => request1.email === request2.email,
        index
      );

      if (existingRequest) {
        return { email: emailExistsErrorMessage };
      }

      const collaborator = findItem(
        existingCollaborators,
        req,
        (user, requestItem) => user.email === requestItem.email
      );

      if (collaborator) {
        return {
          email:
            notificationErrorMessages.sendingRequestToAnExistingCollaborator
        };
      }

      const notification = findItem(
        existingCollaborationRequests,
        req,
        (notificationItem, requestItem) =>
          notificationItem.to.email === requestItem.email
      );

      if (notification) {
        return { email: notificationErrorMessages.requestHasBeenSentBefore };
      }
    });

    return errors;
  }
}

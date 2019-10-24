import { Button, Form, Input } from "antd";
import { Formik } from "formik";
import moment from "moment";
import React from "react";
import * as yup from "yup";
import { blockConstants } from "../../models/block/constants";
import { notificationConstants } from "../../models/notification/constants";
import { INotification } from "../../models/notification/notification";
import { notificationErrorMessages } from "../../models/notification/notificationErrorMessages";
import { IUser } from "../../models/user/user";
import { userErrorMessages } from "../../models/user/userErrorMessages";
import { getErrorMessageWithMax } from "../../models/validationErrorMessages";
import IOperation from "../../redux/operations/operation";
import cast from "../../utils/cast";
import findItem from "../../utils/findItem";
import FormError from "../form/FormError";
import {
  FormBody,
  FormBodyContainer,
  FormControls,
  FormScrollList,
  StyledForm
} from "../form/FormInternals";
import { applyOperationToFormik, getGlobalError } from "../formik-utils";
import modalWrap from "../modalWrap.jsx";
import {
  IAddCollaboratorFormItemData,
  IAddCollaboratorFormItemError
} from "./AddCollaboratorFormItem.jsx";
import AddCollaboratorFormItemList from "./AddCollaboratorFormItemList";
import ExpiresAt from "./ExpiresAt";

const emailExistsErrorMessage = "Email addresss has been entered already";

const validationSchema = yup.object().shape({
  message: yup
    .string()
    .max(notificationConstants.maxAddCollaboratorMessageLength),
  expiresAt: yup.number(),
  requests: yup
    .array()
    .of(
      yup.object().shape({
        email: yup.string().email(userErrorMessages.invalidEmail),
        body: yup
          .string()
          .max(notificationConstants.maxAddCollaboratorMessageLength, () => {
            return getErrorMessageWithMax(
              notificationConstants.maxAddCollaboratorMessageLength,
              "string"
            );
          }),
        expiresAt: yup.number()
      })
    )
    .max(blockConstants.maxAddCollaboratorValuesLength)
    .required()
});

// TODO: Test not allowing action on an expired collaboration request

export interface IAddCollaboratorFormData {
  message?: string;
  expiresAt?: number;
  requests: IAddCollaboratorFormItemData[];
}

export interface IAddCollaboratorFormProps {
  existingCollaborators: IUser[];
  existingCollaborationRequests: INotification[];
  onSendRequests: (value: IAddCollaboratorFormData) => void;
  operation?: IOperation;
}

class AddCollaboratorForm extends React.PureComponent<
  IAddCollaboratorFormProps
> {
  private formikRef: React.RefObject<
    Formik<IAddCollaboratorFormData>
  > = React.createRef();

  public componentDidMount() {
    applyOperationToFormik(this.props.operation, this.formikRef);
  }

  public componentDidUpdate() {
    applyOperationToFormik(this.props.operation, this.formikRef);
  }

  public render() {
    const { onSendRequests } = this.props;

    return (
      <Formik
        ref={this.formikRef}
        initialValues={cast<IAddCollaboratorFormData>({ requests: [] })}
        onSubmit={values => {
          onSendRequests(values);
        }}
        validationSchema={validationSchema}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          setFieldValue,
          setFieldError
        }) => {
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
                      help={<FormError>{errors.message}</FormError>}
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
                        maxRequests={
                          blockConstants.maxAddCollaboratorValuesLength
                        }
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
        }}
      </Formik>
    );
  }

  private getErrorFromRequests(requests: IAddCollaboratorFormItemData[]) {
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

export default modalWrap(AddCollaboratorForm, "Collaboration Request");

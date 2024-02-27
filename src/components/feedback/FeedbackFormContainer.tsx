import { unwrapResult } from "@reduxjs/toolkit";
import { message } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ISendFeedbackEndpointErrors } from "../../net/system/api";
import { sendFeedbackOpAction } from "../../redux/operations/system/sendFeedback";
import SessionSelectors from "../../redux/session/selectors";
import { AppDispatch } from "../../redux/types";
import { flattenErrorList } from "../../utils/utils";
import { IFormError } from "../utils/types";
import FeedbackForm, { IFeedbackFormValues } from "./FeedbackForm";
import FeedbackSentMessage from "./FeedbackSentMessage";

export interface IFeedbackFormContainerProps {
  onCancel: () => void;
}

const FeedbackFormContainer: React.FC<IFeedbackFormContainerProps> = (props) => {
  const { onCancel } = props;

  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<IFormError<ISendFeedbackEndpointErrors> | undefined>();

  const [showFeedbackSentMessage, setShowFeedbackSentMessage] = React.useState(false);

  const toggleFeedbackSentMessage = React.useCallback(
    () => setShowFeedbackSentMessage(!showFeedbackSentMessage),
    [showFeedbackSentMessage]
  );

  const dispatch: AppDispatch = useDispatch();

  const user = useSelector(SessionSelectors.assertGetUser);
  const [feedback, setFeedback] = React.useState<IFeedbackFormValues>({
    notifyUserOnResolution: !!user,
    notifyEmail: user?.email,
    feedback: "",
  });

  const onSubmit = async (values: IFeedbackFormValues) => {
    const data = { ...feedback, ...values };

    setLoading(true);
    setFeedback(data);

    const result = await dispatch(
      sendFeedbackOpAction({
        ...values,
      })
    );

    const op = unwrapResult(result);

    if (op.error) {
      const flattenedErrors = flattenErrorList(op.error);
      setErrors({
        errors: flattenedErrors,
        errorList: op.error,
      });

      message.error("Error sending feedback");
    } else {
      toggleFeedbackSentMessage();
      message.success("Feedback sent successfully");
    }

    setLoading(false);
  };

  if (showFeedbackSentMessage) {
    return (
      <FeedbackSentMessage
        visible
        onOk={toggleFeedbackSentMessage}
        onCancel={() => {
          onCancel();
        }}
      />
    );
  }

  return (
    <FeedbackForm
      user={user}
      value={feedback}
      errors={errors?.errors}
      onClose={onCancel}
      onSubmit={onSubmit}
      isSubmitting={loading}
    />
  );
};

export default React.memo(FeedbackFormContainer);

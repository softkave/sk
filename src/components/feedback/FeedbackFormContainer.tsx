import { unwrapResult } from "@reduxjs/toolkit";
import { message } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ISendFeedbackEndpointErrors } from "../../net/system/api";
import { sendFeedbackOpAction } from "../../redux/operations/system/sendFeedback";
import SessionSelectors from "../../redux/session/selectors";
import { AppDispatch } from "../../redux/types";
import cast from "../../utils/cast";
import { flattenErrorList } from "../../utils/utils";
import { getOpData } from "../hooks/useOperation";
import { IFormError } from "../utilities/types";
import FeedbackForm, { IFeedbackFormValues } from "./FeedbackForm";

export interface IFeedbackFormContainerProps {
    onClose: () => void;
}

const FeedbackFormContainer: React.FC<IFeedbackFormContainerProps> = (
    props
) => {
    const { onClose } = props;

    const [loading, setLoading] = React.useState(false);
    const [errors, setErrors] = React.useState<
        IFormError<ISendFeedbackEndpointErrors> | undefined
    >();

    const dispatch: AppDispatch = useDispatch();

    const user = useSelector(SessionSelectors.assertGetUser);
    const [feedback, setFeedback] = React.useState<IFeedbackFormValues>(
        cast<IFeedbackFormValues>({
            notifyUserOnResolution: !!user,
            notifyUserEmail: user?.email,
        })
    );

    const onSubmit = async (values: IFeedbackFormValues) => {
        const data = { ...feedback, ...values };

        setLoading(true);
        setFeedback(data);

        const result = await dispatch(
            sendFeedbackOpAction({
                ...values,
                deleteOpOnComplete: true,
            })
        );

        const op = unwrapResult(result);

        if (!op) {
            return;
        }

        const opData = getOpData(op);

        if (opData.isCompleted) {
            message.success("Feedback sent successfully");
        } else if (opData.isError) {
            const flattenedErrors = flattenErrorList(opData.error);
            setErrors({
                errors: flattenedErrors,
                errorList: opData.error,
            });

            message.error("Error sending feedback");
        }

        setLoading(false);
    };

    return (
        <FeedbackForm
            user={user}
            value={feedback}
            errors={errors?.errors}
            onClose={onClose}
            onSubmit={onSubmit}
            isSubmitting={loading}
        />
    );
};

export default React.memo(FeedbackFormContainer);

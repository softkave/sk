import { unwrapResult } from "@reduxjs/toolkit";
import { message } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendFeedbackOpAction } from "../../redux/operations/system/sendFeedback";
import SessionSelectors from "../../redux/session/selectors";
import { AppDispatch } from "../../redux/types";
import cast from "../../utils/cast";
import { flattenErrorListWithDepthInfinite } from "../../utils/utils";
import useOperation, { getOpStats } from "../hooks/useOperation";
import FeedbackForm, { IFeedbackFormValues } from "./FeedbackForm";

export interface IFeedbackFormContainerProps {
    onClose: () => void;
}

const FeedbackFormContainer: React.FC<IFeedbackFormContainerProps> = (
    props
) => {
    const { onClose } = props;

    const dispatch: AppDispatch = useDispatch();

    const user = useSelector(SessionSelectors.assertGetUser);
    const [feedback, setFeedback] = React.useState<IFeedbackFormValues>(
        cast<IFeedbackFormValues>({
            notifyUserOnResolution: !!user,
            notifyUserEmail: user?.email,
        })
    );

    const operationStatus = useOperation();
    const errors = operationStatus.error
        ? flattenErrorListWithDepthInfinite(operationStatus.error)
        : undefined;

    const onSubmit = async (values: IFeedbackFormValues) => {
        const data = { ...feedback, ...values };
        setFeedback(data);

        const result = await dispatch(
            sendFeedbackOpAction({
                ...values,
                opId: operationStatus.opId,
            })
        );

        const op = unwrapResult(result);

        if (!op) {
            return;
        }

        const opStat = getOpStats(op);

        if (opStat.isCompleted) {
            message.success("Feedback sent successfully");
        } else if (opStat.isError) {
            message.error("Error sending feedback");
        }
    };

    return (
        <FeedbackForm
            user={user}
            value={feedback}
            errors={errors}
            onClose={onClose}
            onSubmit={onSubmit}
            isSubmitting={operationStatus.isLoading}
        />
    );
};

export default React.memo(FeedbackFormContainer);

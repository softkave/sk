import { Typography } from "antd";
import isString from "lodash/isString";
import React from "react";
import { IAppError } from "../net/types";
import EmptyMessage from "./EmptyMessage";

export interface IMessageProps {
    message: Error | IAppError | string;
    listIndex?: number; // For error list, to show empty icon ony once
}

const GeneralError: React.FC<IMessageProps> = (props) => {
    const { message, children, listIndex } = props;

    let nodeMsg: React.ReactNode = children || "An error occurred.";

    if (isString(message)) {
        nodeMsg = message;
    } else if (message instanceof Error) {
        nodeMsg = message.message;
    }

    const node = (
        <Typography.Text
            style={{
                fontSize: "16px",
                display: "inline-block",
                marginTop: "12px",
            }}
            type="secondary"
        >
            {nodeMsg}
        </Typography.Text>
    );

    if (listIndex && listIndex > 0) {
        return node;
    }

    return <EmptyMessage>{node}</EmptyMessage>;
};

export default GeneralError;

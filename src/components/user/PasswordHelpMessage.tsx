import { InfoCircleTwoTone } from "@ant-design/icons";
import { Tooltip, Typography } from "antd";
import React from "react";
import { messages } from "../../models/messages";

export interface IPasswordHelpMessageProps {}

const PasswordHelpMessage = (props) => {
    const symbolsNode = React.useMemo(() => {
        return (
            <span>
                {messages.validPasswordSymbols.split("").map((char) => (
                    <Typography.Text keyboard key={char}>
                        {char}
                    </Typography.Text>
                ))}
            </span>
        );
    }, []);

    return (
        <Typography.Text>
            {messages.provideValidPasswordWithoutSymbols}{" "}
            <Tooltip title={symbolsNode}>
                <InfoCircleTwoTone />
            </Tooltip>
        </Typography.Text>
    );
};

export default PasswordHelpMessage;

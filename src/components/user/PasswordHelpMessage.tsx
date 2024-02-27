import { InfoCircleTwoTone } from "@ant-design/icons";
import { Tooltip, Typography } from "antd";
import React from "react";
import { appMessages } from "../../models/messages";

export interface IPasswordHelpMessageProps {}

const PasswordHelpMessage = (props) => {
  const symbolsNode = React.useMemo(() => {
    return (
      <span>
        {appMessages.validPasswordSymbols.split("").map((char) => (
          <Typography.Text keyboard key={char}>
            {char}
          </Typography.Text>
        ))}
      </span>
    );
  }, []);

  return (
    <Typography.Text>
      {appMessages.provideValidPasswordWithoutSymbols}{" "}
      <Tooltip title={symbolsNode}>
        <InfoCircleTwoTone />
      </Tooltip>
    </Typography.Text>
  );
};

export default PasswordHelpMessage;

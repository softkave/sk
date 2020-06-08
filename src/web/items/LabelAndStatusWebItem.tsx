import { Typography } from "antd";
import React from "react";
import { DraggableProvided, DraggableStateSnapshot } from "react-beautiful-dnd";
import LabelFormItem from "../../components/label/LabelFormItem";
import StatusFormItem from "../../components/status/StatusFormItem";
import StyledContainer from "../../components/styled/Container";
import { noop } from "../../utils/utils";
import { demoLabels, demoStatuses } from "./data";
import WebItem from "./Item";

const LabelAndStatusWebItem: React.FC<{}> = () => {
  const label = (
    <Typography.Paragraph>
      Create and manage <Typography.Text strong>status</Typography.Text> and{" "}
      <Typography.Text strong>labels</Typography.Text>.
    </Typography.Paragraph>
  );

  const content = (
    <StyledContainer s={{ flexDirection: "column", width: "100%" }}>
      <StatusFormItem
        disabled
        canMoveDown
        canMoveUp
        value={demoStatuses[0]}
        onChange={noop}
        onChangePosition={noop}
        onCommitChanges={noop}
        onDelete={noop}
        onDiscardChanges={noop}
        onEdit={noop}
        provided={
          {
            draggableProps: {},
            innerRef: {},
            dragHandleProps: {},
          } as DraggableProvided
        }
        snapshot={{} as DraggableStateSnapshot}
        style={{ padding: 0 }}
      />
      <StyledContainer s={{ margin: "24px" }} />
      <LabelFormItem
        disabled
        value={demoLabels.label1}
        onChange={noop}
        onCommitChanges={noop}
        onDelete={noop}
        onDiscardChanges={noop}
        onEdit={noop}
        style={{ padding: 0 }}
      />
    </StyledContainer>
  );

  return <WebItem content={content} label={label} />;
};

export default LabelAndStatusWebItem;

import { EditOutlined } from "@ant-design/icons/lib/icons";
import { Button, Space } from "antd";
import React from "react";
import { Check, X } from "react-feather";
import StyledContainer from "../styled/Container";

export interface IEditableTextProps {
  editing: boolean;
  setEditing: (editing: boolean) => void;
  renderEditing: () => void;
  renderDefault: () => void;
  onDiscard: () => void;

  disabled?: boolean;
}

const EditableText: React.FC<IEditableTextProps> = (props) => {
  const {
    editing,
    setEditing,
    renderDefault,
    renderEditing,
    onDiscard,
    disabled,
  } = props;

  if (editing) {
    return (
      <StyledContainer>
        {renderEditing()}
        <Space>
          <Button
            icon={<Check style={{ width: "18px" }} />}
            onClick={() => setEditing(false)}
            htmlType="button"
            disabled={disabled}
          />
          <Button
            onClick={onDiscard}
            icon={<X style={{ width: "18px" }} />}
            disabled={disabled}
            htmlType="button"
          />
        </Space>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      {renderDefault()}
      <StyledContainer>
        <Button
          disabled={disabled}
          icon={<EditOutlined style={{ fontSize: "14px" }} />}
          onClick={() => setEditing(true)}
          htmlType="button"
        />
      </StyledContainer>
    </StyledContainer>
  );
};

export default React.memo(EditableText);

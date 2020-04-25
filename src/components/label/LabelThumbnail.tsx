import { DeleteOutlined } from "@ant-design/icons";
import { Button, Space } from "antd";
import React from "react";
import { IBlockLabel } from "../../models/block/block";
import ColorPicker from "../form/ColorPicker";
import EditableText from "../form/EditableText";
import StyledContainer from "../styled/Container";
import { labelValidationSchemas } from "./validation";

export interface ILabelThumbnailProps {
  label: IBlockLabel;
  onDelete: () => void;
  onChange: (label: Partial<IBlockLabel>) => void;
}

const LabelThumbnail: React.SFC<ILabelThumbnailProps> = (props) => {
  const { label, onChange } = props;

  return (
    <StyledContainer>
      <Space>
        <StyledContainer s={{ flexDirection: "column", flex: 1 }}>
          <EditableText
            text={label.name}
            type="input"
            onSubmit={(value) => onChange({ name: value })}
            yupSchema={labelValidationSchemas.name}
          />
          <StyledContainer s={{ marginTop: "8px" }}>
            <EditableText
              text={label.description}
              type="textarea"
              onSubmit={(value) => onChange({ description: value })}
              yupSchema={labelValidationSchemas.description}
            />
          </StyledContainer>
        </StyledContainer>
        <StyledContainer>
          <Space>
            <ColorPicker
              value={label.color}
              onChange={(value) => onChange({ color: value })}
            />
            <Button icon={<DeleteOutlined />} />
          </Space>
        </StyledContainer>
      </Space>
    </StyledContainer>
  );
};

export default React.memo(LabelThumbnail);

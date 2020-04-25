import { DeleteOutlined } from "@ant-design/icons";
import { Button, Space } from "antd";
import React from "react";
import { IBlockStatus } from "../../models/block/block";
import EditableText from "../form/EditableText";
import { labelValidationSchemas } from "../label/validation";
import StyledContainer from "../styled/Container";

export interface IStatusThumbnailProps {
  status: IBlockStatus;
  onDelete: () => void;
  onChange: (status: Partial<IBlockStatus>) => void;
}

const StatusThumbnail: React.SFC<IStatusThumbnailProps> = (props) => {
  const { status, onChange } = props;

  return (
    <StyledContainer>
      <Space>
        <StyledContainer s={{ flexDirection: "column", flex: 1 }}>
          <EditableText
            text={status.name}
            type="input"
            onSubmit={(value) => onChange({ name: value })}
            yupSchema={labelValidationSchemas.name}
          />
          <StyledContainer s={{ marginTop: "8px" }}>
            <EditableText
              text={status.description}
              type="textarea"
              onSubmit={(value) => onChange({ description: value })}
              yupSchema={labelValidationSchemas.description}
            />
          </StyledContainer>
        </StyledContainer>
        <StyledContainer>
          <Button icon={<DeleteOutlined />} />
        </StyledContainer>
      </Space>
    </StyledContainer>
  );
};

export default React.memo(StatusThumbnail);

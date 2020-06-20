import EditOutlined from "@ant-design/icons/EditOutlined";
import { Button, Space } from "antd";
import React from "react";
import { Check, CornerUpLeft, X } from "react-feather";
import StyledContainer from "../styled/Container";

export type EditableControl = "edit" | "revert" | "cancel" | "save";
const defaultWithControls: EditableControl[] = [
  "edit",
  "cancel",
  "revert",
  "save",
];

export interface IEditableProps {
  render: (
    isEditing: boolean,
    setEditing: (editing: boolean) => void,
    disabled?: boolean
  ) => React.ReactNode;

  editing?: boolean;
  withControls?: boolean | EditableControl[];
  disabled?: boolean;
  controlsEventHandler?: (controlKey: EditableControl) => boolean | undefined;
}

const featherIconStyle: React.CSSProperties = { width: "18px" };
const editIconStyle: React.CSSProperties = { fontSize: "14px" };
const containerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
};

const Editable: React.FC<IEditableProps> = (props) => {
  const {
    editing,
    withControls,
    disabled,
    render,
    controlsEventHandler,
  } = props;
  const [isEditing, setEditing] = React.useState(!!editing);

  const controlsEventHandlerWrapper = React.useCallback(
    (key: EditableControl) => {
      if (!controlsEventHandler) {
        return;
      }

      const preventDefault = controlsEventHandler(key);

      if (preventDefault) {
        return;
      }

      switch (key) {
        case "edit":
          setEditing(true);
          break;

        case "cancel":
        case "revert":
        case "save":
          setEditing(false);
          break;
      }
    },
    [controlsEventHandler]
  );

  const controls = React.useMemo(() => {
    if (!withControls) {
      return null;
    }

    const controlsToShow = Array.isArray(withControls)
      ? withControls
      : defaultWithControls;

    return (
      <Space style={{ marginTop: "8px" }}>
        {isEditing && controlsToShow.includes("cancel") && (
          <Button
            onClick={() => controlsEventHandlerWrapper("cancel")}
            icon={<X style={featherIconStyle} />}
            disabled={disabled}
            htmlType="button"
          />
        )}
        {isEditing && controlsToShow.includes("revert") && (
          <Button
            onClick={() => controlsEventHandlerWrapper("revert")}
            icon={<CornerUpLeft style={featherIconStyle} />}
            disabled={disabled}
            htmlType="button"
          />
        )}
        {isEditing && controlsToShow.includes("save") && (
          <Button
            icon={<Check style={featherIconStyle} />}
            onClick={() => controlsEventHandlerWrapper("save")}
            htmlType="button"
            disabled={disabled}
          />
        )}
        {!isEditing && controlsToShow.includes("edit") && (
          <Button
            disabled={disabled}
            icon={<EditOutlined style={editIconStyle} />}
            onClick={() => controlsEventHandlerWrapper("edit")}
            htmlType="button"
          />
        )}
      </Space>
    );
  }, [withControls, isEditing, controlsEventHandlerWrapper]);

  return (
    <StyledContainer
      s={containerStyle}
      onFocus={() => setEditing(true)}
      onBlur={() => setEditing(false)}
    >
      {render(isEditing, setEditing, disabled)}
      {controls}
    </StyledContainer>
  );
};

export default React.memo(Editable);

import { PlusOutlined } from "@ant-design/icons";
import { Button, Dropdown, Menu, Space, Tag, Typography } from "antd";
import React from "react";
import { Plus } from "react-feather";
import {
  IBlockAssignedLabelInput,
  IBlockLabel,
} from "../../models/block/block";
import { AntDMenuItemType } from "../utilities/types";
import TaskLabel from "./TaskLabel";
import TaskLabelList from "./TaskLabelList";

export interface ITaskLabelsProps {
  labelList: IBlockLabel[];
  labelsMap: { [key: string]: IBlockLabel };
  onChange: (ids: IBlockAssignedLabelInput[]) => void;
  onSelectAddNewLabel: () => void;
  disabled?: boolean;
  labels?: IBlockAssignedLabelInput[];
}

const ADD_NEW_LABEL_KEY = "add-new-label";
const DIVIDER_MENU_KEY = "divider-key";
const NO_LABELS_MENU_KEY = "no-labels-key";

const TaskLabelListForm: React.FC<ITaskLabelsProps> = (props) => {
  const { onChange, onSelectAddNewLabel, disabled, labelList, labelsMap } =
    props;

  const [visible, setVisible] = React.useState(false);
  const labels = React.useMemo(() => props.labels || [], [props.labels]);
  const onToggle = React.useCallback(
    (id: string) => {
      const i = labels.findIndex((label) => label.customId === id);

      if (i === -1) {
        onChange([...labels, { customId: id }]);
      } else {
        onChange(labels.filter((label, x) => x !== i));
      }
    },
    [labels, onChange]
  );

  const onRemove = React.useCallback(
    (id: string) => {
      const index = labels.findIndex((label) => label.customId === id);
      const newLabels = [...labels];
      newLabels.splice(index, 1);
      onChange(newLabels);
    },
    [labels, onChange]
  );

  const renderLabelTag = React.useCallback(
    (label: IBlockLabel, canRemove) => {
      return (
        <Tag
          closable={disabled ? false : canRemove}
          key={label.customId}
          onClose={() => {
            if (!disabled) {
              onRemove(label.customId);
            }
          }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            marginBottom: "2px",
            color: label.color,
            textTransform: "capitalize",
          }}
        >
          {label.name}
        </Tag>
      );
    },
    [disabled, onRemove]
  );

  const renderFormPart = React.useCallback(() => {
    const items: AntDMenuItemType[] = labelList.map((label) => {
      return {
        key: label.customId,
        label: (<TaskLabel label={label} />) as React.ReactNode,
      };
    });

    if (items.length === 0) {
      items.push({
        label: (
          <Typography.Text type="secondary">
            Click the plus button to create a label
          </Typography.Text>
        ),
        key: NO_LABELS_MENU_KEY,
      });
    }

    items.unshift(
      {
        icon: <PlusOutlined />,
        label: "Create Label",
        key: ADD_NEW_LABEL_KEY,
      },
      {
        type: "divider",
        key: DIVIDER_MENU_KEY,
      }
    );

    const labelListMenu = (
      <Menu
        multiple
        items={items}
        onClick={(evt) => {
          if (evt.key === ADD_NEW_LABEL_KEY) {
            onSelectAddNewLabel();
            setVisible(false);
            return;
          }

          onToggle(evt.key as string);
        }}
        selectedKeys={labels.map((label) => label.customId)}
      ></Menu>
    );

    return (
      <Dropdown
        overlay={labelListMenu}
        trigger={["click"]}
        visible={visible}
        onVisibleChange={setVisible}
      >
        <Button disabled={disabled} htmlType="button" className="icon-btn">
          <Plus />
        </Button>
      </Dropdown>
    );
  }, [
    disabled,
    labelList,
    labels,
    visible,
    onSelectAddNewLabel,
    onToggle,
    renderLabelTag,
  ]);

  return (
    <Space direction="vertical" size={"small"} style={{ width: "100%" }}>
      <TaskLabelList
        canRemove
        labels={labels}
        labelsMap={labelsMap}
        disabled={disabled}
        onRemove={onRemove}
      />
      {!disabled && renderFormPart()}
    </Space>
  );
};

export default React.memo(TaskLabelListForm);

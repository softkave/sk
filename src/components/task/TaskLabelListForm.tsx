import { PlusOutlined } from "@ant-design/icons";
import { css } from "@emotion/css";
import { Button, Dropdown, Menu, Space, Typography } from "antd";
import React from "react";
import { Plus } from "react-feather";
import { IBoardLabel } from "../../models/board/types";
import { ITaskAssignedLabel } from "../../models/task/types";
import { getDateString } from "../../utils/utils";
import { AntDMenuItemType } from "../utils/types";
import TaskLabel from "./TaskLabel";
import TaskLabelList from "./TaskLabelList";

export interface ITaskLabelsProps {
  userId: string;
  labelList: IBoardLabel[];
  labelsMap: { [key: string]: IBoardLabel };
  onChange: (ids: ITaskAssignedLabel[]) => void;
  onSelectAddNewLabel: () => void;
  disabled?: boolean;
  labels?: ITaskAssignedLabel[];
}

const ADD_NEW_LABEL_KEY = "add-new-label";
const DIVIDER_MENU_KEY = "divider-key";
const NO_LABELS_MENU_KEY = "no-labels-key";

const TaskLabelListForm: React.FC<ITaskLabelsProps> = (props) => {
  const { onChange, onSelectAddNewLabel, disabled, labelList, labelsMap, userId } = props;

  const [visible, setVisible] = React.useState(false);
  const labels = React.useMemo(() => props.labels || [], [props.labels]);
  const onToggle = React.useCallback(
    (id: string) => {
      const i = labels.findIndex((label) => label.labelId === id);

      if (i === -1) {
        onChange([...labels, { labelId: id, assignedAt: getDateString(), assignedBy: userId }]);
      } else {
        onChange(labels.filter((label, x) => x !== i));
      }
    },
    [labels, userId, onChange]
  );

  const onRemove = React.useCallback(
    (id: string) => {
      const index = labels.findIndex((label) => label.labelId === id);
      const newLabels = [...labels];
      newLabels.splice(index, 1);
      onChange(newLabels);
    },
    [labels, onChange]
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
        selectedKeys={labels.map((label) => label.labelId)}
      ></Menu>
    );

    return (
      <Dropdown
        overlay={labelListMenu}
        trigger={["click"]}
        visible={visible}
        onVisibleChange={setVisible}
        className={css({ width: "100%" })}
      >
        <Button disabled={disabled} htmlType="button" className="icon-btn">
          <Plus />
        </Button>
      </Dropdown>
    );
  }, [disabled, labelList, labels, visible, onSelectAddNewLabel, onToggle]);

  return (
    <Space direction="vertical" size={"small"} style={{ width: "100%" }}>
      {!!labels?.length && (
        <TaskLabelList
          canRemove
          labels={labels}
          labelsMap={labelsMap}
          disabled={disabled}
          onRemove={onRemove}
        />
      )}
      {!disabled && renderFormPart()}
    </Space>
  );
};

export default React.memo(TaskLabelListForm);

import { Button, Input, Space } from "antd";
import React from "react";
import { X as CloseIcon } from "react-feather";

import InputSearchIcon from "../utilities/InputSearchIcon";

export enum SearchTasksMode {
  CURRENT_SPRINT = "current-sprint",
  ALL_TASKS = "all-tasks",
}

export interface ISearchTasksInputProps {
  onChangeSearchText: (text: string) => void;
  onCancel: () => void;
}

const SEARCH_TASKS_IN_ALL_TASKS = "Search all tasks...";

// TODO: Implement selector for current sprint & all tasks
// TODO: Implement full blown filters

const SearchTasksInput: React.FC<ISearchTasksInputProps> = (props) => {
  const { onCancel, onChangeSearchText } = props;

  return (
    <div style={{ justifyContent: "flex-end", flex: 1 }}>
      <Space>
        <Input
          allowClear
          placeholder={SEARCH_TASKS_IN_ALL_TASKS}
          prefix={<InputSearchIcon />}
          onChange={(evt) => onChangeSearchText(evt.target.value)}
        />
        <Button onClick={onCancel} className="icon-btn">
          <CloseIcon />
        </Button>
      </Space>
    </div>
  );
};

export default SearchTasksInput;

import { Switch } from "antd";
import React from "react";
import { IBlock } from "../../models/block/block";

export interface IToggleSwitchProps {
  checked: boolean;
  onToggle: () => void;
  disabled?: boolean;
  task: IBlock;
}

const ToggleSwitch: React.SFC<IToggleSwitchProps> = props => {
  const { checked, onToggle, disabled } = props;

  return <Switch checked={checked} onChange={onToggle} disabled={disabled} />;
};

export default ToggleSwitch;

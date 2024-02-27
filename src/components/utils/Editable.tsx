import React from "react";

export type EditableRenderFn = (
  isEditing: boolean,
  setEditing: (editing: boolean) => void,
  disabled?: boolean
) => React.ReactElement;
export interface IEditableProps {
  render: EditableRenderFn;

  editing?: boolean;
  disabled?: boolean;
}

const Editable: React.FC<IEditableProps> = (props) => {
  const { editing, disabled, render } = props;
  const [isEditing, setEditing] = React.useState(!!editing);

  return render(isEditing, setEditing, disabled);
};

export default React.memo(Editable);

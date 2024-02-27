import { FormikErrors, FormikTouched } from "formik";
import React from "react";
import { IOption } from "../../models/fields/fields";

export interface IOptionsListInputProps {
  value: IOption[];
  onChange: (data: IOption[]) => void;
  disabled?: boolean;
  touched?: FormikTouched<IOption[]>;
  errors?: FormikErrors<IOption[]>;
}

const OptionsListInput: React.FC<IOptionsListInputProps> = (props) => {
  const { value, disabled, touched, errors, onChange } = props;
  const [hasNew, setHasNew] = React.useState(false);

  return <div>{/* <ListHeader /> */}</div>;
};

export default OptionsListInput;

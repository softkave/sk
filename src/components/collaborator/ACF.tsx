import { Button, Divider } from "antd";
import React from "react";
import ACFItem, { IACFItemError, IACFItemValue } from "./ACFItem";

export interface IACFProps {
  onChange: (value: IACFItemValue[]) => void;
  value: IACFItemValue[];
  maxRequests: number;
  errors?: IACFItemError[];
}

// TODO: Add requests count and max to let the user know

export default class ACF extends React.PureComponent<IACFProps> {
  public onUpdate = (index, data) => {
    const { onChange, value } = this.props;
    const request = value[index];
    const updatedRequest = { ...request, ...data };
    const updatedValue = [...value];
    updatedValue[index] = updatedRequest;
    onChange(updatedValue);
  };

  public onDelete = index => {
    const { onChange, value } = this.props;
    const updated = [...value];
    updated.splice(index, 1);
    onChange(updated);
  };

  public onAdd = () => {
    const { onChange, value, maxRequests } = this.props;

    if (value.length < maxRequests) {
      const updated = [...value, { email: "" }];
      onChange(updated);
    }
  };

  public render() {
    const { value, errors, maxRequests } = this.props;
    const requestErrors = errors || [];

    return (
      <React.Fragment>
        {value.map((request, index) => {
          return (
            <React.Fragment key={index}>
              <ACFItem
                value={request}
                error={requestErrors[index]}
                onChange={data => this.onUpdate(index, data)}
                onDelete={() => this.onDelete(index)}
              />
              {index < value.length - 1 && <Divider />}
            </React.Fragment>
          );
        })}
        <Button
          block
          icon="plus"
          onClick={this.onAdd}
          disabled={value.length >= maxRequests}
        >
          Add Collaborator
        </Button>
      </React.Fragment>
    );
  }
}

import { Button, Divider } from "antd";
import React from "react";

import { newId } from "../../utils/utils";
import ACFItem, { IACFItemError, IACFItemValue } from "./ACFItem";

export interface IACFProps {
  onChange: (value: IACFItemValue[]) => void;
  value: IACFItemValue[];
  maxRequests: number;
  errors?: IACFItemError[];
}

// TODO: Add requests count and max to let the user know

export default class ACF extends React.PureComponent<IACFProps> {
  public static defaultProps = {
    errors: []
  };

  public onUpdate = (index, data) => {
    const { onChange, value } = this.props;
    const request = value[index];
    const updatedRequest = { ...request, ...data };
    const valueClone = [...value];
    valueClone[index] = updatedRequest;
    onChange(valueClone);
  };

  public onDelete = index => {
    const { onChange, value } = this.props;
    const valueClone = [...value];
    valueClone.splice(index, 1);
    onChange(valueClone);
  };

  public onAdd = () => {
    const { onChange, value, maxRequests } = this.props;

    if (value.length < maxRequests) {
      // const updated = [...value, { email: "", id: newId() }];
      const updated = [...value, { email: "" }];
      onChange(updated);
    }
  };

  public render() {
    const { value, errors, maxRequests } = this.props;
    const requestErrors = errors!;

    return (
      <React.Fragment>
        {value.map((request, index) => {
          return (
            <React.Fragment
              // key={(request as any).id}
              key={index}
            >
              <ACFItem
                value={request}
                error={requestErrors[index]}
                onChange={data => {
                  /**
                   * TODO: - BUG
                   * I think React, or something else in between has one, create a plan to report it.
                   * Here's the bug, this ACFItem component is created in the map, and mapped to the index,
                   * but the onUpdate is getting a wrong index if email is updated using autofill.
                   * It works fine if the email is entered manually though. And it's only email.
                   * I think it's maybe because we're using the index as key, and maybe use a better id system.
                   *
                   * Nope, it's not because of the using idex as key, using a unique id, didn't work too.
                   */
                  this.onUpdate(index, data);
                }}
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

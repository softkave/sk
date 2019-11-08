import styled from "@emotion/styled";
import { Button } from "antd";
import React from "react";
import AddCollaboratorFormItem, {
  IAddCollaboratorFormItemError,
  IAddCollaboratorFormItemValues
} from "./AddCollaboratorFormItem";

export interface IAddCollaboratorFormItemListProps {
  onChange: (value: IAddCollaboratorFormItemValues[]) => void;
  value: IAddCollaboratorFormItemValues[];
  maxRequests: number;
  errors?: Array<IAddCollaboratorFormItemError | undefined>;
}

// TODO: Add requests count and max to let the user know

export default class AddCollaboratorFormItemList extends React.PureComponent<
  IAddCollaboratorFormItemListProps
> {
  public static defaultProps = {
    errors: [],
    value: []
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
      const updated = [...value, { email: "" }];
      onChange(updated);
    }
  };

  public render() {
    const { value, maxRequests } = this.props;

    return (
      <React.Fragment>
        {this.renderList()}
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

  private renderList() {
    const { value, errors } = this.props;
    const requestErrors = errors!;

    return (
      <StyledList>
        {value.map((request, index) => {
          return (
            <StyledItem key={index}>
              <AddCollaboratorFormItem
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
                   *
                   * TODO: Maybe, turn off auto-fill for email
                   */
                  this.onUpdate(index, data);
                }}
                onDelete={() => this.onDelete(index)}
              />
            </StyledItem>
          );
        })}
      </StyledList>
    );
  }
}

const StyledList = styled.div({
  backgroundColor: "#f0f0f0",
  margin: "16px 0"
});

const StyledItem = styled.div(props => {
  return {
    borderBottom: "1px solid #bbb",
    padding: "16px",

    "&:last-of-type": {
      borderBottom: "none"
    }
  };
});

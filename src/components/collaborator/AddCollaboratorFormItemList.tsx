import { PlusOutlined } from "@ant-design/icons";
import styled from "@emotion/styled";
import { Button } from "antd";
import React from "react";
import AddCollaboratorFormItem from "./AddCollaboratorFormItem";

export interface IAddCollaboratorFormItemListProps {
  onChange: (value: any[]) => void;
  value: any[];
  maxRequests: number;

  disabled?: boolean;
  errors?: Array<any | undefined>;
}

// TODO: Add requests count and max to let the user know

export default class AddCollaboratorFormItemList extends React.PureComponent<
  IAddCollaboratorFormItemListProps
> {
  public static defaultProps = {
    errors: [],
    value: [],
  };

  public onUpdate = (index, data) => {
    const { onChange, value } = this.props;
    const request = value[index];
    const updatedRequest = { ...request, ...data };
    const valueClone = [...value];
    valueClone[index] = updatedRequest;
    onChange(valueClone);
  };

  public onDelete = (index) => {
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
    const { value, maxRequests, disabled } = this.props;

    return (
      <React.Fragment>
        {this.renderList()}
        <Button
          block
          onClick={this.onAdd}
          disabled={disabled || value.length >= maxRequests}
        >
          <PlusOutlined />
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
                errors={requestErrors[index]}
                onChange={(data) => {
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
  margin: "16px 0",
});

const StyledItem = styled.div({
  borderBottom: "1px solid #bbb",
  padding: "16px",

  "&:last-of-type": {
    borderBottom: "none",
  },
});

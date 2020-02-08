import styled from "@emotion/styled";
import { List as AntDList } from "antd";
import React from "react";
import EmptyMessage from "../EmptyMessage";

export interface IListProps<T> {
  dataSource: T[];
  rowKey: ((item: T) => string) | string;
  renderItem: (item: T, index: number) => React.ReactNode;
  emptyDescription?: string | React.ReactNode;
}

const defaultEmptyDescription = "No data";

class List<T> extends React.Component<IListProps<T>> {
  public static defaultProps: Partial<IListProps<any>> = {
    emptyDescription: defaultEmptyDescription
  };

  public render() {
    const { dataSource, emptyDescription, rowKey } = this.props;

    if (dataSource.length === 0) {
      return <EmptyMessage>{emptyDescription}</EmptyMessage>;
    }

    return (
      <AntDList
        dataSource={dataSource}
        rowKey={rowKey}
        renderItem={this.renderItem}
        style={{ width: "100%" }}
      />
    );
  }

  private renderItem = (item: T, index: number) => {
    const { renderItem } = this.props;

    return (
      <StyledListItemContainer>
        {renderItem(item, index)}
      </StyledListItemContainer>
    );
  };
}

export default List;

const lastOfTypeSelector = "&:last-of-type";
const StyledListItemContainer = styled.div({
  [lastOfTypeSelector]: {
    borderBottom: 0
  }
});

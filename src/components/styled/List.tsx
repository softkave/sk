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
    emptyDescription: defaultEmptyDescription,
  };

  public render() {
    const { dataSource, emptyDescription, rowKey, renderItem } = this.props;

    if (dataSource.length === 0) {
      return <EmptyMessage>{emptyDescription}</EmptyMessage>;
    }

    return dataSource.map(renderItem);

    return (
      <AntDList
        dataSource={dataSource}
        rowKey={rowKey}
        renderItem={renderItem}
        style={{ width: "100%" }}
      />
    );
  }
}

export default List;

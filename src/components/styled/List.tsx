import React from "react";
import Message from "../Message";

export interface IListProps<T> {
  dataSource: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  emptyDescription?: string;
}

const defaultEmptyDescription = "Empty.";

class List<T> extends React.Component<IListProps<T>> {
  public static defaultProps: Partial<IListProps<any>> = {
    emptyDescription: defaultEmptyDescription,
  };

  public render() {
    const { dataSource, emptyDescription, renderItem } = this.props;

    if (dataSource.length === 0) {
      return <Message message={emptyDescription as string}></Message>;
    }

    return dataSource.map(renderItem);
  }
}

export default List;

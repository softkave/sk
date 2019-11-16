import styled from "@emotion/styled";
import { Empty, List as AntDList } from "antd";
import React from "react";
import StyledCenterContainer from "../styled/CenterContainer";

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
      return (
        <StyledEmptyContainer>
          <Empty description={emptyDescription} />
        </StyledEmptyContainer>
      );
    }

    return (
      <AntDList
        dataSource={dataSource}
        rowKey={rowKey}
        renderItem={this.renderItem}
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

const StyledListContainer = styled.div({
  display: "flex",
  width: "100%",
  height: "100%",
  flexDirection: "column"
});

const StyledListItemContainer = styled.div({
  borderBottom: "1px solid #DDD",
  cursor: "pointer",

  "&:last-of-type": {
    borderBottom: 0
  },

  "&:hover": {
    backgroundColor: "#E6F7FF"
  }
});

const StyledEmptyContainer = styled(StyledCenterContainer)({
  marginTop: 64
});

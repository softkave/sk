import React, { Component } from "react";
import styled from "styled-components";
import { colors } from "./constants";
import Column from "./Col";
import { reorderBoard, reorder } from "./reorder";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

const ParentContainer = styled.div`
  height: ${({ height }) => height};
  overflow-x: hidden;
  overflow-y: auto;
`;

const Container = styled.div`
  background-color: ${colors.B100};
  min-width: 100vw;
  display: inline-flex;
  flex: 1;
`;

export default class Board extends Component {
  static defaultProps = {
    isCombineEnabled: false
  };

  constructor(props) {
    super(props);
    this.state = {
      columns: this.props.initial || {},
      ordered: Object.keys(this.props.initial || {})
    };
  }

  componentDidUpdate() {
    const { initial } = this.props;

    if (initial !== this.state.columns) {
      this.setState({
        columns: this.props.initial || {},
        ordered: Object.keys(this.props.initial || {})
      });
    }
  }

  onDragEnd = result => {
    // if (result.combine) {
    //   if (result.type === 'COLUMN') {
    //     const shallow = [...this.state.ordered];
    //     shallow.splice(result.source.index, 1);
    //     this.setState({ ordered: shallow });
    //     return;
    //   }

    //   const column = this.state.columns[result.source.droppableId];
    //   const withQuoteRemoved = [...column];
    //   withQuoteRemoved.splice(result.source.index, 1);
    //   const columns = {
    //     ...this.state.columns,
    //     [result.source.droppableId]: withQuoteRemoved,
    //   };
    //   this.setState({ columns });
    //   return;
    // }

    // dropped nowhere
    if (!result.destination) {
      return;
    }

    const source = result.source;
    const destination = result.destination;

    // did not move anywhere - can bail early
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    /**
     * TODO: maybe prompt if the user wants the change to be permanent ot temporary
     */
    // reordering column
    if (result.type === "COLUMN") {
      const ordered = reorder(
        this.state.ordered,
        source.index,
        destination.index
      );

      this.setState({
        ordered
      });

      return;
    }

    const data = reorderBoard({
      board: this.state.columns,
      source,
      destination
    });

    this.setState({
      columns: data.board
    });
  };

  render() {
    const columns = this.state.columns;
    const ordered = this.state.ordered;
    const { containerHeight, onClickAddChild, onEdit } = this.props;

    const board = (
      <Droppable
        droppableId="board"
        type="COLUMN"
        direction="horizontal"
        ignoreContainerClipping={Boolean(containerHeight)}
        isCombineEnabled={this.props.isCombineEnabled}
      >
        {provided => (
          <Container ref={provided.innerRef} {...provided.droppableProps}>
            {ordered.map((key, index) => (
              <Column
                key={key}
                index={index}
                block={columns[key]}
                isScrollable={this.props.withScrollableColumns}
                isCombineEnabled={this.props.isCombineEnabled}
                onClickAddChild={onClickAddChild}
                onEdit={onEdit}
                childrenTypes={["task", "project"]}
              />
            ))}
            {provided.placeholder}
          </Container>
        )}
      </Droppable>
    );

    return (
      <React.Fragment>
        <DragDropContext onDragEnd={this.onDragEnd}>
          {containerHeight ? (
            <ParentContainer height={containerHeight}>{board}</ParentContainer>
          ) : (
            board
          )}
        </DragDropContext>
      </React.Fragment>
    );
  }
}

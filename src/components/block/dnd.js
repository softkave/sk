import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";

const defaultGetContainer = () => ({ container: "div" });

export function DraggableItem(props) {
  const { children, draggableProps, getContainer } = props;

  return (
    <Draggable {...draggableProps}>
      {(provided, snapshot) => {
        const { container, containerProps } = getContainer(provided, snapshot);

        return React.createElement(
          container,
          {
            ref: provided.innerRef,
            ...provided.draggableProps,
            ...provided.dragHandleProps,
            ...containerProps
          },
          children
        );
      }}
    </Draggable>
  );
}

DraggableItem.defaultProps = {
  getContainer: defaultGetContainer
};

export function DroppableItem(props) {
  const { children, droppableProps, getContainer } = props;

  return (
    <Droppable {...droppableProps}>
      {(provided, snapshot) => {
        const { container, containerProps } = getContainer(provided, snapshot);

        return React.createElement(
          container,
          {
            ref: provided.innerRef,
            ...provided.droppableProps,
            ...containerProps
          },
          <React.Fragment>
            {children}
            {provided.placeholder}
          </React.Fragment>
        );
      }}
    </Droppable>
  );
}

DroppableItem.defaultProps = {
  getContainer: defaultGetContainer
};

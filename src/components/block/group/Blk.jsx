import React from "react";
import styled from "styled-components";
import { borderRadius, grid, colors, blockColors } from "./constants";

const getBlockColor = block => {
  return block.color || blockColors[block.type];
};

const getBackgroundColor = (isDragging, isGroupedOver, block) => {
  if (isDragging) {
    return getBlockColor(block);
  }

  if (isGroupedOver) {
    return colors.N30;
  }

  return colors.N0;
};

const getBorderColor = (isDragging, block) =>
  isDragging ? getBlockColor(block) : "transparent";

const Container = styled.a`
  border-radius: ${borderRadius}px;
  border: 2px solid transparent;
  border-color: ${props => getBorderColor(props.isDragging, props.block)};
  background-color: ${props =>
    getBackgroundColor(props.isDragging, props.isGroupedOver, props.block)};
  box-shadow: ${({ isDragging }) =>
    isDragging ? `2px 2px 1px ${colors.N70}` : "none"};
  padding: ${grid}px;
  min-height: 40px;
  margin-bottom: ${grid}px;
  user-select: none;

  /* anchor overrides */
  color: ${colors.N900};

  &:hover,
  &:active {
    color: ${colors.N900};
    text-decoration: none;
  }

  &:focus {
    outline: none;
    border-color: ${props => getBlockColor(props.block)};
    box-shadow: none;
  }

  /* flexbox */
  display: flex;
`;

const Content = styled.div`
  /* flex child */
  flex-grow: 1;
  /*
    Needed to wrap text in ie11
    https://stackoverflow.com/questions/35111090/why-ie11-doesnt-wrap-the-text-in-flexbox
  */
  flex-basis: 100%;
  /* flex parent */
  display: flex;
  flex-direction: column;
`;

// Previously this extended React.Component
// That was a good thing, because using React.PureComponent can hide
// issues with the selectors. However, moving it over does can considerable
// performance improvements when reordering big lists (400ms => 200ms)
// Need to be super sure we are not relying on PureComponent here for
// things we should be doing in the selector as we do not know if consumers
// will be using PureComponent
function BlockItem(props) {
  const { block, isDragging, isGroupedOver, provided } = props;

  return (
    <Container
      // href={block.author.url}
      isDragging={isDragging}
      isGroupedOver={isGroupedOver}
      block={block}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      <Content>{block.name || block.description}</Content>
    </Container>
  );
}

export default React.memo(BlockItem);

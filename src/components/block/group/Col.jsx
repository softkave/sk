import React from "react";
import styled from "styled-components";
import values from "lodash/values";
import { Button } from "antd";
import { grid, borderRadius, colors } from "./constants";
import { Draggable } from "react-beautiful-dnd";
import BlockList from "./BlkList";
import Title from "./Title";
import AddDropdownButton from "../../AddDropdownButton.jsx";
import DeleteButton from "../../DeleteButton";

const Container = styled.div`
  margin: ${grid}px;
  display: flex;
  flex-direction: column;
  min-width: 282px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-left-radius: ${borderRadius}px;
  border-top-right-radius: ${borderRadius}px;
  background-color: ${({ isDragging }) =>
    isDragging ? colors.G50 : colors.N30};
  transition: background-color 0.2s ease;
  &:hover {
    background-color: ${colors.G50};
  }
`;

const GroupHeaderButtons = styled.div`
  text-align: right;
  flex: 1;
`;

export default class Column extends React.PureComponent {
  shouldComponentUpdate() {}

  render() {
    const block = this.props.block;
    const index = this.props.index;
    const { onClickAddChild, onEdit, childrenTypes } = this.props;

    return (
      <Draggable draggableId={block.customId} index={index}>
        {(provided, snapshot) => (
          <Container ref={provided.innerRef} {...provided.draggableProps}>
            <Header isDragging={snapshot.isDragging}>
              <Title
                isDragging={snapshot.isDragging}
                {...provided.dragHandleProps}
              >
                {block.name}
              </Title>
              {!snapshot.isDragging && (
                <GroupHeaderButtons>
                  {childrenTypes && childrenTypes.length > 0 && (
                    <AddDropdownButton
                      types={childrenTypes}
                      onClick={type => onClickAddChild(type, block)}
                    />
                  )}
                  <Button icon="edit" onClick={() => onEdit(block)} />
                  <DeleteButton
                    deleteButton={<Button icon="delete" type="danger" />}
                    // onDelete={() => blockHandlers.onDelete(block)}
                    onDelete={() => null}
                    title="Are you sure you want to delete this group?"
                  />
                </GroupHeaderButtons>
              )}
            </Header>
            <BlockList
              listId={block.customId}
              listType="BLOCK"
              style={{
                backgroundColor: snapshot.isDragging ? colors.G50 : null
              }}
              blocks={values({ ...block.task, ...block.group })}
              internalScroll={this.props.isScrollable}
              isCombineEnabled={Boolean(this.props.isCombineEnabled)}
              isDragging={snapshot.isDragging}
            />
          </Container>
        )}
      </Draggable>
    );
  }
}

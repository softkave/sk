import React from "react";
import { Row, Col, Button } from "antd";
import SimpleBar from "simplebar-react";
// import styled from "styled-components";
import { Draggable, Droppable } from "react-beautiful-dnd";
import AddDropdownButton from "../../AddDropdownButton.jsx";
import { getBlockValidChildrenTypes } from "../../../models/block/utils";
import DeleteButton from "../../DeleteButton";
import styled from "@emotion/styled";

import "simplebar/dist/simplebar.min.css";

function getChildrenTypes(block, type) {
  const remove = type === "task" ? "project" : "task";
  const childrenTypes = getBlockValidChildrenTypes(block);
  const typeIndex = childrenTypes.indexOf(remove);

  if (typeIndex !== -1) {
    childrenTypes.splice(typeIndex, 1);
  }

  return childrenTypes;
}

const GroupHeader = React.memo(function GroupHeader(props) {
  const {
    group,
    blockHandlers,
    onClickAddChild,
    onEdit,
    disabled,
    type
  } = props;
  const childrenTypes = disabled ? [] : getChildrenTypes(group, type);

  return (
    <Header>
      <GroupName span={disabled ? 24 : 12}>{group.name}</GroupName>
      {!disabled && (
        <GroupHeaderButtons span={12}>
          {childrenTypes && childrenTypes.length > 0 && (
            <AddDropdownButton
              types={childrenTypes}
              onClick={type => onClickAddChild(type, group)}
            />
          )}
          <GroupHeaderButton icon="edit" onClick={() => onEdit(group)} />
          <DeleteButton
            deleteButton={<GroupHeaderButton icon="delete" type="danger" />}
            onDelete={() => blockHandlers.onDelete(group)}
            title="Are you sure you want to delete this group?"
          />
        </GroupHeaderButtons>
      )}
    </Header>
  );
});

const GroupBody = React.memo(function GroupBody(props) {
  const { render, droppableId } = props;

  // return render();

  return (
    <Droppable droppableId={droppableId} type="TASKS">
      {(provided, snapshot) => (
        <GroupDroppable ref={provided.innerRef} {...provided.droppableProps}>
          <GroupScrollContainer>{render()}</GroupScrollContainer>
          {provided.placeholder}
        </GroupDroppable>
      )}
    </Droppable>
  );
});

class Group extends React.PureComponent {
  render() {
    const {
      group,
      blockHandlers,
      onClickAddChild,
      onEdit,
      draggableId,
      index,
      droppableId,
      children,
      disabled,
      tasks,
      projects,
      render,
      type
    } = this.props;

    return (
      <Draggable
        // key={draggableId}
        index={index}
        draggableId={draggableId}
        // isDragDisabled={disabled}
      >
        {(provided, snapshot) => {
          console.log(snapshot.isDragging);

          return (
            <GroupContainer
              ref={provided.innerRef}
              {...provided.draggableProps}
            >
              <GroupContainerInner>
                <div {...provided.dragHandleProps}>
                  <GroupHeader
                    disabled={disabled}
                    group={group}
                    blockHandlers={blockHandlers}
                    onClickAddChild={onClickAddChild}
                    onEdit={onEdit}
                    type={type}
                  />
                </div>
                <GroupBody droppableId={droppableId} render={render} />
              </GroupContainerInner>
            </GroupContainer>
          );
        }}
      </Draggable>
    );
  }
}

const GroupContainer = styled.div`
  display: flex;
  height: 100%;
  margin-right: 16px;
  width: 300px;

  &:last-of-type {
    margin-right: 0;
  }
`;

const GroupContainerInner = styled.div`
  width: 300px;
  white-space: normal;
  vertical-align: top;
  background-color: #fff;
  box-sizing: border-box;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Header = styled(Row)`
  padding: 12px;
  border-bottom: 1px solid #ddd;
`;

const GroupName = styled(Col)`
  font-weight: bold;
`;

const GroupHeaderButtons = styled(Col)`
  text-align: right;
`;

const GroupHeaderButton = styled(Button)`
  margin-left: 2px;
`;

const GroupScrollContainer = styled(SimpleBar)`
  overflow-x: hidden;
  height: 100%;
`;

// const GroupScrollContainer = styled.div`
//   overflow-x: hidden;
//   height: 100%;
// `;

const GroupDroppable = styled.div`
  width: 100%;
  flex: 2 1;
  overflow-x: hidden;
  overflow-y: hidden;
`;

export default Group;

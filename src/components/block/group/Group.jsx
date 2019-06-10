import React from "react";
import { Row, Col, Button } from "antd";
import SimpleBar from "simplebar-react";
import styled from "styled-components";
import { Draggable, Droppable } from "react-beautiful-dnd";
import AddDropdownButton from "../../AddDropdownButton.jsx";
import { getBlockValidChildrenTypes } from "../../../models/block/utils";
import DeleteButton from "../../DeleteButton";

import "simplebar/dist/simplebar.min.css";

const GroupHeader = React.memo(function GroupHeader(props) {
  const {
    group,
    blockHandlers,
    onClickAddChild,
    childrenTypes,
    onEdit
  } = props;

  return (
    <Header>
      <GroupName span={12}>{group.name}</GroupName>
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
    </Header>
  );
});

const GroupBody = React.memo(function GroupBody(props) {
  const { children, droppableId } = props;

  return (
    <Droppable droppableId={droppableId} type="TASKS_AND_PROJECTS">
      {(provided, snapshot) => (
        <GroupDroppable ref={provided.innerRef} {...provided.droppableProps}>
          <GroupScrollContainer>
            {children}
            {provided.placeholder}
          </GroupScrollContainer>
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
      children
    } = this.props;

    const childrenTypes = getBlockValidChildrenTypes(group);

    return (
      <Draggable key={draggableId} index={index} draggableId={draggableId}>
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
                    group={group}
                    blockHandlers={blockHandlers}
                    onClickAddChild={onClickAddChild}
                    childrenTypes={childrenTypes}
                    onEdit={onEdit}
                  />
                </div>
                <GroupBody droppableId={droppableId}>{children}</GroupBody>
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

const GroupDroppable = styled.div`
  width: 100%;
  flex: 2 1;
  overflow-x: hidden;
  overflow-y: hidden;
`;

export default Group;

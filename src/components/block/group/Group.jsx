import React from "react";
import { Row, Col, Button } from "antd";
import SimpleBar from "simplebar-react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import AddDropdownButton from "../../AddDropdownButton.jsx";
import { getBlockValidChildrenTypes } from "../../../models/block/utils";
import DeleteButton from "../../DeleteButton";
import styled from "@emotion/styled";

// import "simplebar/dist/simplebar.min.css";

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
  const { render, droppableId, type } = props;

  // return (
  //   <GroupScrollContainer>
  //     <Droppable droppableId={droppableId} type={type.toUpperCase()}>
  //       {(provided, snapshot) => (
  //         <GroupDroppable ref={provided.innerRef} {...provided.droppableProps}>
  //           {render()}
  //           {provided.placeholder}
  //         </GroupDroppable>
  //       )}
  //     </Droppable>
  //   </GroupScrollContainer>
  // );

  return (
    <GroupScrollContainer>
      <GroupScrollContainerInner>{render()}</GroupScrollContainerInner>
    </GroupScrollContainer>
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
      disabled,
      render,
      type
    } = this.props;

    const rendered = (
      <Draggable
        index={index}
        draggableId={draggableId}
        isDragDisabled={disabled}
      >
        {(provided, snapshot) => {
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
                <GroupBody
                  droppableId={droppableId}
                  render={render}
                  type={type}
                />
              </GroupContainerInner>
            </GroupContainer>
          );
        }}
      </Draggable>
    );

    return rendered;
  }
}

const GroupContainer = styled.div`
  display: flex;
  height: 100%;
  margin-right: 16px;
  width: 300px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
  border-radius: 4px;

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
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 4px;
`;

const Header = styled(Row)`
  padding: 12px;
  border-bottom: 1px solid #ddd;
`;

const GroupName = styled(Col)`
  font-weight: bold;
  min-height: 32px;
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

const GroupScrollContainerInner = styled.div`
  margin: 12px;
`;

// const GroupScrollContainer = styled(SimpleBar)`
//   overflow-x: hidden;
//   height: 100%;
//   width: 100%;
//   flex: 2 1;
// `;

// const GroupScrollContainer = styled.div`
//   overflow-x: hidden;
//   height: 100%;
// `;

const GroupDroppable = styled.div`
  // width: 100%;
  // flex: 2 1;
  // overflow-x: hidden;
  // overflow-y: hidden;
  // height: 100%;
`;

export default Group;

import styled from "@emotion/styled";
import { Button, Col, Row } from "antd";
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import SimpleBar from "simplebar-react";

import { getBlockValidChildrenTypes } from "../../../models/block/utils";
import AddDropdownButton from "../../AddDropdownButton.jsx";
import DeleteButton from "../../DeleteButton";

import "simplebar/dist/simplebar.css";
import { IBlock } from "../../../models/block/block.js";
import { IBlockMethods } from "../methods.js";

function getChildrenTypes(block: IBlock, type: string) {
  const remove = type === "task" ? "project" : "task";
  const childrenTypes = getBlockValidChildrenTypes(block);
  const typeIndex = childrenTypes.indexOf(remove);

  if (typeIndex !== -1) {
    childrenTypes.splice(typeIndex, 1);
  }

  return childrenTypes;
}

export interface IGroupProps {
  group: IBlock;
  blockHandlers: IBlockMethods;
  draggableId: string;
  index: number;
  droppableId: string;
  disabled?: boolean;
  type: string;
  onClickAddChild: (type: string, group: IBlock) => void;
  onEdit: (group: IBlock) => void;
  render: () => React.ReactNode;

  /**
   * TODO: 
   * Move the children rendering logic from kanban board to it's own component
   * OR into Group or a child of group
   */
  onViewMore?: () => void;
  showViewMore?: boolean;
}

const GroupHeader = React.memo<IGroupProps>(props => {
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
              onClick={blockType => onClickAddChild(blockType, group)}
            />
          )}
          <GroupHeaderButtonContainer>
            <Button icon="edit" onClick={() => onEdit(group)} />
          </GroupHeaderButtonContainer>
          <DeleteButton
            deleteButton={
              <GroupHeaderButtonContainer>
                <Button icon="delete" type="danger" />
              </GroupHeaderButtonContainer>
            }
            onDelete={() => blockHandlers.onDelete({ block: group })}
            title="Are you sure you want to delete this group?"
          />
        </GroupHeaderButtons>
      )}
    </Header>
  );
});

const GroupBody = React.memo<IGroupProps>(props => {
  const { render } = props;

  return (
    <GroupScrollContainer>
      <GroupScrollContainerInner>{render()}</GroupScrollContainerInner>
    </GroupScrollContainer>
  );
});

class Group extends React.PureComponent<IGroupProps> {
  public render() {
    const { draggableId, index, disabled } = this.props;

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
                  <GroupHeader {...this.props} />
                </div>
                <GroupBody {...this.props} />
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

const GroupHeaderButtonContainer = styled.span`
  margin-left: 2px;
`;

const GroupScrollContainer = styled(SimpleBar)`
  overflow-x: hidden;
  height: 100%;
`;

const GroupScrollContainerInner = styled.div`
  margin: 12px;
`;

export default Group;

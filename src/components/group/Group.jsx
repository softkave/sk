import React from "react";
import { Row, Col, Button } from "antd";
import AddDropdownButton from "../AddDropdownButton.jsx";
import "./group.css";
import SimpleBar from "simplebar-react";
import { getBlockValidChildrenTypes } from "../../models/block/utils";
import DeleteButton from "../DeleteButton";

import "simplebar/dist/simplebar.min.css";

class Group extends React.Component {
  state = {
    fetchingChildren: true
  };

  componentDidMount() {
    this.loadBlockData();
  }

  componentDidUpdate(prevProps) {
    const { group } = this.props;

    if (
      group &&
      prevProps.group &&
      group.customId !== prevProps.group.customId
    ) {
      this.loadBlockData();
    } else {
      this.updateFetchingState();
    }
  }

  updateFetchingState() {
    const { fetchingChildren } = this.state;
    let newState = {};

    if (this.areBlockChildrenLoaded() && fetchingChildren) {
      newState.fetchingChildren = false;
    }

    if (Object.keys(newState).length > 0) {
      this.setState(newState);
    }
  }

  loadBlockData() {
    const { fetchingChildren } = this.state;
    let newState = {};

    if (!this.areBlockChildrenLoaded()) {
      this.fetchChildren();
    } else if (fetchingChildren) {
      newState.fetchingChildren = false;
    }

    if (Object.keys(newState).length > 0) {
      this.setState(newState);
    }
  }

  areBlockChildrenLoaded() {
    const { group } = this.props;

    if (!group) {
      return true;
    }

    const permittedChildrenTypes = getBlockValidChildrenTypes(group);

    if (permittedChildrenTypes) {
      const typeNotLoaded = permittedChildrenTypes.find(type => {
        if (!group[type]) {
          return true;
        } else {
          return false;
        }
      });

      if (typeNotLoaded) {
        return false;
      }
    }

    return true;
  }

  async fetchChildren() {
    const { group, blockHandlers } = this.props;
    await blockHandlers.getBlockChildren(group);
  }

  render() {
    const {
      group,
      children,
      blockHandlers,
      onClickAddChild,
      name,
      onEdit
    } = this.props;

    const { fetchingChildren } = this.state;
    const childrenTypes = group ? getBlockValidChildrenTypes(group) : null;

    return (
      <div className="sk-group">
        <Row className="sk-group-head">
          <Col span={12} style={{ minHeight: "32px" }}>
            <span style={{ fontWeight: "bold" }}>
              {group ? group.name : name}
            </span>
          </Col>
          {group ? (
            <Col span={12} style={{ textAlign: "right" }}>
              {childrenTypes && childrenTypes.length > 0 && (
                <AddDropdownButton
                  types={childrenTypes}
                  onClick={type => onClickAddChild(type, group)}
                />
              )}
              <Button
                icon="edit"
                onClick={() => onEdit(group)}
                style={{ marginLeft: "2px" }}
              />
              <DeleteButton
                deleteButton={
                  <Button
                    icon="delete"
                    type="danger"
                    style={{ marginLeft: "2px" }}
                  />
                }
                onDelete={() => blockHandlers.onDelete(group)}
                title="Are you sure you want to delete this group?"
              />
            </Col>
          ) : null}
        </Row>
        {fetchingChildren ? (
          "Loading"
        ) : (
          <SimpleBar className="sk-group-children">{children}</SimpleBar>
        )}
      </div>
    );
  }
}

export default Group;

import React from "react";
import { Row, Col, Button } from "antd";
import AddDropdownButton from "../AddDropdownButton.jsx";
import "./group.css";
import SimpleBar from "simplebar-react";
import { permittedChildrenTypes } from "../../models/block/block-utils";

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

    if (permittedChildrenTypes[group.type]) {
      const typeNotLoaded = permittedChildrenTypes[group.type].find(type => {
        if (!group[type]) {
          return true;
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

    const childrenTypes = group ? permittedChildrenTypes[group.type] : null;

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
              <Button
                icon="delete"
                type="danger"
                onClick={() => blockHandlers.onDelete(group)}
                style={{ marginLeft: "2px" }}
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

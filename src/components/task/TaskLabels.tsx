import { PlusOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Space } from "antd";
import React from "react";
import { X as CloseIcon } from "react-feather";
import { useSelector } from "react-redux";
import { IBlock, IBlockLabel } from "../../models/block/block";
import { getBlock } from "../../redux/blocks/selectors";
import { IAppState } from "../../redux/store";
import { indexArray } from "../../utils/object";
import StyledContainer from "../styled/Container";
import RoundEdgeTags from "../utilities/RoundEdgeTags";

export interface ITaskLabelsProps {
  orgId: string;
  onChange: (ids: string[]) => void;

  disabled?: boolean;
  labelIds?: string[];
}

const TaskLabels: React.FC<ITaskLabelsProps> = (props) => {
  const { orgId, onChange, disabled } = props;
  const org = useSelector<IAppState, IBlock>((state) => {
    return getBlock(state, orgId)!;
  });

  const labelList = org.boardLabels || [];
  const labelIds = props.labelIds || [];
  const idToLabelMap = React.useMemo(
    () => indexArray(labelList || [], { path: "customId" }),
    [labelList]
  );

  const onAdd = (id: string) => {
    if (labelIds.indexOf(id) === -1) {
      onChange([...labelIds, id]);
    }
  };

  const onRemove = (id: string) => {
    const index = labelIds.indexOf(id);
    const newIds = [...labelIds];
    newIds.splice(index, 1);
    onChange(newIds);
  };

  const renderLabelTag = (label: IBlockLabel, canRemove) => {
    return (
      <RoundEdgeTags key={label.customId} color={label.color}>
        <StyledContainer s={{ alignItems: "center" }}>
          {label.name}
          {canRemove && (
            <CloseIcon
              onClick={() => {
                if (!disabled) {
                  onRemove(label.customId);
                }
              }}
              style={{
                width: "14px",
                marginLeft: "8px",
                color: disabled ? "grey" : undefined,
              }}
            />
          )}
        </StyledContainer>
      </RoundEdgeTags>
    );
  };

  const renderSelectedLabels = () => {
    return labelIds.map((id) => {
      const label: IBlockLabel = idToLabelMap[id];

      if (label) {
        return renderLabelTag(label, true);
      }

      return null;
    });
  };

  const renderAddNewLabel = () => {
    const renderedLabelMenuItems = labelList.map((label) => {
      return (
        <Menu.Item key={label.customId}>
          {renderLabelTag(label, false)}
        </Menu.Item>
      );
    });

    const labelListMenu = (
      <Menu
        onClick={(evt) => {
          onAdd(evt.key);
        }}
        selectedKeys={labelIds}
      >
        {renderedLabelMenuItems}
        {renderedLabelMenuItems.length === 0 && (
          <StyledContainer s={{ justifyContent: "center", padding: "8px" }}>
            No Labels
          </StyledContainer>
        )}
      </Menu>
    );

    return (
      <Dropdown overlay={labelListMenu} trigger={["click"]}>
        <PlusOutlined />
      </Dropdown>
    );
  };

  return (
    <StyledContainer>
      <Space direction="vertical">
        <Space>
          {renderSelectedLabels()}
          {!disabled && renderAddNewLabel()}
        </Space>
      </Space>
    </StyledContainer>
  );
};

export default React.memo(TaskLabels);

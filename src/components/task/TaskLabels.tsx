import { PlusOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Space } from "antd";
import React from "react";
import { X as CloseIcon } from "react-feather";
import { useSelector } from "react-redux";
import { IBlock, IBlockLabel } from "../../models/block/block";
import { getBlock } from "../../redux/blocks/selectors";
import { IReduxState } from "../../redux/store";
import { indexArray } from "../../utils/object";
import StyledContainer from "../styled/Container";
import RoundEdgeTags from "../utilities/RoundEdgeTags";

export interface ITaskLabelsProps {
  orgID: string;
  onChange: (ids: string[]) => void;

  disabled?: boolean;
  labelIDs?: string[];
}

const TaskLabels: React.FC<ITaskLabelsProps> = (props) => {
  const { orgID, onChange, disabled } = props;
  const org = useSelector<IReduxState, IBlock>((state) => {
    return getBlock(state, orgID)!;
  });

  const labelList = org.availableLabels || [];
  const labelIDs = props.labelIDs || [];
  const idToLabelMap = React.useMemo(
    () => indexArray(labelList || [], { path: "customId" }),
    [labelList]
  );

  const onAdd = (id: string) => {
    if (labelIDs.indexOf(id) === -1) {
      onChange([...labelIDs, id]);
    }
  };

  const onRemove = (id: string) => {
    const index = labelIDs.indexOf(id);
    const newIDs = [...labelIDs];
    newIDs.splice(index, 1);
    onChange(newIDs);
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
    return labelIDs.map((id) => {
      const label: IBlockLabel = idToLabelMap[id];
      return renderLabelTag(label, true);
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
        selectedKeys={labelIDs}
      >
        {renderedLabelMenuItems}
        {renderedLabelMenuItems.length === 0 && (
          <StyledContainer s={{ justifyContent: "center", padding: "8px" }}>
            No Labels
          </StyledContainer>
        )}
        <Menu.Divider />
        <Menu.Item>
          <PlusOutlined />
          Add or Edit Tags
        </Menu.Item>
      </Menu>
    );

    return (
      <Dropdown overlay={labelListMenu} trigger={["click"]}>
        <PlusOutlined />
      </Dropdown>
    );
  };

  // const renderSelectLabel = () => {
  //   return (
  //     <Select
  //       placeholder="Select label"
  //       value={undefined}
  //       onChange={(labelID) => onAdd(labelID as string)}
  //     >
  //       {labelIDs.map((id) => {
  //         const label = idToLabelMap[id];
  //         return (
  //           <Select.Option value={id} key={label.customId}>
  //             {renderLabelTag(label, false)}
  //           </Select.Option>
  //         );
  //       })}
  //     </Select>
  //   );
  // };

  return (
    <StyledContainer>
      <Space direction="vertical">
        {/* {renderSelectLabel()} */}
        <Space>
          {renderSelectedLabels()}
          {!disabled && renderAddNewLabel()}
        </Space>
      </Space>
    </StyledContainer>
  );
};

export default React.memo(TaskLabels);

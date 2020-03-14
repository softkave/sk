import { Collapse } from "antd";
import React from "react";
import { IBlock } from "../../models/block/block";
import BlockThumbnail from "../block/BlockThumnail";
import useBlockChildrenTypes from "../hooks/useBlockChildrenTypes";
import StyledContainer from "../styled/Container";
import Tabs, { ITab } from "../Tabs";
import Children from "./Children";
import LoadBlockChildren from "./LoadBlockChildren";
import { BoardResourceType } from "./types";

export interface IBoardTypeListForGroupsProps {
  block: IBlock;
  onClickUpdateBlock: (block: IBlock) => void;
  onClickBlock: (blocks: IBlock[]) => void;
  selectedResourceType: BoardResourceType;
}

const BoardTypeListForGroups: React.FC<IBoardTypeListForGroupsProps> = props => {
  const { block, onClickUpdateBlock, onClickBlock } = props;
  const [type, setType] = React.useState<"projects" | "tasks">("tasks");
  const childrenTypes = useBlockChildrenTypes(block);

  const renderGroupThumbnail = (group: IBlock) => {
    return (
      <BlockThumbnail
        block={group}
        avatarSize="small"
        count={group[type]?.length}
        showFields={["name", "type"]}
      />
    );
  };

  const renderGroup = (group: IBlock) => {
    return (
      <Collapse.Panel header={renderGroupThumbnail(group)} key={group.customId}>
        <Children
          block={group}
          onClickBlock={onClickBlock}
          onClickUpdateBlock={onClickUpdateBlock}
          selectedResourceType={type}
        />
      </Collapse.Panel>
    );
  };

  const renderBlockTypeChildren = () => {
    // @ts-ignore
    if (block[type] && block[type].length > 0) {
      return renderGroup(block);
    }

    return null;
  };

  const renderGroups = () => {
    return (
      <LoadBlockChildren
        parent={block}
        getChildrenIDs={() => block.groups || []}
        render={groups => (
          <Collapse
            bordered={false}
            // defaultActiveKey={groups[0]?.customId}
          >
            {renderBlockTypeChildren()}
            {groups.map(group => renderGroup(group))}
          </Collapse>
        )}
      />
    );
  };

  const tabs: ITab[] = [{ key: "tasks", title: "Tasks", render: renderGroups }];

  if (childrenTypes.includes("project")) {
    tabs.push({ key: "projects", title: "Projects", render: renderGroups });
  }

  const collapseElemSelector = "& .ant-collapse";
  return (
    <StyledContainer
      s={{
        flexDirection: "column",
        height: "100%",
        flex: 1,
        width: "100%",

        [collapseElemSelector]: {
          width: "100%"
        }
      }}
    >
      <Tabs
        scrollInContent
        tabs={tabs}
        activeTabKey={type}
        onChange={key => setType(key as any)}
        alignHeader="flex-end"
      />
    </StyledContainer>
  );
};

export default BoardTypeListForGroups;

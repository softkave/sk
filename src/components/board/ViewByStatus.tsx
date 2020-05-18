import { Badge, Typography } from "antd";
import React from "react";
import { IBlock, IBlockStatus } from "../../models/block/block";
import StyledContainer from "../styled/Container";
import TaskList from "../task/TaskList";
import BoardBaskets, { IBoardBasket } from "./BoardBaskets";
import Column from "./Column";
import BoardBlockChildren from "./LoadBlockChildren";

// const StyledButton = StyledContainer.withComponent("button");

export interface IViewByStatusProps {
  block: IBlock;
  blocks: IBlock[];
  onClickUpdateBlock: (block: IBlock) => void;
}

// TODO: implement drag and drop in this board view
const ViewByStatus: React.FC<IViewByStatusProps> = (props) => {
  const { block, onClickUpdateBlock, blocks } = props;

  const availableStatus = block.availableStatus || [];
  const statusMap = availableStatus.reduce((accumulator, status) => {
    accumulator[status.customId] = status;
    return accumulator;
  }, {} as { [key: string]: IBlockStatus });

  const sortByStatus = () => {
    const statusIdToBlocksMap: {
      [key: string]: IBlock[];
    } = availableStatus.reduce((accumulator, status) => {
      accumulator[status.customId] = [];
      return accumulator;
    }, {});

    const noStatusList: IBlock[] = [];

    blocks.forEach((nextBlock) => {
      if (!nextBlock.status) {
        noStatusList.push(nextBlock);
        return;
      }

      const initialStatusBlockList = statusIdToBlocksMap[nextBlock.status];
      const statusBlockList = initialStatusBlockList || [];
      statusBlockList.push(nextBlock);

      if (!initialStatusBlockList) {
        statusIdToBlocksMap[nextBlock.status] = statusBlockList;
      }
    });

    return {
      noStatusList,
      map: statusIdToBlocksMap,
    };
  };

  const getBaskets = (): IBoardBasket[] => {
    const sortResult = sortByStatus();
    const baskets: IBoardBasket[] = [];

    if (sortResult.noStatusList.length > 0) {
      baskets.push({
        key: "no-status",
        items: sortResult.noStatusList,
        isDragDisabled: true,
      });
    }

    Object.keys(sortResult.map).forEach((key) => {
      const value = sortResult.map[key];
      baskets.push({ key, items: value, isDragDisabled: true });
    });

    return baskets;
  };

  const renderColumnHeader = (name: string, count: number) => {
    return (
      <StyledContainer>
        <Typography.Text
          strong
          style={{ marginRight: "8px", textTransform: "capitalize" }}
        >
          {name}
        </Typography.Text>
        <Badge count={count} style={{ backgroundColor: "rgba(0,0,0,0.3)" }} />
      </StyledContainer>
    );
  };

  const renderStatus = (basket: IBoardBasket) => {
    const status = statusMap[basket.key];
    const statusBlocks = basket.items;
    const isNoStatus = !status;
    const statusName = status ? status.name : "No status";
    const statusId = isNoStatus ? "No status" : status.customId;

    return (
      <Column
        header={renderColumnHeader(statusName, statusBlocks.length)}
        body={
          <TaskList
            noDnD
            tasks={statusBlocks}
            block={block}
            isDragDisabled={false}
            isDropDisabled={isNoStatus}
            toggleForm={onClickUpdateBlock}
            droppableId={statusId}
            droppableType="status"
          />
        }
      />
    );
  };

  const renderBaskets = () => {
    return (
      <BoardBaskets
        noDnD
        blocks={blocks}
        getBaskets={getBaskets}
        id={block.customId}
        renderBasket={renderStatus}
        emptyMessage="No blocks available"
        hideEmptyBaskets={false}
      />
    );
  };

  return (
    <StyledContainer
      s={{
        flex: 1,
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {renderBaskets()}
    </StyledContainer>
  );
};

export default React.memo(ViewByStatus);

import { Badge, Typography } from "antd";
import React from "react";
import { IBlock, IBlockStatus } from "../../models/block/block";
import StyledContainer from "../styled/Container";
import TaskList from "../task/TaskList";
import BoardBaskets, { IBoardBasket } from "./BoardBaskets";
import Column from "./Column";

export interface IViewByStatusProps {
  statuses: IBlockStatus[];
  blocks: IBlock[];
  onClickUpdateBlock: (block: IBlock) => void;

  style?: React.CSSProperties;
}

// TODO: implement drag and drop in this board view
const ViewByStatus: React.FC<IViewByStatusProps> = (props) => {
  const { statuses, onClickUpdateBlock, blocks, style } = props;

  const statusMap = statuses.reduce((accumulator, status) => {
    accumulator[status.customId] = status;
    return accumulator;
  }, {} as { [key: string]: IBlockStatus });

  const sortByStatus = () => {
    const statusIdToBlocksMap: {
      [key: string]: IBlock[];
    } = statuses.reduce((accumulator, status) => {
      accumulator[status.customId] = [];
      return accumulator;
    }, {});

    const noStatusList: IBlock[] = [];

    blocks.forEach((nextBlock) => {
      if (!nextBlock.status) {
        console.log({ nextBlock });
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
    const statusName = status ? status.name : "No status";

    return (
      <Column
        header={renderColumnHeader(statusName, statusBlocks.length)}
        body={<TaskList tasks={statusBlocks} toggleForm={onClickUpdateBlock} />}
      />
    );
  };

  const renderBaskets = () => {
    return (
      <BoardBaskets
        blocks={blocks}
        getBaskets={getBaskets}
        renderBasket={renderStatus}
        emptyMessage="No blocks available"
        hideEmptyBaskets={false}
      />
    );
  };

  return (
    <StyledContainer
      s={{
        ...style,
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

ViewByStatus.defaultProps = { style: {} };

export default React.memo(ViewByStatus);

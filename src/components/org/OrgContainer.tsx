import React from "react";
import { useSelector } from "react-redux";
import { BlockType, IBlock } from "../../models/block/block";
import addBlockOperationFunc from "../../redux/operations/block/addBlock";
import updateBlockOperationFunc from "../../redux/operations/block/updateBlock";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import { flattenErrorListWithDepthInfinite } from "../../utils/utils";
import getNewBlock from "../block/getNewBlock";
import useOperation from "../hooks/useOperation";
import Org, { IOrgValues } from "./Org";

export interface IOrgContainerProps {
  onClose: () => void;

  block?: IBlock;
}

const OrgContainer: React.FC<IOrgContainerProps> = (props) => {
  const { onClose } = props;
  const user = useSelector(getSignedInUserRequired);
  const [block, setBlock] = React.useState<IBlock>(
    props.block || getNewBlock(user, BlockType.Org)
  );

  const opStat = useOperation();

  const errors = opStat.error
    ? flattenErrorListWithDepthInfinite(opStat.error)
    : undefined;

  React.useEffect(() => {
    if (opStat.isCompleted && !props.block) {
      onClose();
    }
  });

  const onSubmit = async (values: IOrgValues) => {
    const data = { ...block, ...values };
    setBlock(data);

    if (props.block) {
      updateBlockOperationFunc(
        {
          block,
          data,
        },
        {
          id: opStat.id,
        }
      );
    } else {
      addBlockOperationFunc(
        {
          user,
          block: data,
        },
        { id: opStat.id }
      );
    }
  };

  return (
    <Org
      formOnly={!props.block}
      org={props.block} // props.block not block, because it's used to determine if it's a new block or not
      value={block as any}
      onClose={onClose}
      onSubmit={onSubmit}
      isSubmitting={opStat.isLoading}
      errors={errors}
    />
  );
};

export default React.memo(OrgContainer);

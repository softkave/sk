const errorMessages = {
  invalidBlockType: "Invalid block type",
  orgExists: "Organization exists",
  groupExists: "Group exists",
  taskExists: "Task exists",
  rootExists: "Root block exists",
  projectExists: "Project exists",
  transferSourceBlockMissing: "Transfer - source block missing",
  transferDraggedBlockMissing: "Transfer - transfered block missing",
  transferDestinationBlockMissing: "Transfer - destination block missing",
  transferDraggedBlockNotFoundInParent:
    "Transfer - transfered block not found in the source block",
  blockNotFound: "Block not found"
};

const errorFields = {
  block: "system.block",
  invalidBlockType: "system.block.invalidBlockType",
  blockExists: "system.block.blockExists",
  transferDraggedBlockMissing: "system.block.transferDraggedBlockMissing",
  transferSourceBlockMissing: "system.block.transferSourceBlockMissing",
  transferDestinationBlockMissing:
    "system.block.transferDestinationBlockMissing",
  transferDraggedBlockNotFoundInParent:
    "system.block.transferDraggedBlockNotFoundInParent",
  blockNotFound: "system.block.blockNotFound"
};

export { errorFields, errorMessages };

import React from "react";

// const dndColumnWarning = () => {
//   message.warn("Drag and drop is not supported within a column");
// };

// const handleGroupRelatedDrag = React.useCallback(
//   (result: DropResult, provided: ResponderProvided) => {
//     if (!result.destination) {
//       return;
//     }

//     const draggedBlockID = result.draggableId;
//     const draggedBlock = getBlock(store.getState(), draggedBlockID)!;

//     // did not move out of group - can bail early
//     if (result.source.droppableId === result.destination.droppableId) {
//       if (result.source.index === result.destination.index) {
//         return;
//       }

//       if (draggedBlock.type !== "group") {
//         if (draggedBlock.type === "task") {
//           dndColumnWarning();
//         }

//         return;
//       }
//     }

//     let dropPosition: number = result.destination?.index;
//     const sourceBlockID = result.source.droppableId;

//     // TODO: volatile, blocks are possibly null OR undefined
//     const sourceBlock = getBlock(store.getState(), sourceBlockID)!;

//     if (draggedBlock.type === "org" || draggedBlock.type === "project") {
//       return;
//     }

//     const groupContext =
//       draggedBlock.type === "group"
//         ? (result.type as BlockGroupContext)
//         : undefined;

//     if (groupContext) {
//       const containerName =
//         groupContext === "groupTaskContext" ? "tasks" : "projects";
//       const container: string[] = sourceBlock[containerName] || [];

//       if (container.length > 0) {
//         dropPosition -= 1;
//       }
//     }

//     if (dropPosition < 0) {
//       return;
//     }

//     transferBlockOperationFn({
//       data: {
//         sourceBlockID,
//         draggedBlockID,
//         dropPosition,
//         groupContext,
//         destinationBlockID: result.destination?.droppableId,
//       },
//     });
//   },
//   [store]
// );

// const handleStatusRelatedDrag = React.useCallback(
//   (result: DropResult, provided: ResponderProvided) => {
//     if (!result.destination) {
//       return;
//     }

//     // did not move out of status - can bail early
//     if (result.source.droppableId === result.destination.droppableId) {
//       if (result.source.index !== result.destination.index) {
//         dndColumnWarning();
//       }

//       return;
//     }

//     const destinationStatus = result.destination.droppableId;
//     const draggedBlockID = result.draggableId;

//     // TODO: volatile, blocks are possibly null OR undefined
//     const draggedBlock = getBlock(store.getState(), draggedBlockID)!;

//     console.warn("not implemented yet");
//     return;

//     updateBlockOperationFunc({
//       block: draggedBlock,
//       data: {
//         status: destinationStatus,
//       },
//     });
//   },
//   [store]
// );

// const onDragEnd = React.useCallback(
//   (result: DropResult, provided: ResponderProvided) => {
//     console.log({ result });
//     if (result.type === "status") {
//       handleStatusRelatedDrag(result, provided);
//     } else if (
//       result.type === "groupTaskContext" ||
//       result.type === "groupProjectContext"
//     ) {
//       handleGroupRelatedDrag(result, provided);
//     }
//   },
//   [store]
// );

export const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const reorderBoard = ({ board, source, destination }) => {
  const current = [...board[source.droppableId]];
  const next = [...board[destination.droppableId]];
  const target = current[source.index];

  // moving to same list
  if (source.droppableId === destination.droppableId) {
    const reordered = reorder(current, source.index, destination.index);
    const result = {
      ...board,
      [source.droppableId]: reordered
    };
    return {
      board: result
    };
  }

  // moving to different list

  // remove from original
  current.splice(source.index, 1);
  // insert into next
  next.splice(destination.index, 0, target);

  const result = {
    ...board,
    [source.droppableId]: current,
    [destination.droppableId]: next
  };

  return {
    board: result
  };
};

export function generatePermission(block, role, assignedBy) {
  return {
    assignedBy,
    role: role.role,
    blockId: block.id,
    assignedAt: Date.now(),
    type: block.type
  };
}

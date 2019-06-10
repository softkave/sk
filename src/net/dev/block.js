module.exports = {
  getRoleBlocks() {
    let rootBlock = JSON.parse(sessionStorage.getItem("rootBlock-dev"));
    return { blocks: [rootBlock] };
  },

  getBlockChildren() {
    return { blocks: [] };
  },

  getCollaborators() {
    return {
      collaborators: [JSON.parse(sessionStorage.getItem("user-data-dev"))]
    };
  },

  getCollabRequests() {
    return { requests: [] };
  }
};

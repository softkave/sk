module.exports = {
  getInitBlocks() {
    let rootBlock = JSON.parse(sessionStorage.getItem("rootBlock-dev"));
    return [rootBlock];
  },

  getPermissionBlocks() {
    return [];
  }
};

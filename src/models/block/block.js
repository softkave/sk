const randomColor = require("randomcolor");

class Block {
  bench = [];
  collaborationRequests = [];
  constructor(data) {
    this.name = data.name;
    this.description = data.description;
    this.expectedEndAt = data.expectedEndAt;
    this.completedAt = data.completedAt;
    this.createdAt = data.createdAt || Date.now();
    this.color = data.color || randomColor();
    this.updatedAt = data.updatedAt;
    this.type = data.type;
    this.owner = data.owner;
    this.parents = data.parents;
    this.data = data.data;
    this.createdBy = data.createdBy;
    this.collaborators = data.collaborators;
    this.acl = data.acl;
    this.roles = data.roles;
    this.path = null;
  }

  static newTask() {}
}

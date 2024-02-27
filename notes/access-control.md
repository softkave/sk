# Access Control

TODOs:

- Fetch all of a permission group's permissions so we can see from a glance all the things it's allowed and denied ofr inherited or otherwise
- A UI that allows for searching through this permission list

Fetch view-level permissions

- On open organization, fetch permission checks related to
  - update | delete org
  - read boards
  - read collaborators
  - read collaboration requests
  - assign permissions
  - create chat
- On open board list
  - create | update | delete boards and each individual board
- On open collaborators list
  - create | delete collaborators and each individual collaborator
- On open collaboration requests
  - create | delete requests and each individual request
- On open board
  - crud task
  - crud status
  - crud label
  - crud resolution
  - crud sprint
  - assign permissions

Flows

- On organizations or boards, can access access control through "access control" option in options menu
  - Permission groups
    - Can create, update, and delete permission groups
    - Permission group
      - Can delete permission group
      - Details
      - Permission groups assigned to
        - Can assign to more permission groups
      - Collaborators assigned to
        - Can assign to more collaborators
      - Permitted and non-permitted actions either directly attached or inherited
        - Can add and remove permissions directly attached
        - Can navigate to permission group to remove permission
  - Collaborators with permission groups and custom permissions
    - Can pick collaborator to assign permission groups or custom permissions
    - Assigned permission groups
      - Can add and remove permission groups
    - Permitted and non-permitted actions either directly attached or inherited
      - Can add and remove permissions directly attached
      - Can navigate to permission group to remove permission
- Fan out socket update to org/board listeners to referesh their permissions data cache

Components

- ResourceAccessControlScreen
  - ResourcePermissionGroupList
    - Fetch resource permission groups using useFetchResourcePermissionGroups
    - PermissionGroupForm
    - PermissionGroupScreen
      - Fetch permission group if not already fetched using useFetchPermissionGroup
      - PermissionGroupDetails
      - PermissionGroupChildrenPermissionGroupList
        - Fetch children permission groups using useFetchPgChildrenResources
        - AddPermissionGroupToPermissionGroup
      - PermissionGroupChildrenCollaboratorList
        - Fetch children collaborators using useFetchPgChildrenResources
        - AddCollaboratorToPermissionGroup
      - PermissionGroupAssignedPermissionGroupList
        - Fetch permission groups asssigned using useFetchResourceAssignedPermissionGroups
      - ResourcePermittedActionsList
        - Fetch permission items using useFetchResourcePermissionItems
  - ResourceCollaboratorsWithPermissionsList
    - ResourcePermittedActionsList
      - Resource type + Action
      - For certain resources under org like boards, can select all or individual items
        - ResourceList
          - Show resource type list depending on requested resource type
          - (Resource type)List will fetch and display data
      - Conditions
        - If (field) is | is after | is before | is between (predicate)
        - Different resource types will have different conditions
      - Allow or deny access
- Fetch, map, and index
  - We fetch data, index it by custom ID, and save it in a general map
  - The requester can keep the indexes and can be used to retrieve the data
  - The requester also keeps the load and error states
  - useMapListContainer and useMapListItem
    - Will handle pagination

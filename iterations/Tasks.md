# Tasks

- Change all align-items to align-content
- Write a method ot consume operation statuses, so that we can show notification modals or messages when an operation fails. Also, add a topbar status icon that when clicked, shows a list of all the operations and their current status, and the user can filter and sort.
- Move all id generation to the server side
- Show errors consistently in forms when save fails, and handle touched bug
- Integrate redux-thunk
- Fix board reload when user saves collaboration request OR mock the collaboration request OR fetch it immediately save is complete
- Make the collaborators list in the collaboration request form light gray
- Add a global generic error if any of the form fields have error, and there isn't one
- Disable all input fields when the form is submitting?
- Implement user sprints
- Implement or find an open source ( check AntD ) text with text overflow component for your text components
  - Select org
- Some mysterious API calls are failing in the production build, look into them
- Vertical scroll, plus toggle scroll type for Kanbanboard
- Implement fetching all groups children together and not individually as it is now
- Add scope id to all operation function calls
- Monitor and log all crashes
- Implement a way to reduce or monitor memory usage to avoid a browser crash
- Implement Empty if no collaborator is assigned to tasks yet, if no parent is selected yet, if no notifications, or collaboration requests, or blocks exist in a group or kanban board, or org list, etc. Basically any list
- Move the count badge to the right in lists with count
- Implement breadcrumb for nested boards ( projects ), use it for navigation
- Hide select org in Notifications
- Show Softkave in header, maybe hide select org on mobile for this
- Redesign task collaborator thumbnail
- Make columns flat UI
- Open select options don't follow Select when user scrolls
- Add error message to all validation schemas ( Joi in server and Yup in client )
- Show empty or hidden groups view
- Mobile: Org ( board ) -> projects ( -> board ) -> groups -> tasks | projects
- Uniformly center Empty in all lists
- Show a generic error in forms when they fail
- Generate colors for collaboration requests and assign the colors to the users when they eventually signup. Use the user's color avatar if the user already exists
- Small Github like label as badges and Github style labels for priority in task form

## Hiding empty groups/block transfer

- Add groups field to Board and the field that has children should be auto-selected or the field the user selects

## Redesign

- virtualized list
- move the child route name like "Tasks" to the top with the org or board block name
  Block name | Tasks | + \*
- have the name visible for empty routes too
- add icons to all types, and add the icons to their create buttons, like "# Create Task"

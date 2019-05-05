2. task
   collaborator
   data - primitive | object ?
3. find out if we can nest \$elemMatch queries to query arrays within arrays
4. cache failed tries due to server errors
5. inform user of errors & if they try to close if data is still not synced, inform user
6. handle permission denied
7. add toggledBy to block.collaborators.data.dataType
8. change expectedEndAt to completeAt
9. check if email is available for signup
10. split descriptors into logical fields
11. use updatedAt to correlate updates in the server to avoid overwritting
12. allow updating exact data in arrays, rather than updating everything
    you can convert the arrays into object-like paths, mongodb can query and maybe update with them
13. fix autosize in description
14. use custom scrollbar only in desktop
15. embed version
16. external link for issues and requests
17. use role attribute for assistive technologies
18. validate some input onBlur, not onChange

- ability to create custom tags for task priority
- when you update the acl of a block, should it update the children acl too?
- adjust display, cause it's kinda hard to see
- optimize for accessiblilty
- start supporting date strings
- change a date formats to either descriptive like "March 5, 2018" or relative, like "a month from now"
- cache all data in indexeddb
- notify user of failed syncs, especially when they are trying to leave
- add a redux field of failed syncs using their paths
- poll to see if there's comnnections, then report to user if there isn't
- check error field from server for special case errors, like failed autnetication
- maybe add timestamp + unique user token (for ids only) to all ids for another level of uniqueness
- change "Collaborator" to collaborator name in CollaboratorForm
- update server, all inputs carry their own ids
- when moving projects between groups, check if project with same name doesn't exist in destination group
- fix root block dashboard header (with back btn, collaborators, and create, and rootblock name)
- fix error display, and include new error types (system. , etc)
- there are some API calls that we should wait for, and some to return immediately, differentiate
- add user setting for async or sync
- maybe cache data in client, in case it's async and call fails
- includes games
- org | group wide games, with highest score
- split screens for displaying other stuffs
- tabs and windows, with an absolute button that can be placed anywhere based on user config (for quick access)
  and tabbing, etc
- consider making any block that can house something inherit from group
- landing page, and wall (where users write stuffs, can be overwritten, and cleaned, use canvas, can position)
  users can make it their background picture
- notifications on the client side
- show better loading UI when loading block children
- notes
- emoji support
- mentioning
- comments
- better notifications
- Agile
- new types - note, sprint, table etc
- filtering
- searching
- different sprint group in the UI maybe
- sorting types & importance
- notification on new data (based on user config, auto, prompt)
- user configs page
- user avatar, provide defaults (maybe use the colors)
- refactoring functions to make them reuseable
- handle errors better in query (it doesn't catch them)
- redesign async loading, maybe use redux, not state
- some API calls rely on others, make sure those ones are finished first before making new calls, like
  toggleTask relies on adding a collaborator in update
- maybe merge toggleTask with updateTask

* AI embedded, can play games with users
* Can auto create task and other things based on user messages, like "i'll get back to you" should become a task
* whether AI can doi stuffs based on user action is based on settings, no - prompt - auto
* know user usage pattern and craft a personal UI, like auto tabbing stuffs that are used frequestly
* log render times, API call repsonse time, etc
* log use to better design product

1. add priority to block schema in backend
2. task
   collaborator
   data - primitive | object ?
3. find out if we can nest \$elemMatch queries to query arrays within arrays
4. trim all string inputs
5. cache failed tries due to server errors
6. inform user of errors & if they try to close if data is still not synced, inform user
7. handle permission denied
8. add toggledBy to block.collaborators.data.dataType
9. call net based on actions, not graphql tree
10. change getPermissionBlocks to getInitBlocks (rootBlock, project, tasks, groups, assignedTasks)
11. is it updateReadNotification
12. add color to user
13. change expectedEndAt to completeAt
14. check if email is available for signup
15. split descriptors into logical fields
16. use updatedAt to correlate updates in the server to avoid overwritting
17. allow updating exact data in arrays, rather than updating everything
    you can convert the arrays into object-like paths, mongodb can query and maybe update with them
18. change priority from data to it's own field
19. fix autosize in description

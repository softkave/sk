# Non-Logged in Usage

## Options

- Keep it simple, only view public orgs and boards. Outside that, app will require login.
  - Issue: if user is already logged in, how will the UX work here?
- When viewing a public org or board, the org/board is added to your list, and you can come back to it in recently viewed orgs/boards.
  - Will get socket updates as usual.
  - Can interact with org/board as logged-in user if logged in, and if not logged in, you'll be prompted to log in/enter some info (but will not log in or signup)/continue anonymously.
    - If info is entered, info will be persisted so that future non-logged in viewage will use previously entered info.
    - Will allow logging out, which will delete non-logged in info.
    - Let them know that they do not have a persistent account though.
    - If user decides to sign up, prefill using non-logged in info if present.
    - How will customId, email, and client (client and socket connection) work?
    - How will backend know it's public/logged in user?
  - Can be a pathway into offline usage.
    - Where should we store data for offline usage?
    - Should offline usage be available if user is logged in?
    - How to upload data if user signs up, or logs in?

Pathway:

- When user opens app either with or without an org link
- If storage has token
  - Attempt to log in/get user details
    - User can be an anonymous user
  - If it fails, remove user saved tokens
  - Move to step 3
- Step 3: Generate an anonymous user token for user
  - Fetch data with anonymous token
  - Socket connect and update data with anonymous token
    - We need userId to update data
      - Should we persist an id/token for the client
      - How do we surface updater information, like updated by "so so so"?
    - Can a client have multiple anonymous users
    - Should we collect anonymous user's email to update them if they watch a resource?
    - Should we store anonymous user's data?
    - Should anonymous user's get push notification?
- Step 3.1 without token:

  - Get client-attached client or create one if not present
  - Get anonymous user token with client
    - An anonymous user will be created on the server-side with an ID, fake email, and random name
  - Use anonymous token to connect socket
    - Subscribe to rooms if is in room-owning resource
    - Prompt to subscribe to push notification if can chat in org and client does not have push notification
      - A different user could have used the client to subscribe to push notification but not this user. We need user-scoped clients. Seeing we'll still use the same push notification subscription from the client, another possiblity will be user-scoped push notification permission. So, when prompting for push notifications and the user allows:
        - If client is subscribed to push notifications
          - Mark that specific user wants push notifications
        - If client is not subscribed
          - Prompt for push subscription from the browser
            - If cannot because browser blocks it
              - Tell the user how to unblock it depending on their browser
          - Subscribe client if user allows
          - Mark that specific user wants push notifications
  - Updates will use the anonymous user's ID
  - Anonymous user can be prompted to enter more info or skip
  - Anonymous users will never be deleted to prevent missing data issues, but the user info should be removable.
    - How will we make the anonymous user data removable?
  - Issues to solve:
    - Should we require email and or name for updates?
      - For now, no. But it will mean some updates will not be trackable. Maybe in the future, we can have an option where board/org owners can mandate certain data be collected before anonymous users can update their data.
    - If anonymous user logs out, should we delete token and or data?
      - Delete token but not data. We'll want to match with the data in the future and data is need to know who changed what.
    - If anonymous user provides info and email is same as a previously provided anonymous user email/logged in user email in the same client or in another, should we connect their data and reuse that anonymous user?
      - Yes we should. That'd
    - Should signed up users be able to have anonymous accounts?
      - Yes. Someone else may be using the person's email, so we should keep both separate. We could ask the signed up user if they are the ones and if we should merge both accounts.
    - How to keep track of merged settings between signed up and anonymous user account if user agreed to merge?
      - This won't be necessary, we'd be keeping both accounts strictly seperate cause same issue remains, someone else maybe using the person's account.

- if user is in app and not logged in/does not have a public user
  - generate new public user account for user
  - clear account if tab closes

Other Additional Features:

- Recently viewed resources
- Sort resource list by recently viewed
- Add special logouts for demo and anonymous users
- Hide some controls or disable them is user is an anonymous user
  - Create org
  - Update user/some parts of user settings page
  - Don't make some API calls if user is an anonymous user cause they'll fail
  - Carry over certian url query keys when naavigating, like demo mode key, cause otherwise, reloading will go to homepage, or we can leave it like that

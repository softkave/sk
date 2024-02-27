# Data

- Central map storage for different data types based on custom ID
- Centralized map store will provide generic actions and every action will be performed with custom ID
- Prefer passing a type's central store if rendering lists & getting the single item if rendering singularly
- Keyed centralized loading state stored in key-value state

```typescript
interface IReduxMaps {
  orgs: Record<string, IWorkspace>;
  boards: Record<string, IBoard>;
  // other data types
}

interface IKeyValueState {
  [key: string]: any;
}

interface ILoadingState<T = any> {
  key: string;
  isLoading?: boolean;
  error?: IAppError[];
  value?: T;
}

interface IResourcePermissionGroupsLoadStateValue {
  count: number;
  pgIdList: string[];
}
```

- Resource permission group load flow
  - if loading state exists, get pg ids using the current page and page size (tracked in-component) and with it, get pgs
  - if is loading or there is no loading state
    - if has items, render small notif on top
    - otherwise, render on the full page
  - if is error
    - if has items, render small notif on top
    - otherwise, render on the full page

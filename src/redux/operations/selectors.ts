import { IAppState } from "../types";
import { IOperation, isOperation } from "./operation";

const getOperationWithId = (state: IAppState, id: string) =>
    state.operations[id];

type OperationFilter = (
    operation: IOperation,
    selector: IQueryFilterOperationSelector
) => boolean;

export interface IQueryFilterOperationSelector {
    id?: string;
    resourceId?: string;
    type?: string;
    filter?: OperationFilter;
}

const idFilter: OperationFilter = (
    op: IOperation,
    selector: IQueryFilterOperationSelector
) => op.id === selector.id;

const resourceIdFilter: OperationFilter = (
    op: IOperation,
    selector: IQueryFilterOperationSelector
) => op.resourceId === selector.resourceId;

const typeFilter: OperationFilter = (
    op: IOperation,
    selector: IQueryFilterOperationSelector
) => op.operationType === selector.type;

const makeFilters = (
    selector: IQueryFilterOperationSelector
): OperationFilter => {
    const filters: OperationFilter[] = [];

    if (selector.filter) {
        return selector.filter;
    }

    if (selector.id) {
        filters.push(idFilter);
    }

    if (selector.resourceId) {
        filters.push(resourceIdFilter);
    }

    if (selector.type) {
        filters.push(typeFilter);
    }

    if (filters.length === 0) {
        return (op: IOperation, s: IQueryFilterOperationSelector) => false;
    }

    return (op: IOperation, s: IQueryFilterOperationSelector) => {
        const results = filters.map((filter) => filter(op, s));
        return results.reduce((result, prev) => result && prev, results[0]);
    };
};

const queryFilterOperation = (
    state: IAppState,
    selector: IQueryFilterOperationSelector
) => {
    if (Object.keys(selector).length === 0) {
        return;
    }

    const ids = Object.keys(state.operations);
    const filter = makeFilters(selector);

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < ids.length; i++) {
        const op = state.operations[ids[i]];
        const select = filter(op, selector);

        if (select) {
            return op;
        }
    }
};

function queryFilterOperations(
    state: IAppState,
    selectors: Array<
        IQueryFilterOperationSelector | IOperation | null | undefined
    >
) {
    const opIds = Object.keys(state.operations);

    return selectors.map((selector) => {
        if (!selector) {
            return undefined;
        }

        if (Object.keys(selector).length === 0) {
            return undefined;
        }

        if (isOperation(selector)) {
            return selector;
        }

        const filter = makeFilters(selector);

        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < opIds.length; i++) {
            const op = state.operations[opIds[i]];

            if (filter(op, selector)) {
                return op;
            }
        }

        return undefined;
    });
}

export default class OperationSelectors {
    public static getOperationWithId = getOperationWithId;
    public static queryFilterOperation = queryFilterOperation;
    public static queryFilterOperations = queryFilterOperations;
}

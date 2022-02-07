export type AnyFunction = (...args: any) => any;
export type AnyFunctionAsync = (...args: any) => Promise<any>;

export interface IAnyObject {
    [key: string]: any;
}

export interface IUpdateItemById<T> {
    id: string;
    data: Partial<T>;
}

export interface IUpdateComplexTypeArrayInput<Update, Add = Update> {
    add?: Add[];
    remove?: string[];
    update?: Update[];
}

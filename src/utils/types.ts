export type AnyFunction = (...args: any) => any;
export type AnyFunctionAsync = (...args: any) => Promise<any>;

export interface IAnyObject {
  [key: string]: any;
}

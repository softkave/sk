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

export type UnpackArray<T> = T extends (infer U)[] ? U : T;
export type Omit1<T, K extends keyof T> = Omit<T, K>;
export type AnyObject = { [k: string | number | symbol]: any };
export type ObjectValues<T> = T[keyof T];

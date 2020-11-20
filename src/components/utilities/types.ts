import { IAppError } from "../../net/types";

export interface IFormError<T extends object | undefined> {
    errorList: IAppError[];
    errors: T & { error?: string };
}

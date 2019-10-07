import isObject from "lodash/isObject";
import { indexArray } from "../object";
import testValidity from "../testValidity";
import OperationErrorItem, { anErrorOccurred } from "./OperationErrorItem";

// TODO: add calling captureStackTrace
export default class OperationError extends Error {
  public static identifier = "OperationError";
  public static isOperationError(item: any): item is OperationError {
    return item instanceof OperationError;
  }

  public static isLikeOperationError(item: any) {
    const testErrorsValidity = (errors?: any[]) => {
      if (Array.isArray(errors)) {
        return (
          errors.findIndex(errorItem => {
            return OperationErrorItem.isLikeOperationErrorItem(errorItem);
          }) === -1
        );
      }

      return false;
    };

    if (OperationError.isOperationError(item)) {
      return true;
    } else if (isObject(item)) {
      const error: any = item;

      if (
        testErrorsValidity(error.errors) &&
        testValidity(error.message, false, "string")
      ) {
        return true;
      }
    }

    return false;
  }

  public static fromAny(item: any): OperationError {
    if (OperationError.isOperationError(item)) {
      return item as OperationError;
    } else if (OperationError.isLikeOperationError(item)) {
      return new OperationError(item.errors, item.message);
    } else if (OperationErrorItem.isLikeOperationErrorItem(item)) {
      return new OperationError([item]);
    }

    return OperationError.fromAny(defaultOperationError);
  }

  public errors: OperationErrorItem[];

  constructor(errors?: OperationErrorItem[], message?: string) {
    super(message);
    this.name = OperationError.identifier;
    this.errors = errors || [];
  }

  public pushError(error: OperationErrorItem) {
    this.errors.push(error);
  }

  public concatErrors(errors: OperationErrorItem[]) {
    this.errors = this.errors.concat(errors);
  }

  public getErrorsWithoutBaseNames(baseNames: string[]) {
    if (baseNames.length === 0) {
      return this;
    }

    const errors = this.errors.filter(error => {
      const errorBaseName = error.getBaseName();

      if (baseNames.indexOf(errorBaseName)) {
        return false;
      } else {
        return true;
      }
    });

    return new OperationError(errors, this.message);
  }

  public removeBaseNamesFromErrors(baseNames: string[]) {
    if (baseNames.length === 0) {
      return this;
    }

    const errors = this.errors.map(error => {
      const errorBaseName = error.getBaseName();

      if (baseNames.indexOf(errorBaseName)) {
        return error.removeCurrentBaseName();
      } else {
        return error;
      }
    });

    return new OperationError(errors, this.message);
  }

  public replaceBaseNamesInErrors(params: Array<{ from: string; to: string }>) {
    if (params.length === 0) {
      return this;
    }

    const errors = this.errors.map(error => {
      const errorBaseName = error.getBaseName();
      const replaceItem = params.find(item => {
        return item.from === errorBaseName;
      });

      if (replaceItem) {
        return error.replaceBaseName(replaceItem.to);
      } else {
        return error;
      }
    });

    return new OperationError(errors, this.message);
  }

  public flatten(): { [key: string]: string[] } {
    return indexArray(this.errors, {
      indexer: next => {
        if (next.field) {
          return next.field;
        } else {
          return "error";
        }
      },
      proccessValue: (value, existing) => {
        if (existing) {
          existing.push(value.message);
          return existing;
        } else {
          return [value.message];
        }
      }
    });
  }

  public transform(params: {
    filterBaseNames?: string[];
    stripBaseNames?: string[];
    replaceBaseNames?: Array<{ from: string; to: string }>;
  }) {
    return this.getErrorsWithoutBaseNames(params.filterBaseNames || [])
      .replaceBaseNamesInErrors(params.replaceBaseNames || [])
      .removeBaseNamesFromErrors(params.stripBaseNames || []);
  }

  public throwErrors() {
    throw this.errors;
  }
}

export const defaultOperationError = new OperationError([
  OperationErrorItem.fromAny(anErrorOccurred)
]);

import isObject from "lodash/isObject";
import testExistenceAndType from "../testExistenceAndType";

// TODO: add calling captureStackTrace
// It seems like it already has stack trace, but test further
export default class OperationErrorItem extends Error {
  public static isOperationItem(item: any): item is OperationErrorItem {
    return item instanceof OperationErrorItem;
  }

  public static isLikeOperationErrorItem(item: any) {
    const testValidity = testExistenceAndType;

    if (OperationErrorItem.isOperationItem(item)) {
      return true;
    } else if (isObject(item)) {
      const error: any = item;

      if (
        testValidity(error.type, true, "string") &&
        testValidity(error.message, false, "string") &&
        testValidity(error.field, false, "string") &&
        testValidity(error.action, false, "string")
      ) {
        return true;
      }
    }

    return false;
  }

  public static fromAny(item: any) {
    if (OperationErrorItem.isOperationItem(item)) {
      const errorItem: OperationErrorItem = item;
      return new OperationErrorItem(
        errorItem.type,
        errorItem.message,
        errorItem.field,
        errorItem.action
      );
    } else if (OperationErrorItem.isLikeOperationErrorItem(item)) {
      return new OperationErrorItem(
        item.type,
        item.message,
        item.field,
        item.action
      );
    } else if (item instanceof Error) {
      const error: Error = item;
      const errorItem = new OperationErrorItem(
        defaultOperationErrorItemType,
        error.message
      );

      errorItem.stack = error.stack;
    } else if (typeof item === "string") {
      return new OperationErrorItem(defaultOperationErrorItemType, item);
    }

    return new OperationErrorItem(
      defaultOperationErrorItemType,
      anErrorOccurredMessage
    );
  }

  public type: string;
  public action?: string;
  public field?: string;
  public message: string;
  public errorMessage?: string;

  constructor(type: string, message?: string, field?: string, action?: string) {
    super(message);
    this.type = type;
    this.field = field;
    this.action = action;
    this.name = "OperationErrorItem";
    this.message = message || "";
    this.errorMessage = message;
  }

  public isType(type: string) {
    return this.type === type;
  }

  public hasField() {
    return !!this.field;
  }

  public getFieldNamesAsArray() {
    return this.hasField() ? this.field!.split(".") : [];
  }

  public getFieldNameIndex(searchFieldName: string) {
    return this.getFieldNamesAsArray().findIndex(fieldName => {
      return fieldName === searchFieldName;
    });
  }

  public getBaseName() {
    return this.getFieldNamesAsArray()[0];
  }

  public containsField(searchFieldName: string) {
    return this.getFieldNameIndex(searchFieldName) !== -1;
  }

  public containsBaseName(baseName: string) {
    return this.getFieldNameIndex(baseName) === 0;
  }

  public removeCurrentBaseName() {
    let newField = this.field;

    if (this.hasField()) {
      const fieldNames = this.getFieldNamesAsArray();
      fieldNames.shift();
      newField = fieldNames.join(".");
    }

    return new OperationErrorItem(
      this.type,
      this.message,
      newField,
      this.action
    );
  }

  public replaceBaseName(baseName: string) {
    const fieldNames = this.getFieldNamesAsArray();
    fieldNames[0] = baseName;
    const newField = fieldNames.join(".");
    return new OperationErrorItem(
      this.type,
      this.message,
      newField,
      this.action
    );
  }
}

export const defaultOperationErrorItemType = "error";
export const defaultOperationErrorItemField = "error";
export const anErrorOccurredMessage = "An error occurred";

// TODO: Throw default error or make it where it is to be thrown, not here. Maybe prodie a function throw defaultError
export const anErrorOccurred = new OperationErrorItem(
  defaultOperationErrorItemType,
  anErrorOccurredMessage,
  defaultOperationErrorItemField
);

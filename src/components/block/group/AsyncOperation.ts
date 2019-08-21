import { AnyFunctionAsync } from "../../../utils/types";

export default class AsyncOperation<ResourceType> {
  public error?: Error;
  public loading?: boolean;
  public promise?: Promise<ResourceType>;
  public data?: ResourceType;
  public fetchFunction?: AnyFunctionAsync;
}

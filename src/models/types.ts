export interface IResourceWithId {
  customId: string;
}

export interface IPaginatedResult {
  page: number;
  pageSize: number;
  count: number;
}

export interface IPaginatedResultWithData<T = any> extends IPaginatedResult {
  data: T;
}

export interface IEndpointQueryPaginationOptions {
  page?: number;
  pageSize?: number;
}

interface MetaData {
  pagination?: Pagination;
}

interface Pagination {
  limit: number;
  total?: number;
  page: number;
  maxPage?: number;
}

export interface ResponseData<T> {
  data: T;
  meta?: MetaData;
}

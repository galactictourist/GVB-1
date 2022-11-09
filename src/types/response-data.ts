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

export function formatResponse<T>(data: T, meta?: MetaData): ResponseData<T> {
  return {
    data,
    meta,
  };
}

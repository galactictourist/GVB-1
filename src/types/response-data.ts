// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface MetaData {}

export interface ResponseData<T> {
  data: T;
  meta?: MetaData;
}

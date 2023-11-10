export interface ISWRCustomConfig<T> {
  // eslint-disable-next-line no-unused-vars
  onSuccess(data: T, key: string, config: any): void;
}

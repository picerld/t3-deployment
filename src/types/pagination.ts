export interface PaginationMeta {
  currentPage: number;
  lastPage: number;
  perPage: number;
  totalItems: number;
}

export interface PaginationResult<T> {
  data: T[];
  meta: PaginationMeta;
}

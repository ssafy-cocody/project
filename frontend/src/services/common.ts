interface ISort {
  unsorted: boolean;
  sorted: boolean;
  empty: boolean;
}

interface IPageable {
  unpaged: boolean;
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  offset: number;
  sort: ISort;
}

export type { IPageable, ISort };

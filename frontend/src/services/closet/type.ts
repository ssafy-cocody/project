import { IClothes } from '@/types/clothes';

interface IFetchGetClosetRequest {
  page: number;
  size: number;
  sort?: string;
  category?: string;
}

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

interface IFetchGetClosetResponse {
  numberOfElements: number;
  size: number;
  content: IClothes[];
  number: number;
  sort: ISort;
  first: boolean;
  last: boolean;
  empty: boolean;
  pageable: IPageable;
}

export type { IFetchGetClosetRequest, IFetchGetClosetResponse };

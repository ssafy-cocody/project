import { IPageable, ISort } from '@/services/common';
import { ICody, INewCody } from '@/types/cody';

interface IFetchGetCodyRequest {
  page?: number;
  size?: number;
}

interface IFetchGetCodyResponse {
  pageable: IPageable;
  numberOfElements: number;
  size: number;
  content: ICody[];
  number: number;
  sort: ISort;
  first: boolean;
  last: boolean;
  empty: boolean;
}

interface IFetchPostCodyRequest {
  clothesRequest: INewCody;
  name: string;
}

export type { IFetchGetCodyRequest, IFetchGetCodyResponse, IFetchPostCodyRequest };

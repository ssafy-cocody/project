import { IPageable, ISort } from '@/services/common';
import { ICody } from '@/types/cody';

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

interface IFetchPostOOTDCodyRequest {
  date: string;
  codyId: number;
}

export type { IFetchGetCodyRequest, IFetchGetCodyResponse, IFetchPostOOTDCodyRequest };

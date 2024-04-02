import { IPageable, ISort } from '@/services/common';
import { ClothesCategory, IClothes } from '@/types/clothes';

interface IFetchGetClosetRequest {
  page: number;
  size: number;
  category?: keyof typeof ClothesCategory;
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

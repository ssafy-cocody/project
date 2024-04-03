import { IFetchGetCodyResponse } from '@/services/cody/type';

type IFetchGetMyCodyResponse = IFetchGetCodyResponse;

interface IFetchGetCodyRecommendItemResponse {
  codyId: number;
  image: string;
  recommendClothesImage: string;
  link: string;
  recommendId: number;
}

export type { IFetchGetCodyRecommendItemResponse, IFetchGetMyCodyResponse };

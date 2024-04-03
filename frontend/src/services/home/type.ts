import { IFetchPostClothesRequest } from '@/services/clothes/type';
import { IFetchGetCodyResponse } from '@/services/cody/type';

type IFetchGetMyCodyResponse = IFetchGetCodyResponse;

interface IFetchGetCodyRecommendItemResponse {
  codyId: number;
  image: string;
  recommendClothesImage: string;
  link: string;
  recommendId: number;
}

interface IFetchPostOOTDCodyRequest {
  date: string;
  codyId: number;
}

interface IFetchCreateCodyRequest {
  codyId: number;
  name: string;
}

export type {
  IFetchCreateCodyRequest,
  IFetchGetCodyRecommendItemResponse,
  IFetchGetMyCodyResponse,
  IFetchPostClothesRequest,
  IFetchPostOOTDCodyRequest,
};

import { IFetchGetCodyResponse } from '@/services/cody/type';

type IFetchGetMyCodyResponse = IFetchGetCodyResponse;

interface IFetchPostOOTDCodyRequest {
  date: string;
  codyId: number;
}

interface IFetchCreateCodyRequest {
  codyId: number;
  name: string;
}

export type { IFetchCreateCodyRequest, IFetchGetMyCodyResponse, IFetchPostOOTDCodyRequest };

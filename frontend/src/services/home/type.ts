import { IFetchGetCodyResponse } from '@/services/cody/type';

type IFetchGetMyCodyResponse = IFetchGetCodyResponse;

interface IFetchPostOOTDCodyRequest {
  date: string;
  codyId: number;
}

export type { IFetchGetMyCodyResponse, IFetchPostOOTDCodyRequest };

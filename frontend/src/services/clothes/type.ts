import { IClothes } from '@/types/clothes';

interface IFetchPostClothesImageRequest {
  formData: FormData;
}

interface IFetchPostClothesImageResponse {
  uuid: string;
}

interface IFetchGetClothesInfoRequest {
  uuid: string;
}

type IFetchGetClothesInfoResponse = IClothes[];

export type {
  IFetchGetClothesInfoRequest,
  IFetchGetClothesInfoResponse,
  IFetchPostClothesImageRequest,
  IFetchPostClothesImageResponse,
};

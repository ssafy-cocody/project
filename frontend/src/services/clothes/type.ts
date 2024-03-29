import { IClothes, INewClothes } from '@/types/clothes';

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

interface IFetchPostSaveClothesRequest {
  clothes: INewClothes;
  uuid: string;
}

export type {
  IFetchGetClothesInfoRequest,
  IFetchGetClothesInfoResponse,
  IFetchPostClothesImageRequest,
  IFetchPostClothesImageResponse,
  IFetchPostSaveClothesRequest,
};

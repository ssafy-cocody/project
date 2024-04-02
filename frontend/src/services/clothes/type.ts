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

interface IFetchPostSaveClothesRequest {
  clothes: FormData; // FIXME FormData에 INewClothes 타입 정의
  uuid: string;
}

interface IFetchPostClothesRequest {
  clothesId: number;
}

export type {
  IFetchGetClothesInfoRequest,
  IFetchGetClothesInfoResponse,
  IFetchPostClothesImageRequest,
  IFetchPostClothesImageResponse,
  IFetchPostClothesRequest,
  IFetchPostSaveClothesRequest,
};

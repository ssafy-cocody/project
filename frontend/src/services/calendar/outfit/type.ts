import { IClothes } from '@/types/clothes';

type IFetchGetOotdImageResponse = Record<string, IClothes[]>;

interface IFetchGetOotdImageRequest {
  formData: FormData;
}

interface IFetchPostOotdImageRequest {
  formData: FormData; // ootdImage
  clothesRequest: {
    topId: number;
    bottomId: number;
    outerId: number;
    shoesId: number;
    onepieceId: number;
  };
  date: string; // 'yyyy-MM-dd';
}
interface IFetchPostOotdImageResponse {}

export type {
  IFetchGetOotdImageRequest,
  IFetchGetOotdImageResponse,
  IFetchPostOotdImageRequest,
  IFetchPostOotdImageResponse,
};

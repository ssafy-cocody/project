import { IClothes } from '@/types/clothes';

/** 
type TSimilarClothes = {
  clothesId: number;
  imageUrl: string;
};
*/
type IFetchGetOotdImageResponse = Record<string, IClothes[]>;
/** 
{
  // TODO TOP, BOTTOM, OUTER, SHOES 로 변경
  topList: TSimilarClothes[];
  bottomList: TSimilarClothes[];
  outerList: TSimilarClothes[];
  shoesList: TSimilarClothes[];
}
*/

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

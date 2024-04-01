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

export type { IFetchGetOotdImageRequest, IFetchGetOotdImageResponse };

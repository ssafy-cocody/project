import { ICalendar } from '@/containers/calendar/Calendar/type';
import { IClothes } from '@/types/clothes';

interface IFetchGetCalendarRequest {
  year: string;
  month: string;
}

type IFetchGetCalendarResponse = ICalendar[];

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

export type {
  IFetchGetCalendarRequest,
  IFetchGetCalendarResponse,
  IFetchGetOotdImageRequest,
  IFetchGetOotdImageResponse,
};

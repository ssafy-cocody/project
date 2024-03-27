enum Step {
  SEARCH_WITH_CAMERA,
  SEARCH_WITH_CAMERA_BASIC_FORM,
  SEARCH_WITH_CAMERA_ADDITIONAL_FORM,
  SEARCH_WITH_CODE,
  SEARCH_WITH_CODE_BASIC_FORM,
  SEARCH_WITH_CODE_ADDITIONAL_FORM,
  SELF_BASIC_FORM,
  SELF_ADDITIONAL_FORM,
}

const DONE = '';

type 전체 = '전체';
type 상의 = '상의';
type 하의 = '하의';
type 원피스 = '원피스';
type 아우터 = '아우터';
type 신발 = '신발';

type TCategory = {
  [index: string]: string;
  ALL: 전체;
  TOP: 상의;
  BOTTOM: 하의;
  ONEPIECE: 원피스;
  OUTER: 아우터;
  SHOES: 신발;
};

const Category: TCategory = {
  ALL: '전체',
  TOP: '상의',
  BOTTOM: '하의',
  ONEPIECE: '원피스',
  OUTER: '아우터',
  SHOES: '신발',
} as const;

interface IClothes {
  clothesId: number;
  category: string;
  name?: string;
  color?: string;
  brand?: string;
  productNo?: string;
  price?: number;
  link?: string;
  clothesImage?: string;
}

export { Category, DONE, Step };
export type { IClothes, TCategory };

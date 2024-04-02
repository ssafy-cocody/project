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

const Color = {
  WHITE: '#FFFFFF',
  BLACK: '#0E0E0E',
  SKY_BLUE: '#00C3EB',
  BLUE: '#2508FF',
  NAVY: '#001E66',
  IVORY: '#FEFFED',
  BEIGE: '#F1C276',
  DARK_GARY: '#52565B',
  DENIM: '#1B417E',
  LIGHT_PINK: '#FF9DB5',
  BROWN: '#7F290C',
  GREEN: '#00B000',
  LIGHT_GRAY: '#D9D9D7',
  GRAY: '#9C9C9B',
  KHAKI: '#5B5A35',
  RED: '#FF0000',
  MINT: '#00C4AB',
  LIGHT_YELLOW: '#FFE16B',
  PINK: '#FF00A1',
  SAND: '#CEB390',
  LAVENDER: '#B077CF',
  YELLOW: '#FEEA00',
  LIGHT_GREEN: '#75C900',
  PALE_PINK: '#E8A399',
  ORANGE: '#FF2800',
  LIGHT_BLUE: '#B7CDDF', // 연청
  OLIVE_GREEN: '#77872E',
  PURPLE: '#570070',
  DARK_GREEN: '#03431D',
  DARK_BLUE: '#1C2337', // 흑청
  CAMEL: '#E49700',
  BURGUNDY: '#83182D',
  KHAKI_BEIGE: '#AA7200',
  MEDIUM_BLUE: '#92A5C0', // 중청
  DEEP_RED: '#AD0A32',
  REAL_BLUE: '#222B40', // 진청
  SILVER: '#AEAEAD',
  ROSE_GOLD: '#C84A36',
  GOLD: '#B9B018',
} as const;

const ClothesCategory = {
  TOP: 'TOP',
  BOTTOM: 'BOTTOM',
  ONEPIECE: 'ONEPIECE',
  OUTER: 'OUTER',
  SHOES: 'SHOES',
} as const;

const CLOTHES_TAB = {
  ...ClothesCategory,
  ALL: 'ALL',
} as const;

const ClosetCategory = {
  ALL: '전체',
  TOP: '상의',
  BOTTOM: '하의',
  ONEPIECE: '원피스',
  OUTER: '아우터',
  SHOES: '신발',
} as const;

interface IClothes {
  clothesId: number;
  category?: keyof typeof ClothesCategory;
  name?: string;
  color?: keyof typeof Color;
  brand?: string;
  productNo?: string;
  price?: number;
  link?: string;
  image?: string;
}

type ISelectedClothes = {
  [index in Partial<keyof typeof ClothesCategory>]?: IClothes | undefined;
};

// 옷 등록 인풋 타입
type INewClothes = {
  uuid?: string;
  image?: string;
} & Pick<IClothes, 'category' | 'name' | 'color' | 'brand' | 'productNo' | 'price' | 'link'>;

export { ClosetCategory, CLOTHES_TAB, ClothesCategory, Color, DONE, Step };
export type { IClothes, INewClothes, ISelectedClothes };

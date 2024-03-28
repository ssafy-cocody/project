import { Category, IClothes } from '@/types/clothes';

type ISelectedClothes = {
  [index: string]: IClothes | undefined;
  [Category.TOP]?: IClothes;
  [Category.OUTER]?: IClothes;
  [Category.BOTTOM]?: IClothes;
  [Category.SHOES]?: IClothes;
};

export type { ISelectedClothes };

interface IClothes {
  image: string;
  id: number;
}

type TCategory = number;
type RClothesByCategory = Record<string, IClothes[]>;

const Category = {
  TOP: 0,
  BOTTOM: 1,
  SHOES: 2,
} as const;

const CategoryKo: Record<TCategory, string> = {
  [Category.TOP]: '상의',
  [Category.BOTTOM]: '하의',
  [Category.SHOES]: '신발',
};

export { Category, CategoryKo };
export type { IClothes, RClothesByCategory, TCategory };

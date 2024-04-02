const NewCodyKey = {
  TOP: 'topId',
  BOTTOM: 'bottomId',
  OUTER: 'outerId',
  SHOES: 'shoesId',
  ONEPIECE: 'onepieceId',
} as const;

interface INewCody {
  topId?: number;
  bottomId?: number;
  outerId?: number;
  shoesId?: number;
  onepieceId?: number;
}

interface ICody {
  myCodyId: number;
  codiId: number;
  name: string;
  image: string;
}

export type { ICody, INewCody };
export { NewCodyKey };

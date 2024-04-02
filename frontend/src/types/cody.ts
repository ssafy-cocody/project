const NewCodyKey = {
  TOP: 'top',
  BOTTOM: 'bottom',
  OUTER: 'outer',
  SHOES: 'shoes',
  ONEPIECE: 'onepiece',
} as const;

interface INewCody {
  top?: number;
  bottom?: number;
  outer?: number;
  shoes?: number;
  onepiece?: number;
}

interface ICody {
  myCodyId: number;
  codiId: number;
  name: string;
  image: string;
}

export type { ICody, INewCody };
export { NewCodyKey };

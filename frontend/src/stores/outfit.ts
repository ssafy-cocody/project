import { atom } from 'jotai';

interface IOutfit {
  year: number;
  month: number;
  date: number;
  ootdImage: File;
}

// TODO: 더 좋은 방법이 없을까?
// 캘린더에 올릴 착샷 데이터 관리
const outfitAtom = atom<IOutfit | undefined>(undefined);

export { outfitAtom };

import { useState } from 'react';

import { CheckIcon } from '@/../public/svgs';
import Button from '@/components/Button';
import style from '@/containers/clothes/SearchResult/SearchResult.module.scss';
import { IClothes } from '@/types/clothes';

interface SearchResultProps {
  onSelect: (clothes: IClothes) => void;
  onClickSelfBasicForm: () => void;
  clothesList?: IClothes[];
}

const SearchResult = ({ onSelect, onClickSelfBasicForm, clothesList }: SearchResultProps) => {
  const [selected, setSelected] = useState<IClothes>();

  return (
    <>
      <div className={style['search-result']}>
        {clothesList?.length &&
          clothesList.map((clothes) => {
            const { image, name, brand } = clothes;
            const clothesId = clothes.clothesId!;
            const isSelected = clothesId.toString() === selected?.clothesId!.toString();

            return (
              <div key={clothesId} className={`${style['search-item']} ${isSelected && style.selected}`}>
                {isSelected && (
                  <div className={style.checked}>
                    <CheckIcon />
                  </div>
                )}
                <label htmlFor={clothesId.toString()}>
                  <div className={style.info}>
                    <p className={style.title}>{name}</p>
                    <p className={style.brand}>{brand}</p>
                  </div>
                  <div className={style.preview}>
                    <img src={image} alt={name} />
                  </div>
                </label>
                <input
                  radioGroup="clothes"
                  type="radio"
                  name="clothes"
                  id={clothesId.toString()}
                  value={clothesId.toString()}
                  onChange={() => setSelected(clothes)}
                />
              </div>
            );
          })}
      </div>
      <div className={style['modal-bottom']}>
        <Button
          type="button"
          onClick={() => {
            onClickSelfBasicForm();
          }}
        >
          직접 등록하기
        </Button>
        <Button
          type="button"
          disabled={!selected}
          onClick={() => {
            if (!selected) return;
            onSelect(selected);
          }}
        >
          선택
        </Button>
      </div>
    </>
  );
};

export default SearchResult;

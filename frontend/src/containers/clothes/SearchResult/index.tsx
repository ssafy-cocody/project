import { useState } from 'react';

import { CheckIcon } from '@/../public/svgs';
import Button from '@/components/Button';
import style from '@/containers/clothes/SearchResult/SearchResult.module.scss';

const MOCK_CLOTHES = [
  {
    id: 1,
    title: '깔끔한 회색 후드티',
    brand: '스투시',
    src: 'https://image.msscdn.net/images/goods_img/20240313/3946884/3946884_17103131802515_320.jpg',
  },
  {
    id: 2,
    title: '깔끔한 회색 후드티',
    brand: '스투시',
    src: 'https://image.msscdn.net/images/goods_img/20240313/3946884/3946884_17103131802515_320.jpg',
  },
  {
    id: 3,
    title: '깔끔한 회색 후드티',
    brand: '스투시',
    src: 'https://image.msscdn.net/images/goods_img/20240313/3946884/3946884_17103131802515_320.jpg',
  },
];

const SearchResult = ({ onClick }: { onClick: () => void }) => {
  const [selected, setSelected] = useState('');

  return (
    <>
      <div className={style['search-result']}>
        {MOCK_CLOTHES.map(({ id, title, brand, src }) => {
          const isSelected = selected === id.toString();

          return (
            <div key={id} className={`${style['search-item']} ${isSelected && style.selected}`}>
              {isSelected && (
                <div className={style.checked}>
                  <CheckIcon />
                </div>
              )}
              <label htmlFor={id.toString()}>
                <div className={style.info}>
                  <p className={style.title}>{title}</p>
                  <p className={style.brand}>{brand}</p>
                </div>
                <div className={style.preview}>
                  <img src={src} alt={title} />
                </div>
              </label>
              <input
                radioGroup="clothes"
                type="radio"
                name="clothes"
                id={id.toString()}
                value={id.toString()}
                onChange={(e) => setSelected(e.target.value)}
              />
            </div>
          );
        })}
      </div>
      <div className={style['modal-bottom']}>
        <Button type="button" disabled={!selected} onClick={onClick}>
          선택
        </Button>
      </div>
    </>
  );
};

export default SearchResult;

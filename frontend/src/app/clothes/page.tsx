'use clinet';

import style from '@/containers/clothes/Clothes.module.scss';
import Header from '@/components/Header';
import Background from '@/components/background';
import Button from '@/components/Button';
import ImageInput from '@/components/ImageInput';

const Page = () => {
  return (
    <>
      <Header previousLink="/closet" title="옷 등록" />

      <form className={style.form}>
        <ImageInput name="clotehs" id="clothes" />
        <div className={style['tip-wrapper']}>
          <p className={style['tip']}>💡 TIP. 옷을 가지런히 찍을수록 정확도가 높아집니다.</p>
        </div>
        <Button type="submit" disabled>
          검색
        </Button>
      </form>

      <Background $backgroundColor="yellow" />
    </>
  );
};

export default Page;

import Image from 'next/image';

import style from '@/containers/signin/Signin.module.scss';

const KAKAO_SIGNIN_URI = process.env.NEXT_PUBLIC_KAKAO_SIGNIN_URL;

const slideImages = [
  '/images/test1.jpg',
  '/images/test2.jpg',
  '/images/test3.jpg',
  '/images/test4.jpg',
  '/images/test5.jpg',
];

const slides: string[] = Array.from({ length: 2 }, () => slideImages).flat();

const Page = () => {
  return (
    <main className={style.container}>
      <div className={style['title-container']}>
        <h1 className={style.title}>나만의 코디네이터</h1>
        <div className="logo">
          <Image src="/images/logo.png" width={181} height={56} alt="co.cody" />
        </div>
        <p className={style.desc}>우리 함께 코디해요</p>
      </div>

      <div className={style['clothes-slider']}>
        <div className={style.row}>
          {slides.map((src, idx) => (
            // eslint-disable-next-line react/no-array-index-key
            <div key={`row1-${idx}-${src}`} className={style.item}>
              <Image fill src={src} alt="test" />
            </div>
          ))}
        </div>
        <div className={style.row}>
          {slides.reverse().map((src, idx) => (
            // eslint-disable-next-line react/no-array-index-key
            <div key={`row2-${idx}-${src}`} className={style.item}>
              <Image fill src={src} alt="test" />
            </div>
          ))}
        </div>
      </div>

      <div className={style['login-container']}>
        <a href={KAKAO_SIGNIN_URI}>
          <div className={`${style.kakao} ${style.button}`}>
            <span className={style.icon} />
            <span className={style.text}>카카오로 시작하기</span>
          </div>
        </a>
        {/* mvp 미포함 
        <div className={`${style.instagram} ${style.button}`}>
          <span className={style.icon} />
          <span className={style.text}>인스타로 시작하기</span>
        </div> */}
        <p className={style.desc}>자주 사용하는 아이디로 간편하게 가입하세요</p>
      </div>
    </main>
  );
};

export default Page;

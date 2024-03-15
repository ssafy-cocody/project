import Image from 'next/image';
import style from '@/app/signin/styles.module.scss';

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
          <div className={style.item}>
            <Image fill src="/images/test1.jpg" alt="test" />
          </div>
          <div className={style.item}>
            <Image fill src="/images/test2.jpg" alt="test" />
          </div>
          <div className={style.item}>
            <Image fill src="/images/test3.jpg" alt="test" />
          </div>
          <div className={style.item}>
            <Image fill src="/images/test4.jpg" alt="test" />
          </div>
          <div className={style.item}>
            <Image fill src="/images/test5.jpg" alt="test" />
          </div>
          <div className={style.item}>
            <Image fill src="/images/test1.jpg" alt="test" />
          </div>
        </div>
        <div className={style.row}>
          <div className={style.item}>
            <Image fill src="/images/test1.jpg" alt="test" />
          </div>
          <div className={style.item}>
            <Image fill src="/images/test2.jpg" alt="test" />
          </div>
          <div className={style.item}>
            <Image fill src="/images/test3.jpg" alt="test" />
          </div>
          <div className={style.item}>
            <Image fill src="/images/test4.jpg" alt="test" />
          </div>
          <div className={style.item}>
            <Image fill src="/images/test5.jpg" alt="test" />
          </div>
          <div className={style.item}>
            <Image fill src="/images/test1.jpg" alt="test" />
          </div>
        </div>
      </div>

      <div className={style['login-container']}>
        <div className={`${style.kakao} ${style.button}`}>
          <span className={style.icon} />
          <span className={style.text}>카카오로 시작하기</span>
        </div>
        <div className={`${style.instagram} ${style.button}`}>
          <span className={style.icon} />
          <span className={style.text}>인스타로 시작하기</span>
        </div>
        <p className={style.desc}>자주 사용하는 아이디로 간편하게 가입하세요</p>
      </div>
    </main>
  );
};

export default Page;

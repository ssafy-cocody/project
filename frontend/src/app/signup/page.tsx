import Image from 'next/image';
import styles from '@/app/signup/styles.module.scss';

const Page = () => {
  return (
    <main className={styles.container}>
      <div className={styles.logo}>
        <Image src="/images/logo.png" width={129} height={40} alt="co.cody" />
      </div>

      <div className={styles['form-container']}>
        <p className={styles.quiz}>성별과 나이를 알려주세요.</p>
        <p className={styles.desc}>
          알려주신 정보를 기반으로 코디를 추천해드립니다. <br />
          다른 목적으로 사용되거나 제3자에게 제공되지 않습니다.
        </p>

        <form className={styles['userinfo-form']}>
          <div className={styles['gender-container']}>
            <div className={styles['input-container']}>
              <div className={styles.icon}>
                <Image src="/images/signup/male-select.png" alt="male" fill />
              </div>
              <label htmlFor="male" className={styles.selected}>
                <input type="radio" name="gender" id="male" />
                남자
              </label>
            </div>

            <div className={styles['input-container']}>
              <div className={styles.icon}>
                <Image src="/images/signup/female.png" alt="male" fill />
              </div>
              <label htmlFor="female">
                <input type="radio" name="gender" id="female" />
                여자
              </label>
            </div>
          </div>

          <div className={styles['input-container']}>
            <div className={styles.input}>
              <label htmlFor="age">나이(출생 연도)</label>
              <input type="text" name="age" id="age" />
            </div>
            <div className={styles.input}>
              <label htmlFor="nickname">닉네임</label>
              <input type="text" name="nickname" id="nickname" />
              <p className={styles.desc}>영어, 한글, 숫자, 언더바(_)로 이뤄진 2~20</p>
            </div>
          </div>

          <button type="submit" disabled>
            완료
          </button>
        </form>
      </div>
    </main>
  );
};

export default Page;

'use client';

import Image from 'next/image';
import { FormEvent, useEffect, useState } from 'react';

import Button from '@/components/Button';
import TextInput from '@/components/TextInput';
import styles from '@/containers/signup/Signup.module.scss';
import { IUser } from '@/types/user';

const genderOptions = [
  {
    name: 'gender',
    value: 'MALE',
    text: '남자',
    img: '/images/signup/male.png',
    selectImg: '/images/signup/male-select.png',
  },
  {
    name: 'gender',
    value: 'FEMALE',
    text: '여자',
    img: '/images/signup/female.png',
    selectImg: '/images/signup/female-select.png',
  },
];

// TODO 올바른 연,월,일 입력
const birthRegexp = /^[1-9][0-9]{7}$/;
const nicknameRegexp = /[a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ_]{2,20}$/;

const Page = () => {
  const [isValid, setIsValid] = useState(false);
  const [user, setUser] = useState<IUser>({
    gender: 'MALE',
    birth: '',
    nickname: '',
  });
  const [errorMessages, setErrorMessages] = useState({
    birth: '',
    nickname: '',
  });

  const { gender, birth, nickname } = user;

  const handleChangeInput = ({ key, value }: { key: string; value: string | number }) => {
    setUser((prev) => ({ ...prev, [key]: value }));
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!birth || !nickname) return;

    const birthErrorMessage = birthRegexp.test(birth) ? '' : '8자리로 입력해주세요.';
    const nicknameErrorMessage = nicknameRegexp.test(nickname)
      ? ''
      : '영어, 한글, 숫자, 언더바(_)로 이뤄진 2~20 글자로 입력해주세요.';
    setErrorMessages({ birth: birthErrorMessage, nickname: nicknameErrorMessage });

    if (birthErrorMessage || nicknameErrorMessage) return;

    // TODO 회원가입
    console.log(user);
  };

  // form 유효성 검사
  useEffect(() => {
    if (!gender || Number(birth) <= 0 || !nickname) {
      if (!nickname) setErrorMessages((prev) => ({ ...prev, nickname: '' }));
      if (Number(birth) <= 0) setErrorMessages((prev) => ({ ...prev, age: '' }));
      setIsValid(false);
      return;
    }

    setIsValid(true);
  }, [gender, birth, nickname]);

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

        <form className={styles['userinfo-form']} onSubmit={handleSubmit}>
          <div className={styles['gender-container']}>
            {genderOptions.map(({ name, value, text, img, selectImg }) => {
              const isSelected = value === gender;
              const imgSrc = isSelected ? selectImg : img;
              return (
                <div key={value} className={styles['input-container']}>
                  <label htmlFor={value} className={`${isSelected ? styles.selected : ''}`}>
                    <div className={styles.icon}>
                      <Image src={imgSrc} alt={value} fill />
                    </div>
                    <span>{text}</span>
                  </label>
                  <input
                    type="radio"
                    name={name}
                    id={value}
                    value={value}
                    onChange={(e) => handleChangeInput({ key: name, value: e.target.value })}
                  />
                </div>
              );
            })}
          </div>

          <div className={styles['input-container']}>
            <TextInput
              label="나이"
              id="birth"
              name="birth"
              placeholder="19990203"
              value={birth}
              errorMessage={errorMessages.birth}
              onChange={(e) => {
                const { value } = e.target;
                // eslint-disable-next-line no-underscore-dangle
                const _age = Number(value);
                if (value.length === 0) {
                  handleChangeInput({ key: 'birth', value: '' });
                  return;
                }
                if (Number.isNaN(_age)) return;

                handleChangeInput({ key: 'birth', value: Number(value) });
              }}
            />
            <TextInput
              label="닉네임"
              id="nickname"
              name="nickname"
              placeholder="코코디"
              value={nickname}
              errorMessage={errorMessages.nickname}
              onChange={(e) => {
                handleChangeInput({ key: 'nickname', value: e.target.value });
              }}
            />
          </div>

          <Button type="submit" disabled={!isValid}>
            완료
          </Button>
        </form>
      </div>
    </main>
  );
};

export default Page;

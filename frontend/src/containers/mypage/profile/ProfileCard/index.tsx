'use client';

import Image from 'next/image';
import { ChangeEvent, useState } from 'react';

import { PencilIcon } from '@/../public/svgs';
import TextInputWithUnderLine from '@/components/TextInputWithUnderLine';
import styles from '@/containers/mypage/profile/ProfileCard/ProfileCard.module.scss';
import { TGender } from '@/types/user';

interface ProfileCardProps {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  nickname: string;
  birth: string;
  gender: TGender;
  profile: string;
}

const ProfileCard = ({ onChange: handleChange, ...defaultValue }: ProfileCardProps) => {
  const [imgUrl, setImgUrl] = useState('/images/test3.jpg');

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      URL.revokeObjectURL(imgUrl);
      setImgUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles['profile-image-block']}>
        {imgUrl && (
          <div className={styles.profile}>
            <Image src={imgUrl} alt="" fill />
          </div>
        )}
        <label htmlFor="profile" className={styles['upload-button']}>
          <PencilIcon />
          <input type="file" name="profile" accept="image/*" id="profile" onChange={handleProfileChange} />
        </label>
      </div>
      <div className={styles['user-info']}>
        <TextInputWithUnderLine
          name="nickname"
          className={styles.nickname}
          label="닉네임"
          onChange={handleChange}
          defaultValue={defaultValue.nickname}
        />
        <TextInputWithUnderLine
          name="year"
          label="태어난 연도"
          readOnly
          onChange={handleChange}
          defaultValue={defaultValue.birth}
        />
        <TextInputWithUnderLine
          name="gender"
          label="성별"
          readOnly
          onChange={handleChange}
          defaultValue={defaultValue.gender}
        />
      </div>
    </div>
  );
};
export default ProfileCard;

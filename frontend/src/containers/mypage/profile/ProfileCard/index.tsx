'use client';

import Image from 'next/image';
import { useState } from 'react';

import { PencilIcon } from '@/../public/svgs';
import TextInputWithUnderLine from '@/components/TextInputWithUnderLine';
import styles from '@/containers/mypage/profile/ProfileCard/ProfileCard.module.scss';

const ProfileCard = () => {
  const [imgUrl, setImgUrl] = useState('/images/test3.jpg');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          <input type="file" name="profile" accept="image/*" id="profile" onChange={handleChange} />
        </label>
      </div>
      <div className={styles['user-info']}>
        <TextInputWithUnderLine className={styles.nickname} label="닉네임" />
        <TextInputWithUnderLine label="태어난 연도" readOnly />
        <TextInputWithUnderLine label="성별" readOnly />
      </div>
    </div>
  );
};
export default ProfileCard;

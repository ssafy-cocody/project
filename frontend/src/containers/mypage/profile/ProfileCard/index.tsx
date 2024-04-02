'use client';

import { ChangeEvent } from 'react';

import { PencilIcon } from '@/../public/svgs';
import TextInputWithUnderLine from '@/components/TextInputWithUnderLine';
import styles from '@/containers/mypage/profile/ProfileCard/ProfileCard.module.scss';
import { TGender } from '@/types/user';

interface ProfileCardProps {
  nickname: string;
  birth: string;
  gender: TGender;
  profile: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onProfileChange: (file: File) => void;
}

const ProfileCard = ({ onChange: handleChange, onProfileChange, ...defaultValue }: ProfileCardProps) => {
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      onProfileChange(file);
      // URL.revokeObjectURL(imgUrl); TODO:
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles['profile-image-block']}>
        <div className={styles.profile}>{defaultValue.profile && <img src={defaultValue.profile} alt="profile" />}</div>
        <label htmlFor="profile" className={styles['upload-button']}>
          <PencilIcon />
          <input type="file" name="profile" accept="image/*" id="profile" onChange={handleProfileChange} />
        </label>
      </div>
      <div className={styles['user-info']}>
        <TextInputWithUnderLine
          name="nickname"
          className={styles['align-right']}
          label="닉네임"
          onChange={handleChange}
          defaultValue={defaultValue.nickname}
        />
        <TextInputWithUnderLine
          name="year"
          className={styles['align-right']}
          label="태어난 연도"
          readOnly
          onChange={handleChange}
          defaultValue={defaultValue.birth}
        />
        <TextInputWithUnderLine
          name="gender"
          className={styles['align-right']}
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

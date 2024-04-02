'use client';

import { useMutation } from '@tanstack/react-query';
import { ChangeEvent, useEffect, useState } from 'react';

import Background from '@/components/Background';
import Header from '@/components/Header';
import SaveButton from '@/components/SaveButton';
import ProfileCard from '@/containers/mypage/profile/ProfileCard';
import styles from '@/containers/mypage/profile/ProfileLayout.module.scss';
import useSession from '@/hooks/useSession';
import { fetchUpdateMember } from '@/services/signup';
import { TGender } from '@/types/user';

const Page = () => {
  const { session, getSession } = useSession();
  const [input, setInput] = useState({
    birth: '',
    gender: '',
    nickname: '',
    profile: '',
  });
  const [profileImage, setProfileImage] = useState<File>();

  useEffect(() => {
    if (session) {
      setInput({
        birth: session?.birth!,
        gender: session?.gender!,
        nickname: session?.nickname!,
        profile: session?.profile!,
      });
    }
  }, [session]);

  const updateUserMutation = useMutation({
    mutationFn: fetchUpdateMember,
    onSuccess: () => {
      window.alert('저장이 완료되었습니다.');
      getSession(); // 데이터 최신화
    },
  });

  const handleSubmit = () => {
    if (!profileImage || !input.birth || !input.nickname || !input.gender) return;
    if (updateUserMutation.isPending) return;

    const formData = new FormData();
    formData.append('birth', input?.birth);
    formData.append('gender', input?.gender);
    formData.append('nickname', input?.nickname);
    formData.append('profile', profileImage);

    updateUserMutation.mutate({ formData });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };
  const handleProfileChange = (file: File) => {
    setProfileImage(file);
    setInput((prev) => ({ ...prev, profile: URL.createObjectURL(file) }));
  };

  return (
    <>
      <Header previousLink="/mypage" title="내 정보 수정" RightComponent={<SaveButton onClick={handleSubmit} />} />
      <div className={styles.container}>
        <ProfileCard
          onChange={handleChange}
          onProfileChange={handleProfileChange}
          nickname={input.nickname}
          birth={input.birth}
          gender={input.gender as TGender}
          profile={input.profile}
        />
      </div>
      <Background $backgroundColor="skyBlue" />
    </>
  );
};
export default Page;

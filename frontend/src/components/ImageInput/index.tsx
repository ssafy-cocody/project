'use client';

import { useState } from 'react';

import { CameraIcon } from '@/../public/svgs/';
import style from '@/components/ImageInput/ImageInput.module.scss';

interface ImageInputProps {
  name?: string;
  id?: string;
  onChange?: (file: File) => void;
}

const ImageInput = ({ name, id, onChange }: ImageInputProps) => {
  const [imgUrl, setImgUrl] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      URL.revokeObjectURL(imgUrl);
      setImgUrl(URL.createObjectURL(file));

      if (onChange) {
        onChange(file);
      }
    }
  };

  return (
    <div className={style['image-upload-button']}>
      <label htmlFor={id} className={style['image-upload']}>
        {imgUrl && (
          <div className={style.preview}>
            <img src={imgUrl} alt="" />
          </div>
        )}
        {!imgUrl && (
          <div className={style.button}>
            <CameraIcon width={40} />
            등록할 이미지를 선택 해주세요.
          </div>
        )}
      </label>
      <input type="file" name={name} accept="image/*" id={id} onChange={handleChange} />
    </div>
  );
};

export default ImageInput;

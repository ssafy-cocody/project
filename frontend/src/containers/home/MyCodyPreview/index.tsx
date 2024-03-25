import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import Button from '@/components/Button';
import styles from '@/containers/home/MyCodyPreview/Preview.module.scss';

const MyCodyPreview = () => {
  const [codies] = useState([
    { id: 1, image: '/images/test1.jpg' },
    { id: 2, image: '/images/test2.jpg' },
    { id: 3, image: '/images/test3.jpg' },
    { id: 4, image: '/images/test4.jpg' },
    { id: 5, image: '/images/test5.jpg' },
  ]);

  return (
    <div className={styles.container}>
      <div className={styles.title}>내가 만든 코디</div>
      <div className={styles.showcase}>
        <div className={styles.codies}>
          {
            // TODO: key props warning 없애기
            codies.map(({ id, image }, index) => {
              return (
                <div key={id} className={styles['cody-image']}>
                  <Image src={image} alt={`나의 코디 ${index}`} fill />
                </div>
              );
            })
          }
          {codies.length < 8 ? (
            Array.from({ length: 8 - codies.length }, (i: number) => i).map((value) => {
              return <div key={value} className={styles['cody-image']} />;
            })
          ) : (
            // eslint-disable-next-line react/jsx-no-useless-fragment
            <></>
          )}
        </div>
        <div className={`${styles.support} `} />
        <div className={`${styles.support} `} />
      </div>
      <div className={styles['show-all-button']}>
        <Button>
          <Link href="/cody">
            <span className={styles['button-text']}>전체보기</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default MyCodyPreview;

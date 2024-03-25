import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import Button from '@/components/Button';
import styles from '@/containers/home/MyCodyPreview/Preview.module.scss';

const MyCodyPreview = () => {
  const [codies] = useState([
    '/images/test1.jpg',
    '/images/test2.jpg',
    '/images/test3.jpg',
    '/images/test4.jpg',
    '/images/test5.jpg',
  ]);

  return (
    <div className={styles.container}>
      <div className={styles.title}>내가 만든 코디</div>
      <div className={styles.showcase}>
        <div className={styles.codies}>
          {codies.map((url, index) => {
            return (
              <div key={url} className={styles['cody-image']}>
                <Image src={url} alt={`나의 코디 ${index}`} fill />
              </div>
            );
          })}
          {codies.length < 8 ? (
            Array.from({ length: 8 - codies.length }, () => 0).map((value) => {
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

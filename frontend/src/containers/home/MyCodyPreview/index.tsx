import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';

import Button from '@/components/Button';
import styles from '@/containers/home/MyCodyPreview/Preview.module.scss';
import { fetchGetMyCody } from '@/services/home';

const CODY_COUNT = 6;

const MY_CODY_QUERY_KEY = ['homeMyCodyPreview'];

const MyCodyPreview = () => {
  const { data, isLoading } = useQuery({ queryKey: MY_CODY_QUERY_KEY, queryFn: () => fetchGetMyCody() });

  const codies = data?.content;
  const loadingArray = Array.from({ length: CODY_COUNT }, (_, idx) => idx);

  return (
    <div className={styles.container}>
      <div className={styles.title}>내가 만든 코디</div>
      <div className={styles.showcase}>
        <div className={styles.codies}>
          {/** 로딩 중일때 빈 박스 */}
          {isLoading && loadingArray.map((idx) => <div key={idx} className={styles['cody-image']} />)}

          {codies &&
            codies.length > 0 &&
            codies.map(({ codiId, image }, index) => {
              return (
                <div key={codiId} className={styles['cody-image']}>
                  <Image src={image} alt={`나의 코디 ${index}`} fill />
                </div>
              );
            })}
          {codies && codies.length < CODY_COUNT ? (
            Array.from({ length: CODY_COUNT - codies.length }, (_, i: number) => i).map((value) => {
              return <div key={-value} className={styles['cody-image']} />;
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

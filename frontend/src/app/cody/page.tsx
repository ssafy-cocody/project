'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';

import { PlusIcon } from '@/../public/svgs';
import Background from '@/components/Background';
import Button from '@/components/Button';
import Header from '@/components/Header';
import styles from '@/containers/cody/Cody.module.scss';
import { useInfinityScroll } from '@/hooks/useInfinityScroll';
import useModal from '@/hooks/useModal';
import { fetchGetCody } from '@/services/cody';
import { ICody } from '@/types/cody';

const PAGE_SIZE = 7;

const Page = () => {
  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['CodyListQueryKey'],
    queryFn: ({ pageParam }) => fetchGetCody({ page: pageParam as number, size: PAGE_SIZE }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.last ? undefined : lastPage.pageable.pageNumber + 1),
  });
  const { Modal, openModal } = useModal();

  const refLast = useInfinityScroll({ hasNextPage, fetchNextPage }).ref;

  return (
    <>
      <Background $backgroundColor="purple" />
      <Header title="나의 코디" hasPreviousLink />
      <main className={styles['main-container']}>
        <div className={styles['cody-container']}>
          <Link href="/cody/new" className={styles['new-cody']}>
            <PlusIcon stroke="black" />
          </Link>
          <div className={styles['cody-name']}>새 코디 등록</div>
        </div>
        {data?.pages.map(({ content }: { content: ICody[] }) => {
          return content.map(({ codiId, name, image }) => {
            return (
              <button type="button" onClick={openModal} key={codiId} className={styles['cody-container']}>
                <div className={styles['cody-image-container']}>
                  <Image src={image} alt={name} fill className={styles['cody-image']} />
                </div>
                <div className={styles['cody-name']}>{name}</div>
              </button>
            );
          });
        })}
        {hasNextPage && <div ref={refLast} className={styles['page-end']} />}
      </main>
      <div id="modal">
        <Modal>
          <div className={styles['modal-container']}>
            <div className={styles['selected-clothes']}>
              <Image src="/images/test1.jpg" alt="옷" fill />
            </div>
            <div className={styles['modal-button']}>
              <Button>
                <span className={styles['button-text']}>내일의 OOTD로 등록</span>
              </Button>
              <Button variant="white">
                <span className={styles['button-text']}>코디 삭제</span>
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default Page;

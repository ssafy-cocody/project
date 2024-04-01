/* eslint-disable react/no-unused-prop-types */

'use client';

import { QueryKey, useMutation, useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import { LeftArrow, RightArrow } from '@/../public/svgs';
import Button from '@/components/Button';
import ImageInput from '@/components/ImageInput';
import styles from '@/containers/calendar/Calendar/Calendar.module.scss';
import { ICalendar } from '@/containers/calendar/Calendar/type';
import useModal from '@/hooks/useModal';
import { fetchGetCalendar } from '@/services/calendar';
import { fetchGetOotdImage } from '@/services/calendar/outfit';
import { paddingMonth } from '@/utils/date';
import { queryClient } from '@/utils/Provider';

export const OUTFIT_QUERY_KEY = ['outfit'];

const Calendar = () => {
  const router = useRouter();

  const [year] = useState<number>(new Date().getFullYear());
  const [month] = useState<number>(new Date().getMonth() + 1);
  const [calendar, setCalendar] = useState<ICalendar[][]>([]);
  const ootdImageRef = useRef<File>();
  const { Modal, openModal } = useModal();

  const ootdImageMutation = useMutation({
    mutationFn: fetchGetOotdImage,
    onSuccess: (result) => {
      queryClient.setQueryData(OUTFIT_QUERY_KEY, () => result);
      router.push('/calendar/outfit');
    },
  });

  // currentDate가 몇 주차인지 구하는 함수
  const getWeek = (currentDate: number, firstDay: number) => Math.ceil((currentDate + firstDay) / 7);

  // 현재 연도와 달의 day의 요일 구하는 함수
  const getDayOfWeek = useCallback(
    (day: number) => new Date(`${year}-${paddingMonth(month)}-${paddingMonth(day)}`).getDay(),
    [year, month],
  );

  const { data: ootds } = useQuery<ICalendar[], QueryKey>({
    queryKey: ['CalendarQueryKey'],
    queryFn: () => fetchGetCalendar({ year: year.toString(), month: paddingMonth(month) }),
  });

  useEffect(() => {
    if (year && month) {
      const dateOfLastDay = new Date(year, month, 0).getDate();
      const dayOfWeekOfDay1 = getDayOfWeek(1);
      const weeks = getWeek(dateOfLastDay, dayOfWeekOfDay1);
      const newCalendar = Array.from({ length: weeks }, (_, j) =>
        Array.from({ length: 7 }, (__, i) => {
          return { ootdId: -(j * 7 + i), day: 0, image: '' };
        }),
      );
      for (let i = 1; i <= dateOfLastDay; i++) {
        const ootdOfDay = ootds?.filter((item) => item.day === i) || [];
        if (ootdOfDay.length) {
          newCalendar[getWeek(i, dayOfWeekOfDay1) - 1][getDayOfWeek(i)] = ootdOfDay[0];
        } else {
          newCalendar[getWeek(i, dayOfWeekOfDay1) - 1][getDayOfWeek(i)] = {
            ootdId: i,
            day: i,
            image: '',
          };
        }
      }
      setCalendar(newCalendar);
    }
  }, [getDayOfWeek, month, year, ootds]);

  const handleImageChange = (file: File) => {
    ootdImageRef.current = file;
  };

  const handleSubmit = async () => {
    if (!ootdImageRef.current) return;
    if (ootdImageMutation.isPending) return;

    const formData = new FormData();
    formData.append('ootdImage', ootdImageRef.current);

    ootdImageMutation.mutate({ formData });
  };

  return (
    <div className={styles['main-container']}>
      <div className={styles.date}>
        <LeftArrow />
        {year.toString()}.{paddingMonth(month)}
        <RightArrow />
      </div>
      <div className={styles['calendar-container']}>
        <div className={styles['week-container']}>
          <div className={styles['day-of-week']}>SUN</div>
          <div className={styles['day-of-week']}>MON</div>
          <div className={styles['day-of-week']}>TUE</div>
          <div className={styles['day-of-week']}>WED</div>
          <div className={styles['day-of-week']}>THU</div>
          <div className={styles['day-of-week']}>FRI</div>
          <div className={styles['day-of-week']}>SAT</div>
        </div>
        <div className={styles['ootd-container']}>
          {calendar.map((week: ICalendar[], index) => {
            return (
              <div className={styles.week} key={week[index].ootdId}>
                {week.map(({ ootdId, day, image }: ICalendar) => {
                  return (
                    <button type="button" onClick={openModal} className={styles.ootd} key={ootdId}>
                      {!!day && (
                        <>
                          <div
                            // eslint-disable-next-line no-nested-ternary
                            className={`${styles.day} ${getDayOfWeek(day) === 6 ? styles.sat : getDayOfWeek(day) === 0 ? styles.sun : ''}`}
                          >
                            {day}
                          </div>
                          {image && (
                            <div className={styles['image-container']}>
                              <Image src={image} alt="ootd" fill className={styles.image} />
                            </div>
                          )}
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      <div id="modal">
        <Modal title="내 코디 올리기" subTitle="오늘 입은 옷을 업로드해보세요!">
          <ImageInput name="clotehs" id="clothes" onChange={handleImageChange} />
          <div className={styles['info-text']}>💡 옷이 잘 보이게 찍을수록 정확도가 높아집니다.</div>
          <div className={styles['button-container']}>
            <Button onClick={handleSubmit}>다음</Button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Calendar;

/* eslint-disable react/no-unused-prop-types */

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

import { LeftArrow, RightArrow } from '@/../public/svgs';
import Button from '@/components/Button';
import ImageInput from '@/components/ImageInput';
import styles from '@/containers/calendar/Calendar/Calendar.module.scss';
import useModal from '@/hooks/useModal';

interface ICalendar {
  date: number;
  dayOfWeek: number;
  image?: string;
}

const Calendar = () => {
  const [year, setYear] = useState<number>(0);
  const [month, setMonth] = useState<number>(0);
  const [ootds, setOOTD] = useState<ICalendar[][]>([]);
  const { Modal, openModal } = useModal();

  // currentDate가 몇 주차인지 구하는 함수
  const getWeek = (currentDate: number, firstDay: number) => Math.ceil((currentDate + firstDay) / 7);
  // 한자리 수 숫자인 달 앞에 0을 붙이는 함수
  const paddingMonth = (month_: Number) => month_.toString().padStart(2, '0');
  // 현재 연도와 달의 day의 요일 구하는 함수
  const getDayOfWeek = useCallback(
    (day: number) => new Date(`${year}-${paddingMonth(month)}-${paddingMonth(day)}`).getDay(),
    [year, month],
  );

  useEffect(() => {
    if (year && month) {
      const lastDay = new Date(year, month, 0).getDate();
      const dayOfWeekOfDay1 = getDayOfWeek(1);
      const week = getWeek(lastDay, dayOfWeekOfDay1);
      const ootd = Array.from({ length: week }, () =>
        Array.from({ length: 7 }, () => {
          return { date: 0, dayOfWeek: 0, image: '' };
        }),
      );
      for (let i = 1; i <= lastDay; i++) {
        ootd[getWeek(i, dayOfWeekOfDay1) - 1][getDayOfWeek(i)] = {
          date: i,
          dayOfWeek: getDayOfWeek(i),
          image: '/images/test1.jpg',
        };
      }
      setOOTD(ootd);
    }
  }, [getDayOfWeek, month, year]);

  useEffect(() => {
    const date = new Date();
    setYear(date.getFullYear());
    setMonth(date.getMonth() + 1);
  }, []);

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
          {ootds.map((week: ICalendar[], index) => {
            return (
              <div className={styles.week} key={week[index].dayOfWeek}>
                {week.map(({ date, dayOfWeek, image }: ICalendar) => {
                  return (
                    <button type="button" onClick={openModal} className={styles.ootd} key={`${date}${dayOfWeek}`}>
                      {!!date && (
                        <>
                          <div
                            // eslint-disable-next-line no-nested-ternary
                            className={`${styles.day} ${dayOfWeek === 6 ? styles.sat : dayOfWeek === 0 ? styles.sun : ''}`}
                          >
                            {date}
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
          <ImageInput />
          <div className={styles['info-text']}>💡 옷이 잘 보이게 찍을수록 정확도가 높아집니다.</div>
          <div className={styles['button-container']}>
            <Button>
              <Link href="/calendar/outfit">다음</Link>
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Calendar;

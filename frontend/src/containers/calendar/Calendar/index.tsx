/* eslint-disable react/no-unused-prop-types */

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

import { LeftArrow, RightArrow } from '@/../public/svgs';
import Button from '@/components/Button';
import ImageInput from '@/components/ImageInput';
import styles from '@/containers/calendar/Calendar/Calendar.module.scss';
import { ICalendar } from '@/containers/calendar/Calendar/type';
import useModal from '@/hooks/useModal';
import { fetchGetCalendar } from '@/services/clothes';

const Calendar = () => {
  const [year] = useState<number>(new Date().getFullYear());
  const [month] = useState<number>(new Date().getMonth() + 1);
  const [ootds, setOOTD] = useState<ICalendar[][]>([]);
  const [data, setData] = useState<ICalendar[]>();
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

  const fetchCalendarData = async () => {
    setData(await fetchGetCalendar({ year: year.toString(), month: paddingMonth(month) }));
  };

  useEffect(() => {
    if (year && month) {
      const lastDay = new Date(year, month, 0).getDate();
      const dayOfWeekOfDay1 = getDayOfWeek(1);
      const week = getWeek(lastDay, dayOfWeekOfDay1);
      const ootd = Array.from({ length: week }, (_, j) =>
        Array.from({ length: 7 }, (__, i) => {
          return { ootdId: -(j * 7 + i), day: 0, image: '' };
        }),
      );
      for (let i = 1; i <= lastDay; i++) {
        const itemOfDayi = data?.filter((item) => item.day === i) || [];
        if (itemOfDayi.length) {
          ootd[getWeek(i, dayOfWeekOfDay1) - 1][getDayOfWeek(i)] = itemOfDayi[0];
        } else {
          ootd[getWeek(i, dayOfWeekOfDay1) - 1][getDayOfWeek(i)] = {
            ootdId: i,
            day: i,
            image: '',
          };
        }
      }
      setOOTD(ootd);
    }
  }, [getDayOfWeek, month, year, data]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (year && month) {
      fetchCalendarData();
    }
  }, [year, month]);

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

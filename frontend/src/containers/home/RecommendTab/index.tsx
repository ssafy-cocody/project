import { useAtomValue } from 'jotai';
import Image from 'next/image';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { ReloadIcon } from '@/../public/svgs';
import styles from '@/containers/home/RecommendTab/Tab.module.scss';
import { IRecommendCody } from '@/containers/home/type';
import { userAtom } from '@/stores/user';
import { DATE_DIFF_VALUES, DATE_TEXT, IWeatherInfo } from '@/types/weather';

interface Props {
  selectedCody: IRecommendCody;
  setSelectedCody: Dispatch<SetStateAction<IRecommendCody>>;
  weatherInfo: IWeatherInfo;
}

const DATES = [DATE_DIFF_VALUES.TODAY, DATE_DIFF_VALUES.TOMORROW, DATE_DIFF_VALUES.DAYAFTERTOMORROW];

const RecommendTab = ({ selectedCody, setSelectedCody, weatherInfo }: Props) => {
  const user = useAtomValue(userAtom);
  const [selectedTap, setSelectedTap] = useState<(typeof DATE_DIFF_VALUES)[keyof typeof DATE_DIFF_VALUES]>(
    DATE_DIFF_VALUES.TODAY,
  );
  const [dateDiff, setDateDiff] = useState<(typeof DATE_DIFF_VALUES)[keyof typeof DATE_DIFF_VALUES]>(
    DATE_DIFF_VALUES.TODAY,
  );
  const [weatherUrl, setWeather] = useState<string>('/images/weather/sunny.png');
  const [description, setDescription] = useState<string>('오늘은 맑아요.');
  const [recommendCodies] = useState<IRecommendCody[]>([
    { id: 0, image: '/images/test1.jpg' },
    { id: 1, image: '/images/test2.jpg' },
    { id: 2, image: '/images/test3.jpg' },
    { id: 3, image: '/images/test4.jpg' },
    { id: 4, image: '/images/test5.jpg' },
  ]);
  const [ootdIndex] = useState<Number>(3);

  useEffect(() => {
    if (weatherInfo[dateDiff].SKY === '1') {
      setWeather('/images/weather/sunny.png');
      setDescription(' 날씨는 맑아요.');
    }
    if (weatherInfo[dateDiff].SKY === '3') {
      setWeather('/images/weather/cloudy.png');
      setDescription(' 날씨는 조금 흐려요.');
    }
    if (weatherInfo[dateDiff].SKY === '4') {
      setWeather('/images/weather/overcast.png');
      setDescription(' 날씨는 많이 흐려요.');
    }
  }, [dateDiff]);

  useEffect(() => {
    setSelectedCody(recommendCodies[0]);
  }, [recommendCodies]);

  const handleWeather = (changeDate: (typeof DATE_DIFF_VALUES)[keyof typeof DATE_DIFF_VALUES]) => {
    setSelectedTap(changeDate);
    setDateDiff(changeDate);
  };

  return (
    <div className={styles['recommendbox-container']}>
      <div className={styles['tab-container']}>
        {DATES.map((selectedDate) => {
          return (
            <button
              key={selectedDate}
              type="button"
              onClick={() => handleWeather(selectedDate)}
              className={`${styles.tab} ${selectedTap === selectedDate ? styles['selected-tab'] : ''}`}
            >
              {DATE_TEXT[selectedDate]}
            </button>
          );
        })}
      </div>
      <div className={styles['context-container']}>
        <button className={styles['reload-button']} type="button">
          <ReloadIcon />
        </button>
        <div className={styles['text-area']}>
          <div className={styles['temperature-container']}>
            <div className={styles.temperature}>
              {weatherInfo[dateDiff].TMN}° / {weatherInfo[dateDiff].TMX}°
            </div>
            {weatherInfo[dateDiff].SKY === '1' && <Image src={weatherUrl} alt="날씨" width={28} height={25} />}
            {weatherInfo[dateDiff].SKY === '3' && <Image src={weatherUrl} alt="날씨" width={27} height={25} />}
            {weatherInfo[dateDiff].SKY === '4' && <Image src={weatherUrl} alt="날씨" width={35} height={25} />}
          </div>
          <div className={styles['greeting-text']}>반가워요, {user?.nickname}님</div>
          <div className={styles['weather-description']}>
            {DATE_TEXT[selectedTap]}
            {description}
          </div>
        </div>
        <div className={styles['cody-area']}>
          {recommendCodies.map((cody: IRecommendCody, index) => {
            const { id, image } = cody;
            return (
              <button
                type="button"
                key={id}
                onClick={() => setSelectedCody(cody)}
                className={`${styles['cody-container']} ${selectedCody.id === id ? styles.view : ''}`}
              >
                <div className={`${ootdIndex === index ? styles['ootd-overlay'] : ''} `} />
                <div className={`${styles['cody-image']} `}>
                  <Image src={image} fill alt="추천 코디" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RecommendTab;

import Image from 'next/image';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { ReloadIcon } from '@/../public/svgs';
import styles from '@/containers/home/RecommendTab/Tab.module.scss';
import { ITemperatures, Time, TTime } from '@/containers/home/RecommendTab/type';
import { IRecommendCody } from '@/containers/home/type';

interface Props {
  selectedCody: IRecommendCody;
  setSelectedCody: Dispatch<SetStateAction<IRecommendCody>>;
}

const RecommendTab = ({ selectedCody, setSelectedCody }: Props) => {
  const [selectedTap, setSelectedTap] = useState<TTime>(Time.Today);
  // weather: 0 맑음 3 구름많음 4 흐림
  const [temperatures] = useState<ITemperatures>({
    lowestTemperature: 4,
    hightestTemperature: 15,
    weather: 3,
  });
  const [weatherUrl, setWeather] = useState<string>('/images/weather/sunny.png');
  const [nickname] = useState<string>('햄밤식');
  const [description] = useState<string>('오늘은 조금 추워요.');
  const [recommendCodies] = useState<IRecommendCody[]>([
    { id: 0, image: '/images/test1.jpg' },
    { id: 1, image: '/images/test2.jpg' },
    { id: 2, image: '/images/test3.jpg' },
    { id: 3, image: '/images/test4.jpg' },
    { id: 4, image: '/images/test5.jpg' },
  ]);
  const [ootdIndex] = useState<Number>(3);

  useEffect(() => {
    switch (temperatures.weather) {
      case 0:
        setWeather('/images/weather/sunny.png');
        break;
      case 3:
        setWeather('/images/weather/cloudy.png');
        break;
      case 4:
        setWeather('/images/weather/overcast.png');
        break;
      default:
        setWeather('/images/weather/sunny.png');
        break;
    }
    setSelectedCody(recommendCodies[0]);
  }, []);

  return (
    <div className={styles['recommendbox-container']}>
      <div className={styles['tab-container']}>
        <button
          type="button"
          onClick={() => setSelectedTap(Time.Today)}
          className={`${styles.tab} ${selectedTap === Time.Today ? styles['selected-tab'] : ''}`}
        >
          오늘
        </button>
        <button
          type="button"
          onClick={() => setSelectedTap(Time.Tomorrow)}
          className={`${styles.tab} ${selectedTap === Time.Tomorrow ? styles['selected-tab'] : ''}`}
        >
          내일
        </button>
        <button
          type="button"
          onClick={() => setSelectedTap(Time.DayAfterTomorrow)}
          className={`${styles.tab} ${selectedTap === Time.DayAfterTomorrow ? styles['selected-tab'] : ''}`}
        >
          모레
        </button>
      </div>
      <div className={styles['context-container']}>
        <button className={styles['reload-button']} type="button">
          <ReloadIcon />
        </button>
        <div className={styles['text-area']}>
          <div className={styles['temperature-container']}>
            <div className={styles.temperature}>
              {temperatures.lowestTemperature.toString()}° / {temperatures.hightestTemperature.toString()}°
            </div>
            <Image src={weatherUrl} alt="날씨" width={20} height={20} />
          </div>
          <div className={styles['greeting-text']}>반가워요, {nickname}님</div>
          <div className={styles['weather-description']}>{description}</div>
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

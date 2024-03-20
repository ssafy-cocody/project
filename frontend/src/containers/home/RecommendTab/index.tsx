import Image from 'next/image';
import { useEffect, useState } from 'react';

import styles from '@/containers/home/RecommendTab/Tab.module.scss';

import { ReloadIcon } from '../../../../public/svgs';
import { ITemperatures } from './type';

const RecommendTab = () => {
  // weather: 0 맑음 3 구름많음 4 흐림
  const [temperatures] = useState<ITemperatures>({
    lowestTemperature: 4,
    hightestTemperature: 15,
    weather: 3,
  });
  const [weatherUrl, setWeather] = useState<string>('/images/weather/sunny.png');
  const [nickname] = useState<string>('햄밤식');
  const [description] = useState<string>('오늘은 조금 추워요.');
  const [recommendCodies] = useState<string[]>([
    '/images/test1.jpg',
    '/images/test2.jpg',
    '/images/test3.jpg',
    '/images/test4.jpg',
    '/images/test5.jpg',
  ]);
  const [ootdIndex] = useState<Number>(3);
  const [viewerIndex] = useState<Number>(0);

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
  }, []);

  return (
    <div className={styles['recommendbox-container']}>
      <div className={styles['tab-container']}>
        <div className={`${styles.tab} ${styles['selected-tab']}`}>오늘</div>
        <div className={`${styles.tab}`}>내일</div>
        <div className={`${styles.tab} ${styles['final-tab']}`}>모레</div>
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
          {recommendCodies.map((cody, index) => {
            return (
              <div
                key={cody}
                className={`${styles['cody-container']} ${ootdIndex === index ? styles.ootd : ''} ${viewerIndex === index ? styles['view-cody-container'] : ''}`}
              >
                <div
                  className={`${viewerIndex === index ? styles['view-image-container'] : styles['image-container']}`}
                >
                  <Image src={cody} fill alt="추천 코디" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RecommendTab;
'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import Nav from '@/components/Nav';
import styles from '@/containers/home/Home.module.scss';
import MyCodyPreview from '@/containers/home/MyCodyPreview';
import RecommendItems from '@/containers/home/RecommendItems';
import RecommendTab from '@/containers/home/RecommendTab';
import RecommendViewer from '@/containers/home/RecommendViewer';
import { IRecommendCody } from '@/containers/home/type';
import { fetchWeatherInfo } from '@/services/weather';
import { DATE_DIFF_VALUES, ILatLon, ILocXY, IWeatherInfo, IWeatherResponse } from '@/types/weather';
import { alterLatLonToXY } from '@/utils/alterLatLonToXY';
import { getDate } from '@/utils/getDate';
import { getTimeForWeather } from '@/utils/getTimeForWeather';

const Home = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedCody, setSelectedCody] = useState<IRecommendCody>({ id: 0, image: '/images/logo.png' });
  const [latlon, setLatLon] = useState<ILatLon>();
  const [locXY, setLocXY] = useState<ILocXY>();
  const [weatherInfo, setWeatherInfo] = useState<IWeatherInfo>();
  const [readyToFetchWeatherInfo, SetReadyToFetchWeatherInfo] = useState(false);

  const { data: weatherData } = useQuery({
    queryKey: ['WeatherQueryKey', locXY],
    queryFn: () => fetchWeatherInfo(getDate({ dateDiff: DATE_DIFF_VALUES.TODAY }), locXY!),
    enabled: readyToFetchWeatherInfo,
  });

  useEffect(() => {
    if (weatherData) {
      const newWeatherInfo: IWeatherInfo = {
        [DATE_DIFF_VALUES.TODAY]: {},
        [DATE_DIFF_VALUES.TOMORROW]: {},
        [DATE_DIFF_VALUES.DAYAFTERTOMORROW]: {},
      };
      weatherData.response.body.items.item.forEach(({ fcstDate, fcstTime, category, fcstValue }: IWeatherResponse) => {
        Object.keys(newWeatherInfo).forEach((key) => {
          const curTime = Number(key) as (typeof DATE_DIFF_VALUES)[keyof typeof DATE_DIFF_VALUES];
          if (getDate({ dateDiff: curTime }) === fcstDate) {
            if (
              category === 'TMN' ||
              category === 'TMX' ||
              (['TMP', 'SKY', 'PTY'].includes(category) && fcstTime === getTimeForWeather())
            ) {
              newWeatherInfo[curTime][category] = Number(fcstValue).toString();
            }
          }
        });
      });
      setWeatherInfo(newWeatherInfo);
    }
  }, [weatherData]);

  useEffect(() => {
    if (locXY) {
      SetReadyToFetchWeatherInfo(true);
    }
  }, [locXY]);

  useEffect(() => {
    if (latlon) {
      setLocXY(alterLatLonToXY(latlon));
    }
  }, [latlon]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLatLon({ latitude: position.coords.latitude, longtitude: position.coords.longitude });
    });
  }, []);

  return (
    <main ref={scrollRef}>
      <header className={styles['home-header']}>
        <Image src="/images/logo.png" alt="Co.Cody 로고" width={130} height={40} />
      </header>
      <div className={styles['home-content']}>
        <RecommendViewer selectedCody={selectedCody} />
        {weatherInfo && (
          <RecommendTab selectedCody={selectedCody} setSelectedCody={setSelectedCody} weatherInfo={weatherInfo} />
        )}
        <RecommendItems />
        <MyCodyPreview />
      </div>
      <Nav />
    </main>
  );
};

export default Home;

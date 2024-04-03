import { useQuery } from '@tanstack/react-query';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import Image from 'next/image';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import styles from '@/containers/home/RecommendTab/Tab.module.scss';
import { BASE_URL, getAccessToken } from '@/services';
import { fetchWeatherInfo } from '@/services/weather';
import { dateDiffAtom, recommendCodyAtom, todayTempAtom } from '@/stores/home';
import { userAtom } from '@/stores/user';
import { IRecommendCody } from '@/types/recommend';
import { DATE_DIFF_VALUES, DATE_TEXT, ILatLon, ILocXY, IWeatherInfo, IWeatherResponse } from '@/types/weather';
import { alterLatLonToXY } from '@/utils/alterLatLonToXY';
import { getDate } from '@/utils/getDate';
import { getTimeForWeather } from '@/utils/getTimeForWeather';

interface Props {
  selectedCody: IRecommendCody;
  setSelectedCody: Dispatch<SetStateAction<IRecommendCody>>;
}

const DATES = [DATE_DIFF_VALUES.TODAY, DATE_DIFF_VALUES.TOMORROW, DATE_DIFF_VALUES.DAYAFTERTOMORROW];
const ITEM_CNT = 6;

const RecommendTab = ({ selectedCody, setSelectedCody }: Props) => {
  const user = useAtomValue(userAtom);
  const [selectedTap, setSelectedTap] = useState<(typeof DATE_DIFF_VALUES)[keyof typeof DATE_DIFF_VALUES]>(
    DATE_DIFF_VALUES.TODAY,
  );
  const [dateDiff, setDateDiff] = useAtom(dateDiffAtom);

  // 날씨 fetch
  const [latlon, setLatLon] = useState<ILatLon>();
  const [locXY, setLocXY] = useState<ILocXY>();
  const [weatherInfo, setWeatherInfo] = useState<IWeatherInfo>();
  const [readyToFetchWeatherInfo, SetReadyToFetchWeatherInfo] = useState(false);

  const setTodayTempAtom = useSetAtom(todayTempAtom); // 오늘 온도를 저장

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
      setTodayTempAtom(Number(newWeatherInfo[DATE_DIFF_VALUES.TODAY].TMP));
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

  // 날씨 description
  const [weatherUrl, setWeather] = useState<string>('/images/weather/sunny.png');
  const [description, setDescription] = useState<string>(' 날씨를 조회하는 중..');

  const handleWeather = (changeDate: (typeof DATE_DIFF_VALUES)[keyof typeof DATE_DIFF_VALUES]) => {
    setSelectedTap(changeDate);
    setDateDiff(changeDate);
  };

  // 추천 코디 fetch
  const [recommendCody, SetRecommendCodies] = useAtom(recommendCodyAtom);

  useEffect(() => {
    if (weatherInfo) {
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
    }

    let eventSource: EventSourcePolyfill;
    if (weatherInfo) {
      SetRecommendCodies([]);

      const YYYYMMDD = getDate({ dateDiff });
      const dateRequestFormat = `${YYYYMMDD.slice(0, 4)}-${YYYYMMDD.slice(4, 6)}-${YYYYMMDD.slice(4, 6)}`;
      eventSource = new EventSourcePolyfill(
        `${BASE_URL}/auth/v1/cody/recommend/cody?temp=${Number(weatherInfo[dateDiff].TMP)}&date=${dateRequestFormat}`,
        {
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
          },
        },
      );

      eventSource.onmessage = (event) => {
        SetRecommendCodies(
          Object.entries(JSON.parse(event.data)).reduce<IRecommendCody[]>(
            (arr: IRecommendCody[], [_, value]): IRecommendCody[] => [...arr, value as IRecommendCody],
            [],
          ),
        );
        eventSource.close();
      };
    }
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [weatherInfo, dateDiff]);

  useEffect(() => {
    if (recommendCody.length) {
      setSelectedCody(recommendCody[0]);
    }
  }, [recommendCody]);

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
        <div className={styles['text-area']}>
          <div className={styles['welcome-text']}>
            <div className={styles['greeting-text']}>반가워요, {user?.nickname}님</div>
            <div className={styles['weather-description']}>
              {DATE_TEXT[selectedTap]}
              {description}
            </div>
          </div>
          {weatherInfo && (
            <div className={styles['temperature-container']}>
              {weatherInfo[dateDiff].SKY === '1' && <Image src={weatherUrl} alt="날씨" width={28} height={25} />}
              {weatherInfo[dateDiff].SKY === '3' && <Image src={weatherUrl} alt="날씨" width={27} height={25} />}
              {weatherInfo[dateDiff].SKY === '4' && <Image src={weatherUrl} alt="날씨" width={35} height={25} />}
              <div className={styles.temperature}>
                {weatherInfo[dateDiff].TMN}° / {weatherInfo[dateDiff].TMX}°
              </div>
            </div>
          )}
        </div>
        <div className={styles['cody-area']}>
          {recommendCody.length > 0 &&
            recommendCody.map((cody: IRecommendCody) => {
              const { codyId, codyImage, isMyOotd } = cody;
              return (
                <button
                  type="button"
                  key={codyId}
                  onClick={() => setSelectedCody(cody)}
                  className={`${styles['cody-container']} ${selectedCody.codyId === codyId ? styles.view : ''}`}
                >
                  <div className={`${isMyOotd ? styles['ootd-overlay'] : ''} `} />
                  <div className={`${styles['cody-image']} `}>
                    <Image src={codyImage} fill alt="추천 코디" />
                  </div>
                </button>
              );
            })}
          {recommendCody.length === 0 &&
            Array.from({ length: ITEM_CNT }, (_, i) => i).map((i) => {
              return (
                <button type="button" key={i} className={styles['cody-container']}>
                  <div className={`${styles['cody-image']} `}>
                    추천 코디
                    <br /> 준비중 ₊⁺
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

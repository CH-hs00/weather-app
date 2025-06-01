import { useRouter } from 'next/router'
import { gql, useQuery } from '@apollo/client'
import Image from 'next/image'
import styles from '../styles/City.module.css'

const GET_WEATHER = gql`
  query GetWeather($city: String!) {
    getWeather(city: $city) {
      city
      country
      population
      dateTime
      temperature
      feelsLike
      description
      windSpeed
      humidity
      icon
      forecast {
        time
        temp
        description
        icon
      }
    }
  }
`

export default function CityWeather({ city: initialCity }) {
  const router = useRouter()
  const city = router.query.city || initialCity

  const { data, loading, error } = useQuery(GET_WEATHER, {
    variables: { city },
    skip: !city,
  })

  if (loading) return <p className={styles.status}>Loading...</p>
  if (error || !data?.getWeather)
    return <p className={styles.status}>Error fetching data</p>

  const w = data.getWeather

  // forecast 데이터를 날짜별로 묶어주는 함수
  const groupByDate = (list) => {
    return list.reduce((acc, item) => {
      const date = item.time.split(' ')[0] // "2025-06-01"
      if (!acc[date]) acc[date] = []
      acc[date].push(item)
      return acc
    }, {})
  }

  const groupedForecast = groupByDate(w.forecast)

  return (
    <div className={styles.pageContainer}>
      {/* 1. 상단 중앙 작은 지구 그림 */}
      <div className={styles.smallEarthWrapper}>
        <Image
          src="/earth.png"
          alt="Earth Icon"
          width={40}
          height={32}
        />
      </div>

      {/* 2. 페이지 타이틀 */}
      <h2 className={styles.pageTitle}>
        Weather Information for {w.city}
      </h2>

      {/* 3. 현재 날씨 박스 */}
      <div className={styles.currentBox}>
        <div className={styles.iconCircle}>
          <Image
            src={`https://openweathermap.org/img/wn/${w.icon}@2x.png`}
            alt="Weather Icon"
            width={50}
            height={50}
          />
        </div>
        <div className={styles.currentInfo}>
          <div className={styles.currentDate}>{w.dateTime}</div>
          <div className={styles.currentCity}>
            <span>
              {w.city}, {w.country}
            </span>
            <span className={styles.population}>
              {' '}
              (인구수: {w.population.toLocaleString()})
            </span>
          </div>
        </div>
        <div className={styles.currentTempSection}>
          <div className={styles.currentTemp}>
            {w.temperature.toFixed(1)}°C
          </div>
          <div className={styles.currentDetail}>
            Feels like {w.feelsLike.toFixed(1)}°C · {w.description} ·
            풍속 {w.windSpeed}m/s · 습도 {w.humidity}%
          </div>
        </div>
      </div>

      {/* 4. 5-day Forecast 아코디언 */}
      <div className={styles.accordionWrapper}>
        <div className={styles.accordionHeader}>5-day Forecast</div>
        <div className={styles.accordionList}>
          {Object.entries(groupedForecast).map(([date, times]) => {
            const [year, month, day] = date.split('-')
            const monthNames = [
              'January',
              'February',
              'March',
              'April',
              'May',
              'June',
              'July',
              'August',
              'September',
              'October',
              'November',
              'December',
            ]
            const displayDate = `${monthNames[parseInt(month, 10) - 1]} ${parseInt(
              day,
              10
            )}`

            return (
              <details key={date} className={styles.accordionDay}>
                <summary className={styles.accordionSummary}>
                  {displayDate}
                </summary>
                <div className={styles.accordionContent}>
                    {times.map((item, idx) => {
                        // "2025-06-01 09:00:00" → "09:00am"
                        // 공백으로 split → ["2025-06-01", "05:24:00"]
                        let [, hm] = item.time.split(' ') 
                        // ":"로 split → hh="05", mm="24"
                        let [hh, mm] = hm.split(':')       // hh = "05", mm = "24"
                        let hourNum = parseInt(hh, 10)
                        // 숫자형으로 바꾼 뒤 12시간제로 변환
                        const ampm = hourNum >= 12 ? 'pm' : 'am'
                        if (hourNum === 0) {
                            hourNum = 12;           // 자정인 경우 12am
                        } else if (hourNum > 12) {
                            hourNum = hourNum - 12;  // 13 → 1pm, 14 → 2pm 등
                        }
                        // 05 :24pm으로 출력하기 위한 수정(문자열로 바꾼 뒤 항상 2자리로 pad)
                        const hourPadded = String(hourNum).padStart(2, '0');
                        const displayTime = `${hourPadded}:${mm}${ampm}`  // "05:24pm"

                        return (
                        <div key={idx} className={styles.timeRow}>
                            {/* 왼쪽: 아이콘 + 시간 */}
                            <div className={styles.timeLeft}>
                            <div className={styles.iconCircleSmall}>
                                <Image
                                src={`https://openweathermap.org/img/wn/${item.icon}@2x.png`}
                                alt="Weather Icon"
                                width={30}
                                height={30}
                                />
                            </div>
                            <div className={styles.timeLabel}>{displayTime}</div>
                            </div>

                            {/* 오른쪽: 예보 온도 / 체감 온도, 그리고 설명 */}
                            <div className={styles.timeRight}>
                            <div className={styles.timeDesc}>{item.description}</div>
                            <div className={styles.timeTempGroup}>
                                {item.temp.toFixed(1)}°C / {item.temp.toFixed(1)}°C
                            </div>
                            </div>
                        </div>
                        )
                    })}
                </div>
              </details>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// 5. getStaticPaths: 네 개의 도시(Seoul, Tokyo, Paris, London)에 대해 페이지를 미리 생성
export async function getStaticPaths() {
  const cities = ['Seoul', 'Tokyo', 'Paris', 'London']
  const paths = cities.map((c) => ({
    params: { city: c },
  }))
  return {
    paths,
    fallback: false, // paths에 없는 페이지는 404 처리
  }
}

// 6. getStaticProps: initialCity 값을 넘겨주기만 하면, 클라이언트 사이드에서 useQuery가 실행.
export async function getStaticProps({ params }) {
  return {
    props: {
      city: params.city,
    },
  }
}

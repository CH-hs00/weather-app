// pages/api/graphql.js
import { ApolloServer, gql } from 'apollo-server-micro'
import fetch from 'node-fetch'

const typeDefs = gql`
  type Weather {
    city: String
    country: String
    population: Int
    dateTime: String
    temperature: Float
    feelsLike: Float
    description: String
    windSpeed: Float
    humidity: Int
    icon: String
    forecast: [Forecast]
  }

  type Forecast {
    time: String
    temp: Float
    description: String
    icon: String
  }

  type Query {
    getWeather(city: String!): Weather
  }
`

const resolvers = {
  Query: {
    getWeather: async (_, { city }) => {
      const apiKey = process.env.OPENWEATHER_API_KEY

      // 1) 현재 날씨 정보 조회 (Current Weather)
      const currentRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      )
      const current = await currentRes.json()
      // current 구조 참고:
      // current = {
      //   name, sys: { country }, main: { temp, feels_like, humidity }, weather: [{ description, icon }], wind: { speed }, dt: (timestamp)
      // }

      // 2) 5일 예보 조회 (3-hour forecast 5 days)
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
      )
      const forecastData = await forecastRes.json()
      // forecastData.city.population 에 인구수가 있음
      // forecastData.list: 배열(40개 정도), 각 item.dt_txt, item.main.temp, item.weather[0].description, item.weather[0].icon

      // 3) 현재 시각(예: “Jun 01, 09:00am”)으로 포맷 변환
      const dt = new Date(current.dt * 1000) // 밀리초 단위
      const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May',
        'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ]
      const month = monthNames[dt.getMonth()]
      let hourNum = dt.getHours()
      const ampm = hourNum >= 12 ? 'pm' : 'am'
      if (hourNum === 0) {
        hourNum = 12
      } else if (hourNum > 12) {
        hourNum = hourNum - 12
      }
      const hourPadded = String(hourNum).padStart(2, '0')
      const minute = dt.getMinutes().toString().padStart(2, '0')
      const dateTime = `${month} ${dt.getDate()}. ${hourPadded}:${minute}${ampm}`

      // 4) 현재 날씨 아이콘 코드(ex: “01d”)를 내려주기
      const currentIcon = current.weather[0].icon

      // 5) Forecast 항목을 전체로 내려주기
      const forecastList = forecastData.list.map((item) => ({
        time: item.dt_txt,
        temp: item.main.temp,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
      }))

      return {
        city: current.name,
        country: current.sys.country,
        population: forecastData.city.population || 0,
        dateTime,
        temperature: current.main.temp,
        feelsLike: current.main.feels_like,
        description: current.weather[0].description,
        windSpeed: current.wind.speed,
        humidity: current.main.humidity,
        icon: currentIcon,
        forecast: forecastList,
      }
    },
  },
}

const server = new ApolloServer({ typeDefs, resolvers })

const startServer = server.start().then(() =>
  server.createHandler({ path: '/api/graphql' })
)

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  const handlerFn = await startServer
  return handlerFn(req, res)
}

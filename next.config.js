/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['openweathermap.org'], 
    // 날씨 아이콘을 불러오기 위해 수정 //
  },
}

module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mqa-photo-1256901694.cos.ap-shanghai.myqcloud.com',
        port: '',
      }
    ]
  }
}

module.exports = nextConfig

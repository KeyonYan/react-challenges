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
  eslint: {
      ignoreDuringBuilds: true, // 忽略 eslint 检查
  },
  typescript: {
      ignoreBuildErrors: true, // 忽略 TypeScript 检查
  }
}

module.exports = nextConfig

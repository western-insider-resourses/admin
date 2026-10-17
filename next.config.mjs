/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The admin must never be indexed by search engines
  async headers() {
    return [{ source: '/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] }];
  },
};
export default nextConfig;

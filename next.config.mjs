/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'picsum.photos',
            port: '',
            pathname: '/seed/**',
          },

          {
            protocol: "https",
            hostname:"ffsvfvofnguubonfvyan.supabase.co",
            port:"",
            pathname: "/storage/**",
          }
        ],
      },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXTAUTH_URL: "https://iq-math-original.vercel.app/",

    NEXTAUTH_SECRET: "",
  },
  images: {
    domains: ["backend.iq-math.uz"], // Tashqi rasm domenini qo‘shamiz
  },
  // permanently

  // async redirects() {
  //   return [
  //     {
  //       source: "/",
  //       destination: "/auth/login",
  //       permanent: true,
  //       basePath: false,
  //     },
  //   ];
  // },
};

export default nextConfig;

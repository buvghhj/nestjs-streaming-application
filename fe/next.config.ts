import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/libs/i18n/request.ts');

const nextConfig: NextConfig = {

  reactStrictMode: true,

  images: {

    domains: ['res.cloudinary.com', 'tanstream-record.s3.ap-southeast-1.amazonaws.com'],

  },

}

export default withNextIntl({ ...nextConfig })

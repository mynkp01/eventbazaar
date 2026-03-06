/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: process.env.NEXT_PUBLIC_BACKEND_HOST,
            },
            {
                protocol: 'https',
                hostname: process.env.NEXT_PUBLIC_BACKEND_HOST,
            },
            {
                protocol: 'http',
                hostname: "eventbazaar.com",
            },
            {
                protocol: 'https',
                hostname: "eventbazaar.com",
            },
            {
                protocol: 'http',
                hostname: "staging.eventbazaar.com",
            },
            {
                protocol: 'https',
                hostname: "staging.eventbazaar.com",
            },
            {
                protocol: 'http',
                hostname: "content.eventbazaar.com",
            },
            {
                protocol: 'https',
                hostname: "content.eventbazaar.com",
            },
            {
                protocol: 'http',
                hostname: "env-1057685.us-accuweb.cloud",
            },
            {
                protocol: 'https',
                hostname: "env-1057685.us-accuweb.cloud",
            },
        ]
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
};

export default nextConfig;

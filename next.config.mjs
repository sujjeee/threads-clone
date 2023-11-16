/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */

const nextConfig = {
    async redirects() {
        if (process.env.NODE_ENV === "production") {
            return [
                {
                    source: "/seed",
                    destination: "/",
                    permanent: true,
                }
            ];
        } else {
            return [];
        }
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'uploadthing.com',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'utfs.io',
                pathname: '**',
            },
        ],
    },
};

export default nextConfig;

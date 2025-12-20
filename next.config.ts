import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'mernspace-pizza-app.s3.ap-south-1.amazonaws.com',
			},
			{
				protocol: 'https',
				hostname: 'example.com',
			},
		],
	},
};

export default nextConfig;

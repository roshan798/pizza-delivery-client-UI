import type { NextConfig } from 'next';
import path from 'path';

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
	turbopack: {
		root: path.join(__dirname),
	},
};

export default nextConfig;

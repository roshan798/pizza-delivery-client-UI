import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';
import Header from '@/components/custom/Header';

export const manrope = Manrope({
	variable: '--font-manrope',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Pizza App',
	description: 'Pizza delivery app built with Next.js and Tailwind CSS',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={`${manrope.className} antialiased`}>
				<Header />
				<main>{children}</main>
			</body>
		</html>
	);
}

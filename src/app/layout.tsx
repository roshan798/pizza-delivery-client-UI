import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';
import Header from '@/components/custom/Header';
import StoreProvider from './StoreProvider';
import { ToastProvider } from '@/components/ui/toast';
import Refresher from '@/components/custom/Refresher';

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
				<StoreProvider>
					<ToastProvider>
						<Refresher>
							<Header />
							<main>{children}</main>
						</Refresher>
					</ToastProvider>
				</StoreProvider>
			</body>
		</html>
	);
}

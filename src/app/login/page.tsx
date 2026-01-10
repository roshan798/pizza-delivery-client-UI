import { LoginForm } from './components/LoginForm';
interface LoginPageProps {
	searchParams: Promise<{
		'return-to'?: string;
	}>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
	const resolvedParams = await searchParams;
	return <LoginForm returnTo={resolvedParams['return-to']} />;
}

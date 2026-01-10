'use client';

import React, {
	createContext,
	useContext,
	useState,
	ReactNode,
	useCallback,
	useMemo,
	useRef,
} from 'react';
import { X, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

export type ToastItem = {
	id: string;
	title: string;
	description?: string;
	actionText?: string;
	position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
	variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
	icon?: ReactNode;
	className?: string;
	delay?: number;
	onAction?: () => void;
	isLeaving?: boolean;
};

type ToastAPI = {
	(t: Omit<ToastItem, 'id'>): string;
	success: (t: Omit<ToastItem, 'id'>) => string;
	error: (t: Omit<ToastItem, 'id'>) => string;
	info: (t: Omit<ToastItem, 'id'>) => string;
	warning: (t: Omit<ToastItem, 'id'>) => string;
	dismiss: (id: string) => void;
};

type ToastContextType = {
	toast: ToastAPI;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info';
export type ToastPosition =
	| 'top-left'
	| 'top-right'
	| 'bottom-left'
	| 'bottom-right';

export type ToastTheme = {
	containerClass?: string;
	toastClass?: string;
	variants?: Partial<Record<ToastVariant, string>>;
};

export function ToastProvider({
	children,
	position = 'top-right',
	delay = 5000,
	theme,
}: {
	children: ReactNode;
	position?: ToastPosition;
	delay?: number;
	theme?: ToastTheme;
}) {
	const [toasts, setToasts] = useState<ToastItem[]>([]);
	const timersRef = useRef<Map<string, number>>(new Map());
	const expiresRef = useRef<Map<string, number>>(new Map());
	const animationDuration = 220; // ms

	const scheduleRemove = useCallback((id: string) => {
		setToasts((s) =>
			s.map((t) => (t.id === id ? { ...t, isLeaving: true } : t))
		);
		window.setTimeout(() => {
			setToasts((s) => s.filter((t) => t.id !== id));
			timersRef.current.delete(id);
			expiresRef.current.delete(id);
		}, animationDuration + 20);
	}, []);

	const removeImmediate = useCallback((id: string) => {
		const timer = timersRef.current.get(id);
		if (timer) window.clearTimeout(timer);
		timersRef.current.delete(id);
		expiresRef.current.delete(id);
		setToasts((s) => s.filter((t) => t.id !== id));
	}, []);

	const toastCore = useCallback(
		(t: Omit<ToastItem, 'id'>) => {
			const id = Math.random().toString(36).slice(2, 9);
			const itemDelay = t.delay ?? delay;
			const item: ToastItem = { id, ...t };
			setToasts((s) => [item, ...s]);
			const expiresAt = Date.now() + itemDelay;
			expiresRef.current.set(id, expiresAt);
			const timer = window.setTimeout(
				() => scheduleRemove(id),
				itemDelay
			);
			timersRef.current.set(id, timer as unknown as number);
			return id;
		},
		[delay, scheduleRemove]
	);

	const toast = useMemo(() => {
		const base = (t: Omit<ToastItem, 'id'>) => toastCore(t);
		return Object.assign(base, {
			success: (t: Omit<ToastItem, 'id'>) =>
				toastCore({ ...t, variant: 'success' }),
			error: (t: Omit<ToastItem, 'id'>) =>
				toastCore({ ...t, variant: 'error' }),
			info: (t: Omit<ToastItem, 'id'>) =>
				toastCore({ ...t, variant: 'info' }),
			warning: (t: Omit<ToastItem, 'id'>) =>
				toastCore({ ...t, variant: 'warning' }),
			dismiss: (id: string) => removeImmediate(id),
		});
	}, [toastCore, removeImmediate]);

	const remove = (id: string) => {
		scheduleRemove(id);
		const timer = timersRef.current.get(id);
		if (timer) window.clearTimeout(timer);
	};

	const containerPlacement = useMemo(() => {
		switch (position) {
			case 'top-left':
				return 'top-4 left-4';
			case 'top-right':
				return 'top-4 right-4';
			case 'bottom-left':
				return 'bottom-4 left-4';
			case 'bottom-right':
			default:
				return 'bottom-4 right-4';
		}
	}, [position]);

	const variantClasses: Record<ToastVariant, string> = {
		default: 'bg-white border-gray-200 text-gray-900',
		success: 'bg-emerald-50 border-emerald-200 text-emerald-900',
		error: 'bg-rose-50 border-rose-200 text-rose-900',
		warning: 'bg-amber-50 border-amber-200 text-amber-900',
		info: 'bg-sky-50 border-sky-200 text-sky-900',
	};

	const variantIcon = (v?: ToastVariant) => {
		switch (v) {
			case 'success':
				return <CheckCircle className="text-emerald-600" size={18} />;
			case 'error':
				return <AlertTriangle className="text-rose-600" size={18} />;
			case 'warning':
				return <AlertTriangle className="text-amber-600" size={18} />;
			case 'info':
				return <Info className="text-sky-600" size={18} />;
			default:
				return null;
		}
	};

	return (
		<ToastContext.Provider value={{ toast }}>
			{children}
			<div
				className={clsx(
					containerPlacement,
					'z-[99999]',
					'pointer-events-none',
					'fixed',
					'flex',
					'flex-col',
					'gap-3',
					'w-[320px]',
					theme?.containerClass
				)}
				aria-live="polite"
			>
				{toasts.map((t) => {
					const vClass =
						theme?.variants?.[t.variant as ToastVariant] ??
						variantClasses[
							(t.variant as ToastVariant) ?? 'default'
						];
					const toastClass = clsx(
						'pointer-events-auto',
						vClass,
						'border',
						'rounded-lg',
						'shadow',
						'px-4',
						'py-3',
						'flex',
						'items-start',
						'space-x-3',
						'transition-transform',
						'duration-200',
						'ease-out',
						'transform',
						t.isLeaving
							? 'translate-y-2 opacity-0'
							: 'translate-y-0 opacity-100',
						theme?.toastClass,
						t.className
					);
					return (
						<div
							key={t.id}
							className={toastClass}
							role="status"
							onMouseEnter={() => {
								const timer = timersRef.current.get(t.id);
								if (timer) {
									window.clearTimeout(timer);
									const expiresAt =
										expiresRef.current.get(t.id) ?? 0;
									const remaining = Math.max(
										0,
										expiresAt - Date.now()
									);
									expiresRef.current.set(
										t.id,
										Date.now() + remaining
									);
									timersRef.current.set(
										t.id,
										remaining as unknown as number
									);
								}
							}}
							onMouseLeave={() => {
								const stored = timersRef.current.get(
									t.id
								) as unknown as number;
								const remaining =
									typeof stored === 'number' && stored > 0
										? stored
										: (expiresRef.current.get(t.id) ?? 0) -
											Date.now();
								if (remaining > 0) {
									const timer = window.setTimeout(
										() => scheduleRemove(t.id),
										remaining
									);
									timersRef.current.set(
										t.id,
										timer as unknown as number
									);
									expiresRef.current.set(
										t.id,
										Date.now() + remaining
									);
								} else {
									scheduleRemove(t.id);
								}
							}}
							onFocus={() => {
								const timer = timersRef.current.get(t.id);
								if (timer) window.clearTimeout(timer);
							}}
							onBlur={() => {
								const expiresAt =
									expiresRef.current.get(t.id) ?? 0;
								const remaining = Math.max(
									0,
									expiresAt - Date.now()
								);
								if (remaining > 0) {
									const timer = window.setTimeout(
										() => scheduleRemove(t.id),
										remaining
									);
									timersRef.current.set(
										t.id,
										timer as unknown as number
									);
								} else {
									scheduleRemove(t.id);
								}
							}}
						>
							<div className="flex-shrink-0 mt-1">
								{t.icon ?? variantIcon(t.variant)}
							</div>
							<div className="flex-1">
								<div className="font-semibold text-sm">
									{t.title}
								</div>
								{t.description && (
									<div className="text-sm opacity-90">
										{t.description}
									</div>
								)}
								{t.actionText && t.onAction && (
									<div className="mt-2">
										<button
											onClick={() => {
												t.onAction?.();
												removeImmediate(t.id);
											}}
											className="text-sm underline cursor-pointer"
										>
											{t.actionText}
										</button>
									</div>
								)}
							</div>

							<button
								className="ml-2 text-gray-500 hover:text-gray-700 cursor-pointer"
								onClick={() => remove(t.id)}
								aria-label="Close notification"
							>
								<X size={16} />
							</button>
						</div>
					);
				})}
			</div>
		</ToastContext.Provider>
	);
}

export function useToast() {
	const ctx = useContext(ToastContext);
	if (!ctx) {
		throw new Error('useToast must be used within a ToastProvider');
	}
	return ctx;
}

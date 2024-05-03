import { useEffect, useState, useCallback } from 'react';

type UseFetchDataType<T> = {
	query: string;
	delay: number;
	onComplete?: (data?: T) => void;
};

function mockDelay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

const mockData: any[] = [
	{
		value: 'Taiwo',
		label: 'Taiwo',
	},
	{
		value: 'Kenny',
		label: 'Kenny',
	},
	{
		value: 'John',
		label: 'John',
	},
];

export const useFetchData = <T>({
	delay,
	query,
	onComplete,
}: UseFetchDataType<T>) => {
	const [data, setData] = useState<T | null>(null);
	const [error, setError] = useState<string | null>('');

	const fetchData = useCallback(async () => {
		await mockDelay(delay);
		setData(mockData);
		onComplete?.(mockData);
	}, [delay]);

	useEffect(() => {
		if (!query) {
			setData(null);
			setError(null);

			return;
		}

		fetchData();
	}, [fetchData, query]);

	return [data, setData, error] as const;
};

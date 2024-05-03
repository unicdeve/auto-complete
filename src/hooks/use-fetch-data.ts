import { useEffect, useState, useCallback } from 'react';

type UseFetchDataType = {
	query: string;
	delay: number;
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

export const useFetchData = <T>({ delay, query }: UseFetchDataType) => {
	const [data, setData] = useState<T | null>(null);
	const [error, setError] = useState<string | null>('');

	const fetchData = useCallback(async () => {
		await mockDelay(delay);
		setData(mockData);
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

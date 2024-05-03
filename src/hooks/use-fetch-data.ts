import { useEffect, useState, useCallback } from 'react';
import { useDebounce } from './use-dounce';

type UseFetchDataType<T> = {
	query: string;
	formatData: (data: unknown) => T;
	onComplete?: (data?: T) => void;
	delay: number;
};

export const useFetchData = <T>({
	query,
	formatData,
	delay,
	onComplete,
}: UseFetchDataType<T>) => {
	const [data, setData] = useState<T | null>(null);
	const [error, setError] = useState<string | null>('');

	const debounce = useDebounce();

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const fetchData = useCallback(
		debounce(async (query: string, signal: AbortSignal) => {
			try {
				// TODO: make this dynamic
				const response = await fetch(
					`https://restcountries.com/v3.1/name/${query}?fields=name`,
					{ signal }
				);
				if (!response.ok) throw new Error(response.statusText);

				const data = await response.json();
				const formattedData = formatData(data);
				setData(formattedData);
				onComplete?.(formattedData);
			} catch (e) {
				if (!signal.aborted && e instanceof Error) setError(e.message);
			}
		}, delay),
		[]
	);

	useEffect(() => {
		if (!query) {
			setData(null);
			setError(null);

			return;
		}

		const controller = new AbortController();
		const signal = controller.signal;

		fetchData(query, signal);

		return () => {
			controller.abort();
		};
	}, [query, formatData, fetchData]);

	return [data, setData, error] as const;
};

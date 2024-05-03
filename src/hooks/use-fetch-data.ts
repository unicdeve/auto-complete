import { useEffect, useState, useCallback } from 'react';
import { useDebounce } from './use-dounce';
import {
	fetchRecentQueries,
	getDataCache,
	updateDataCache,
} from '../utils/cache';

type UseFetchDataType<T> = {
	query: string;
	formatData: (data: unknown) => T[];
	onComplete?: (data?: T[]) => void;
	delay: number;
	dataSource: {
		getUrl: (query: string) => string;
	};
	cacheKey: string;
};

export const useFetchData = <T>({
	query,
	formatData,
	delay,
	onComplete,
	dataSource,
	cacheKey,
}: UseFetchDataType<T>) => {
	const [data, setData] = useState<T[] | null>(null);
	const [error, setError] = useState<string | null>('');

	const debounce = useDebounce();

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const fetchData = useCallback(
		debounce(async (query, signal) => {
			const cache = getDataCache<T[]>(cacheKey);

			if (cache[query]?.length > 0) {
				setData(cache[query]);
				return;
			}

			if (query === '') {
				const recentQueries = fetchRecentQueries<T[]>(cacheKey);
				setData(recentQueries);

				return;
			}

			try {
				const response = await fetch(dataSource.getUrl(query), { signal });
				if (!response.ok) throw new Error(response.statusText);

				const data = await response.json();
				const formattedData = formatData(data);
				setData(formattedData);
				onComplete?.(formattedData);

				// caching is really had, using a library like tanstack-query would have been great
				updateDataCache(cacheKey, query, formattedData);
			} catch (e) {
				if (!signal.aborted && e instanceof Error) setError(e.message);
				console.log(e);
			}
		}, delay),
		[]
	);

	useEffect(() => {
		const controller = new AbortController();
		const signal = controller.signal;

		fetchData(query, signal);

		return () => {
			controller.abort();
		};
	}, [query, formatData, fetchData]);

	return [data, setData, error] as const;
};

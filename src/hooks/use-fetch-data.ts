import { useEffect, useState, useCallback } from 'react';
import { useDebounce } from './use-dounce';
import {
	fetchRecentQueries,
	getDataCache,
	updateDataCache,
} from '../utils/cache';
import { AutocompleteProps } from '@/types/auto-complete.types';

type UseFetchDataType<T> = Pick<AutocompleteProps, 'dataSource'> & {
	query: string;
	formatData: (data: unknown) => T[];
	onComplete?: (data?: T[]) => void;
	delay: number;
	cacheKey: string;
	maxItemsLimit: number;
};

export const useFetchData = <T>({
	query,
	formatData,
	delay,
	onComplete,
	dataSource,
	cacheKey,
	maxItemsLimit,
}: UseFetchDataType<T>) => {
	const [data, setData] = useState<T[] | null>(null);
	const [error, setError] = useState<string | null>('');
	const [loading, setLoading] = useState(false);

	const debounce = useDebounce();

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const fetchData = useCallback(
		debounce(async (query, signal) => {
			setLoading(true);
			const cache = getDataCache<T[]>(cacheKey);

			if (cache[query]?.length > 0) {
				setData(cache[query]);
				setLoading(false);
				setError(null);

				return;
			}

			if (query === '') {
				const recentQueries = fetchRecentQueries<T[]>(cacheKey);
				setData(recentQueries);
				setLoading(false);
				setError(null);

				return;
			}

			try {
				const response = await fetch(dataSource.getUrl(query, maxItemsLimit), {
					signal,
				});
				if (!response.ok) throw new Error(response.statusText);

				const data = await response.json();
				const formattedData = formatData(data);

				// Ideally, your BE should support pagination
				// If the BE doesn't support pagination, make sure you are slicing the items on the FE
				if (formattedData.length > maxItemsLimit) {
					formattedData.slice(0, maxItemsLimit);
				}

				setData(formattedData);
				onComplete?.(formattedData);

				// caching is really had, using a library like tanstack-query would have been great
				updateDataCache(cacheKey, query, formattedData);
			} catch (e) {
				if (!signal.aborted && e instanceof Error) setError(e.message);
				console.log(e);
			} finally {
				setLoading(false);
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

	return { data, setData, loading, error };
};

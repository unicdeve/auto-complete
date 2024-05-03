// TODO: Use IndexDB for better performance
// Write logic for pruning the cache periodically
const DATA_CACHE_KEY = 'autocompletes';

const getCacheKey = (cacheKey: string) => `${DATA_CACHE_KEY}:${cacheKey}`;

export const updateDataCache = <T>(
	cacheKey: string,
	query: string,
	data: T
) => {
	const key = getCacheKey(cacheKey);
	let cache;
	if (localStorage.getItem(key)) {
		cache = JSON.parse(localStorage.getItem(key) || '{}');

		cache[query] = data;
	} else {
		cache = {
			[query]: data,
		};
	}

	localStorage.setItem(key, JSON.stringify(cache));
};

export const getDataCache = <T>(cacheKey: string) => {
	const key = getCacheKey(cacheKey);
	let cache: Record<string, T> = {};
	if (localStorage.getItem(getCacheKey(cacheKey))) {
		cache = JSON.parse(localStorage.getItem(key) || '{}');
	}

	return cache;
};

export const fetchRecentQueries = <T>(cacheKey: string) => {
	const cache = getDataCache<T>(cacheKey);

	const flattenedArray = Object.values(cache).flat();

	return flattenedArray.slice(0, 10);
};

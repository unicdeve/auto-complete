// TODO: Use IndexDB for better performance
const DATA_CACHE_KEY = 'autocompletes';

export const updateDataCache = <T>(query: string, data: T) => {
	let cache;
	if (localStorage.getItem(DATA_CACHE_KEY)) {
		cache = JSON.parse(localStorage.getItem(DATA_CACHE_KEY) || '{}');

		cache[query] = data;
	} else {
		cache = {
			[query]: data,
		};
	}

	localStorage.setItem(DATA_CACHE_KEY, JSON.stringify(cache));
};

export const getDataCache = <T>() => {
	let cache: Record<string, T> = {};
	if (localStorage.getItem(DATA_CACHE_KEY)) {
		cache = JSON.parse(localStorage.getItem(DATA_CACHE_KEY) || '{}');
	}

	return cache;
};

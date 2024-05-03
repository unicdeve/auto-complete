import { useState } from 'react';
import { useClickOutside } from './use-click-outside';
import { useFetchData } from './use-fetch-data';
import { fetchRecentQueries } from '../utils/cache';
import {
	AutocompleteItem,
	AutocompleteProps,
} from '../types/auto-complete.types';

type UseAutocompleteType = Pick<
	AutocompleteProps,
	'dataSource' | 'formatData' | 'debounceDelay' | 'maxItemsLimit'
> & {
	cacheKey: string;
};

export const useAutocomplete = ({
	dataSource,
	formatData,
	debounceDelay = 300,
	cacheKey,
	maxItemsLimit = 50,
}: UseAutocompleteType) => {
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState('');
	const [activeIndex, setActiveIndex] = useState<number | null>(null);

	const ref = useClickOutside(() => setOpen(false));

	const { data, setData, loading, error } = useFetchData<AutocompleteItem>({
		dataSource,
		query,
		formatData,
		delay: debounceDelay,
		cacheKey,
		maxItemsLimit,
		onComplete: () => {
			setOpen(true);
		},
	});

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		setQuery(value);
	};

	const handleBlur = () => {
		setOpen(false);
	};

	const handleFocus = () => {
		if (!query) {
			const recentQueries = fetchRecentQueries<AutocompleteItem[]>(cacheKey);
			setData(recentQueries);
		}

		setOpen(true);
	};

	const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
		const key = event.key;
		if (key === 'Escape') {
			setOpen(false);

			return;
		}

		if (key === 'Enter') {
			if (activeIndex === null) return;

			data && setQuery(data[activeIndex].value);
			setActiveIndex(null);

			return;
		}

		const dataLenght = data?.length || 0;

		if (!data || dataLenght === 0) return;

		if (key === 'ArrowDown') {
			// moving down
			if (activeIndex === null || activeIndex === dataLenght - 1) {
				setActiveIndex(0);
			} else {
				setActiveIndex((prev) => (prev !== null ? prev + 1 : prev));
			}
		} else if (key === 'ArrowUp') {
			// moving up
			if (activeIndex === 0) setActiveIndex(dataLenght - 1);
			else setActiveIndex((prev) => (prev !== null ? prev - 1 : prev));
		}
	};

	const onItemSelect = (item: AutocompleteItem) => {
		setQuery(item.value);
		setOpen(false);
	};

	return {
		data,
		error,
		loading,
		open,
		ref,
		activeIndex,
		query,
		onItemSelect,
		handleChange,
		handleBlur,
		handleFocus,
		handleKeyUp,
	};
};

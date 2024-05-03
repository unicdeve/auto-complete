import { useState } from 'react';

export const useDebounce = () => {
	const [timeoutId, setTimeoutId] = useState<number | undefined>(undefined);

	// We want args to be any[] here
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const debounce = <Args extends any[]>(
		callback: (...args: Args) => void,
		delay: number
	) => {
		return (...args: Args) => {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
			const id = setTimeout(() => {
				callback(...args);
			}, delay);
			setTimeoutId(id);
		};
	};

	return debounce;
};

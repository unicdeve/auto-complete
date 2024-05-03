export type AutocompleteItem = {
	label: string;
	value: string;
};

export type AutocompleteProps = {
	name: string;
	id?: string;
	label?: string;
	placeholder?: string;
	// data can be any type for now
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	formatData: (data: any) => AutocompleteItem[];
	debounceDelay?: number;
	classNames?: {
		wrapperClass?: string;
		inputClass?: string;
		labelClass?: string;
	};
	dataSource: {
		getUrl: (query: string, limit?: number) => string;
	};
	maxItemsLimit?: number; // Limit the result from the backend
	errorMessage?: React.JSX.Element;
	noDataMessage?: React.JSX.Element;
};

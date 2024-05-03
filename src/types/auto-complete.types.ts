export type AutocompleteItem = {
	label: string;
	value: string;
};

export type AutocompleteProps = {
	name: string;
	id?: string;
	label?: string;
	placeholder?: string;
	formatData: (data: any) => AutocompleteItem[];
	debounceDelay?: number;
	inputClassname?: string;
	labelClassname?: string;

	dataSource: {
		getUrl: (query: string) => string;
	};
	errorMessage?: React.JSX.Element;
	noDataMessage?: React.JSX.Element;
};

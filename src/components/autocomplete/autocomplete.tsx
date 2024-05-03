'use client';
import React from 'react';
import './autocomplete.styles.css';
import { useAutocomplete } from '../../hooks';

export type AutocompleteItem = {
	label: string;
	value: string;
};

type AutocompleteProps = {
	name: string;
	id?: string;
	label?: string;
	placeholder?: string;
	// data can be any type for now
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export const Autocomplete = ({
	name,
	id,
	label,
	placeholder,
	inputClassname,
	labelClassname,
	formatData,
	debounceDelay = 300,
	dataSource,
	errorMessage,
	noDataMessage,
}: AutocompleteProps) => {
	const {
		data,
		error,
		open,
		ref,
		activeIndex,
		query,
		onItemSelect,
		handleChange,
		handleBlur,
		handleFocus,
		handleKeyUp,
	} = useAutocomplete({
		dataSource,
		debounceDelay,
		formatData,
		cacheKey: name,
	});

	const renderSuggestions = () => {
		if (error) {
			if (errorMessage)
				return (
					<div className='unicdev-suggestion-container'>{errorMessage}</div>
				);

			return (
				<ul className='unicdev-suggestion-container'>
					<li className={`unicdev-suggestion-item unicdev-no-suggestion`}>
						Error fetching items
					</li>
				</ul>
			);
		}

		if (!data || (data && data.length === 0)) {
			if (noDataMessage)
				return (
					<div className='unicdev-suggestion-container'>{noDataMessage}</div>
				);

			return (
				<ul className='unicdev-suggestion-container'>
					<li className={`unicdev-suggestion-item unicdev-no-suggestion`}>
						No items found
					</li>
				</ul>
			);
		}

		return (
			<ul className='unicdev-suggestion-container'>
				{data.map((data, index) => {
					let isActive = '';

					if (activeIndex !== null && index === activeIndex)
						isActive = 'unicdev-suggestion-active';

					const parts = data.label.split(new RegExp(`(${query})`, 'gi'));

					return (
						<li
							className={`unicdev-suggestion-item ${isActive}`}
							key={index}
							onClick={() => onItemSelect(data)}
						>
							{parts.map((part, i) => {
								if (part.toLowerCase() === query.toLowerCase())
									return (
										<strong
											key={i}
											style={{ fontWeight: 'bold', color: '#000' }}
										>
											{part}
										</strong>
									);
								else return part;
							})}
						</li>
					);
				})}
			</ul>
		);
	};

	return (
		<div className='unicdev-auto' ref={ref}>
			<label className={`unicdev-auto-label ${labelClassname}`} htmlFor={name}>
				{label}
			</label>

			<div className='unicdev-auto-input-wrapper'>
				<input
					name={name}
					className={`unicdev-auto-input ${inputClassname}`}
					id={id}
					value={query}
					onChange={handleChange}
					onFocus={handleFocus}
					onBlur={handleBlur}
					placeholder={placeholder}
					autoComplete='off'
					onKeyUp={handleKeyUp}
				/>

				{open ? renderSuggestions() : null}
			</div>
		</div>
	);
};

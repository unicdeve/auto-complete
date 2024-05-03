'use client';
import React, { useState } from 'react';
import './autocomplete.styles.css';

export type AutocompleteItem = {
	label: string;
	value: string;
};

type AutocompleteProps = {
	name: string;
	id?: string;
	label?: string;
	placeholder?: string;
	debounceDelay?: number;
	inputClassname?: string;
	labelClassname?: string;
};

export const Autocomplete = ({
	name,
	id,
	label,
	placeholder,
	inputClassname,
	labelClassname,
}: AutocompleteProps) => {
	const [query, setQuery] = useState('');

	const error = undefined;
	const data = [
		{
			value: 'Taiwo',
			label: 'Taiwo',
		},
		{
			value: 'Kenny',
			label: 'Kenny',
		},
		{
			value: 'John',
			label: 'John',
		},
	];

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setQuery(event.target.value);
	};

	const onItemSelect = (item: AutocompleteItem) => {
		setQuery(item.value);
	};

	const renderSuggestions = () => {
		if (error) {
			return (
				<ul className='unicdev-suggestion-container'>
					<li className={`unicdev-suggestion-item unicdev-no-suggestion`}>
						Error fetching items
					</li>
				</ul>
			);
		}

		if (!data || (data && data.length === 0)) {
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
					return (
						<li
							className='unicdev-suggestion-item'
							key={index}
							onClick={() => onItemSelect(data)}
						>
							{data.label}
						</li>
					);
				})}
			</ul>
		);
	};

	return (
		<div className='unicdev-auto'>
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
					placeholder={placeholder}
					autoComplete='off'
				/>

				{data.length > 0 ? renderSuggestions() : null}
			</div>
		</div>
	);
};

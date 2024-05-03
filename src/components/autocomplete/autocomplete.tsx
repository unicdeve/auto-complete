'use client';
import React, { useState } from 'react';
import './autocomplete.styles.css';
import { useFetchData } from '../../hooks/use-fetch-data';
import { useClickOutside } from '../../hooks/use-click-outside';

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
}: AutocompleteProps) => {
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState('');
	const [activeIndex, setActiveIndex] = useState<number | null>(null);

	const [data, setData, error] = useFetchData<AutocompleteItem[]>({
		query,
		formatData,
		delay: debounceDelay,
		onComplete: () => {
			setOpen(true);
		},
	});

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setQuery(event.target.value);
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
			setData(null);
			setActiveIndex(null);

			return;
		}

		const dataLenght = data?.length || 0;

		if (!data || dataLenght === 0) return;

		if (key === 'ArrowDown') {
			if (activeIndex === null || activeIndex === dataLenght - 1) {
				setActiveIndex(0);
			} else {
				setActiveIndex((prev) => (prev !== null ? prev + 1 : prev));
			}
		} else if (key === 'ArrowUp') {
			if (activeIndex === 0) setActiveIndex(dataLenght - 1);
			else setActiveIndex((prev) => (prev !== null ? prev - 1 : prev));
		}
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

	const ref = useClickOutside(() => setOpen(false));

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
					placeholder={placeholder}
					autoComplete='off'
					onKeyUp={handleKeyUp}
				/>

				{open ? renderSuggestions() : null}
			</div>
		</div>
	);
};

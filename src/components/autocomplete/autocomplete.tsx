'use client';
import { AutocompleteProps } from '@/types/auto-complete.types';
import { useAutocomplete } from '../../hooks';
import { CircularLoading } from '../circular-loading';
import './autocomplete.styles.css';

export const Autocomplete = ({
	name,
	id,
	label,
	placeholder,
	classNames,
	formatData,
	debounceDelay = 300,
	dataSource,
	errorMessage,
	noDataMessage,
	maxItemsLimit,
}: AutocompleteProps) => {
	const {
		data,
		error,
		loading,
		open,
		ref,
		activeIndex,
		query,
		onItemSelect,
		handleChange,
		handleFocus,
		handleKeyUp,
	} = useAutocomplete({
		dataSource,
		debounceDelay,
		formatData,
		cacheKey: name,
		maxItemsLimit,
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
							onClick={() => {
								onItemSelect(data);
							}}
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
		<div className={`unicdev-auto ${classNames?.wrapperClass}`} ref={ref}>
			<label
				className={`unicdev-auto-label ${classNames?.labelClass}`}
				htmlFor={name}
			>
				{label}
			</label>

			<div className='unicdev-auto-input-wrapper'>
				<input
					name={name}
					className={`unicdev-auto-input ${classNames?.inputClass}`}
					id={id}
					value={query}
					onChange={handleChange}
					onFocus={handleFocus}
					placeholder={placeholder}
					autoComplete='off'
					onKeyUp={handleKeyUp}
				/>

				<div className='unicdev-circular-loading'>
					{loading && <CircularLoading />}
				</div>
			</div>

			{open ? renderSuggestions() : null}
		</div>
	);
};

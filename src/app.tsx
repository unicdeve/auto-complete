import { Autocomplete } from './components';

interface CountryType {
	name: { common: string; official: string };
}

const formatData = (data: CountryType[]) => {
	return data.map((item) => ({
		value: item.name.official,
		label: item.name.official,
	}));
};

function App() {
	return (
		<div
			style={{
				padding: 40,
			}}
		>
			<h1 className='text-4xl font-black'>Auto complete component</h1>

			<Autocomplete
				label='Cities'
				placeholder='Search for cities'
				name='fakeNames'
				formatData={formatData}
			/>
		</div>
	);
}

export default App;

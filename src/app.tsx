import { Autocomplete } from './components';

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
			/>
		</div>
	);
}

export default App;

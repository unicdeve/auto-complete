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
		<main style={{ padding: 40 }}>
			<header>
				<h1>Autocomplete</h1>
			</header>

			<section>
				<Autocomplete
					label='Countries'
					placeholder='Search for countries'
					name='fakeNames'
					formatData={formatData}
					dataSource={{
						getUrl: (query) =>
							`https://restcountries.com/v3.1/name/${query}?fields=name`,
					}}
				/>

				<p>
					More items to demonstrate no layout shift when the suggestion list is
					open.
				</p>
			</section>
		</main>
	);
}

export default App;

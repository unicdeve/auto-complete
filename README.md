## React Autocomplete component

## Installation

First, make sure you have [Node.js](https://nodejs.org) and
[Yarn](https://yarnpkg.com) installed with the right versions, you can use
[nvm](https://github.com/nvm-sh/nvm) to manage your node versions.

Node version: `v18.*.*` Yarn version: `v1.22.*` You can use the following
command to install the correct node version:

```bash
# install node version 18
$ nvm install v18

# use node version 18
$ nvm use v18

# install yarn version 1.22
$ npm install -g yarn@1.22

# install packages
$ yarn install

```

If you want to bypass the node engines check, you can edit the script and remove
the `yarn node-engine-check && ` from any command you want to run. Note that by
doing this, the app might face some issues and the app might not run as expected
if you aren't using the correct engines versions.

## Running the app

Then, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to use the
app.

### How the app works

You can pass in various props, you can check AutocompleteProps in
types/auto-complete.types.ts file.

Basic usage

```javascript
<Autocomplete
	label='Countries'
	placeholder='Search for countries'
	name='countries' // The name is essentially for fetching/updating the correct cache
	formatData={formatData}
	dataSource={{
		getUrl: (query) =>
			`https://restcountries.com/v3.1/name/${query}?fields=name`,
	}}
/>
```

Setting `maxItemsLimit`, it's basically the limit of items that needs to be
fetched from the sever. The default is 50 if you don't pass any.

```javascript
<Autocomplete
	label='Countries'
	placeholder='Search for countries'
	name='countries'
	formatData={formatData}
	dataSource={{
		getUrl: (query, limit) =>
			`https://restcountries.com/v3.1/name/${query}?fields=name?limit=${limit}`,
	}}
	maxItemsLimit={50}
/>

// maxItemsLimit is passed to the `getUrl` function in dataSource
```

The dataSource can be extended if need be, for example if you need to pass some
request headers to your `getUrl` function

```javascript
<Autocomplete
	...
	dataSource={{
		getUrl: (query, limit) =>
			`https://restcountries.com/v3.1/name/${query}?fields=name?limit=${limit}`,
    headers: {
      'authorization': `Bearer ${API_KEY}`
    }
	}}
/>
```

[Highlighting matching texts](./demo/highlighting%20match%20texts.png)

## Screenshots

<div style="display: flex; flex-direction: 'column'; gap: 20px; flex-wrap: wrap">
	<img src="./screenshots/highlighting match texts.png" width=45%>
	<img src="./screenshots/suggestion box-no-layout-shift-1.png" width=45%>
	<img src="./screenshots/suggestion box-no-layout-shift-2.png" width=45%>
	<video src="./screenshots/demo.mov" width=45% controls autoplay>
</div>

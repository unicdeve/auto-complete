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

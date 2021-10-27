# Tutorial-5
IT5007 tutorial5 by Hu Yuxuan
# Command-line commands

## Project Setup
...
nvm install 10
nvm alias default 10
node --version
npm --version
npm install -g npm@6
npm init
npm install express
npm uninstall express
npm install express@4
...

## JSX transform
...
npm install --save-dev @babel/core@7 @babel/cli@7
node_modules/.bin/babel --version
npx babel --version
npm install --save-dev @babel/preset-react@7
npx babel src --presets @babel/react --out-dir public
...

## play with mongo
...
node scripts/trymongo.js
...

## Schema Initialization
...
mongo issuetracker scripts/init.mongo.js
...

## App start(Express)
...
npm start
...


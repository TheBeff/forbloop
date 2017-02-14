'use strict';

const express = require('express');
const PrettyError = require('pretty-error');
const bodyParser = require('body-parser');
const { resolve } = require('path');

const app = express();
const prettyError = new PrettyError();

prettyError.skipNodeFiles();
prettyError.skipPackage('express');

const server = app.listen(
	process.env.PORT || 1337,
	() => {
		console.log(`Listening on ${JSON.stringify(server.address())}`);
	}
);

app
	.use(bodyParser.urlencoded({extended: true}))
	.use(bodyParser.json())
	.use('/node_modules', express.static(resolve(__dirname, '..', 'node_modules')))
	.use(express.static(resolve(__dirname, '..', 'public')))
	.get('/*', (_, res) => res.sendFile(resolve(__dirname, '..', 'public', 'index.html')))
	.use((err, req, res, next) => {
		console.log(prettyError.render(err));
		res.status(500).send(err);
		next();
	});

module.exports = app;

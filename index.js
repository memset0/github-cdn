const { Router } = require('express');
const serveLanding = require('./api/serve-landing');
const getRatelimit = require('./api/get-ratelimit');
const getRepo = require('./api/get-repo');
const getPath = require('./api/get-path');
const getGist = require('./api/get-gist');

function githubCdnRouter() {
	const router = Router();

	router.get('/', serveLanding);

	router.use((req, res, next) => {
		res.header('Access-Control-Allow-Origin', '*');
		next();
	});

	router.get('/favicon.ico', (req, res) => {
		res.status(404);
	})

	router.get('/ratelimit', getRatelimit);
	router.get('/gist/:gistId?/:path?', getGist);
	router.get('/:owner/:repo?', getRepo);
	router.get('/:owner/:repo@:ref?:path(/*)?', getPath);
	router.get('/:owner/:repo:path(/*)?', getPath);

	return router;
}

module.exports = githubCdnRouter;

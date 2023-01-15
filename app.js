require('dotenv/config');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const Debug = require('debug');
const githubCdnRouter = require('.');

const debug = Debug('github-cdn');
const { port = 3005 } = require('./config');

const app = express();
app.use(cors());
app.disable('x-powered-by');
app.use(cookieParser());
app.use(githubCdnRouter());

const listener = app.listen(port, () => {
	debug(`Github CDN listening on http://localhost:${listener.address().port}`);
});

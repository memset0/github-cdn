const got = require('got');
const { HttpsProxyAgent } = require('hpagent');
const { github } = require('./github-config');
const config = require('../../config');

const githubApi = got.extend({
	prefixUrl: github.apiBase,
	throwHttpErrors: false,
	timeout: 10000,
	headers: {
		Accept: 'application/vnd.github.v3.raw+json',
	},

	...(config.proxy
		? {
			https: new HttpsProxyAgent({
				keepAlive: true,
				keepAliveMsecs: 1000,
				maxSockets: 256,
				maxFreeSockets: 256,
				scheduling: 'lifo',
				proxy: config.proxy,
			}),
		}
		: {}),
});

module.exports = githubApi;

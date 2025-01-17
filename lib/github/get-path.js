const mime = require('mime');
const nodePath = require('path');
const qs = require('querystring');
const cacheFallback = require('../utils/cache-fallback');
const githubApi = require('../utils/github-api');
const { github } = require('../utils/config');
const resError = require('../utils/res-error');

const cacheDuration = 10000;

function getPath({
	token = github.token,
	owner,
	repo,
	ref,
	path = '',
}) {
	// Github Contents API doesn't support trailing slashes in their requests
	// If given, it redirects and neglects the ref
	const fileType = mime.getType(path);
	path = path.replace(/\/$/, '');

	if (!ref) {
		ref = '';
	}

	return cacheFallback({
		cacheDuration,
		key: `contents:${token}//${owner}//${repo}//${ref}//${path}`,
		request: async () => {
			const reqPath = `repos/${owner}/${repo}/contents${path}`;
			const query = ref ? qs.stringify({ ref }) : '';
			const opts = token ? { headers: { Authorization: `token ${token}` } } : undefined;

			async function requestFile() {
				const dirPath = nodePath.dirname(reqPath);
				const dirRes = await githubApi(`${dirPath}?${query}`, { ...opts }).json();
				const fileName = nodePath.basename(reqPath);
				const { sha } = dirRes.find((f) => f.name === fileName);
				return githubApi(`repos/${owner}/${repo}/git/blobs/${sha}`, opts).buffer();
			}

			if (fileType && (
				fileType.startsWith('image/')
				|| fileType.startsWith('audio/')
				|| fileType.startsWith('video/')
				|| fileType.startsWith('font/')
			)) {
				return requestFile();
			}

			// TODO: got pollutes `opts`` with property `url`. Delete if fixed in v11
			const res = await githubApi(`${reqPath}?${query}`, { ...opts });

			let { body } = res;

			if (res.headers['content-type'].indexOf('application/json') > -1) {
				body = JSON.parse(body);
			}

			if (res.statusCode !== 200) {
				const isTooLarge = body.errors && body.errors.find((e) => e.code === 'too_large');
				if (isTooLarge) {
					return requestFile();
				}

				throw resError(res.statusCode, body.message);
			}

			// Directory listing
			if (Array.isArray(body)) {
				return body.map(({ name, path, type }) => ({ name, path, type }));
			}

			return body;
		},
	});
}


module.exports = getPath;

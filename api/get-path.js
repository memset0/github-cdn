const mime = require('mime');
const log = require('../lib/utils/log');
const forbid = require('../lib/utils/forbid');
const resolveRef = require('../lib/resolve-ref');
const badgenUrl = require('../lib/badgen-url');
const getPath = require('../lib/github/get-path');
const config = require('../lib/utils/config');
const route = require('../lib/utils/route');

const constructUrl = ({
	owner, repo, ref, badge, path = '',
}) => (
	ref
		? `/${owner}/${repo}@${ref}${path}${(badge === '') ? '?badge' : ''}`
		: `/${owner}/${repo}${path}${(badge === '') ? '?badge' : ''}`
);

module.exports = route(async (req, res) => {
	log('[req:get-path]', req.url);

	const query = { ...req.cookies, ...req.query, ...req.params };

	if (config.private && !(query.owner && config.private.owners.includes(query.owner))) {
		return forbid(res);
	}

	res.assert(config.canAccess(query), 401, 'Restricted access');

	const resolved = await resolveRef(query);

	if (resolved.ref) {
		return res.redirect(302, constructUrl({ ...query, ...resolved }));
	}

	const cacheAge = (!resolved.ref && resolved.type === 'version') ? '31536000, immutable' : '60';
	res.setHeader('Cache-Control', `${query.token ? 'private' : 'public'}, max-age=${cacheAge}`);

	const { path } = query;

	if (!path) {
		return res.redirect(
			301,
			query.badge === '' ? badgenUrl(query) : constructUrl({ ...query, path: '/' }),
		);
	}

	const { source, data } = await getPath(query);

	res
		.headers({
			'X-GITHUB-CDN-SOURCE': source,
			'Content-type': mime.getType(path),
		})
		.send(data);
});

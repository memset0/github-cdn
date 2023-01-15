const debug = require('debug');
const resError = require('./res-error');

const helpers = {
	redirect(statusCode, dest) {
		this.setHeader('Location', dest);
		this.status(statusCode).end();
	},

	assert(condition, statusCode, message) {
		if (!condition) {
			throw resError(statusCode, message);
		}
		return this;
	},

	headers(obj) {
		Object.entries(obj).forEach(([key, val]) => this.setHeader(key, val));
		return this;
	},
};


const route = (fn) => (req, res) => {
	Object.assign(res, helpers);

	fn(req, res).catch(
		(err) => {
			if (debug.enabled('github-cdn')) {
				console.error(err);
			}

			res
				.status((err && err.statusCode) || 400)
				.send({
					err: debug.enabled('github-cdn')
						? err.message
						: 'error message is hidden in production environment',
				});
		},
	);
};

module.exports = route;

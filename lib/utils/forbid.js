const log = require('./log');

module.exports = (res, message = 'forbidden (private mode enabled)') => {
	log('(private mode) forbidden');

	return res.status(403).send({ err: message });
};

const semver = require('semver');
const getRemoteInfo = require('./github/get-remote-info');

async function resolveRef(args) {
	let { ref } = args;

	if (ref) {
		if (ref === 'latest') {
			ref = '*';
		}

		const { data } = await getRemoteInfo(args);
		if (semver.validRange(ref)) {
			const { refs } = data;
			const versions = Object.keys(refs.tags || {}).filter(semver.valid);
			const matchesVersion = semver.maxSatisfying(versions, ref);

			return {
				type: 'version',
				ref: (matchesVersion !== ref) ? matchesVersion : undefined,
			};
		}
	}

	return { type: 'branch' };
}

module.exports = resolveRef;

const dns = require('node:dns').promises;
const { Resolver } = dns;
const emailValidator = require('./index.js');

const resolverFor = ({ servers, timeout, tries }) => {
	if (!servers?.length && timeout === undefined && tries === undefined) return dns;

	const resolver = new Resolver({ timeout: timeout ?? -1, tries: tries ?? 4 });
	if (servers?.length) resolver.setServers(servers);
	return resolver;
};

module.exports = async (input, options = {}) => {
	if (!input || typeof input !== 'string') return false;

	if (options.validateSyntax && !emailValidator(input)) return false;

	const domain = input.slice(input.lastIndexOf('@') + 1).trim();
	if (!domain) return false;

	try {
		const records = await resolverFor(options).resolveMx(domain);
		return records.length > 0;
	} catch {
		return false;
	}
};

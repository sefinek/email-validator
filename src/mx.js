import { promises as dns } from 'node:dns';
import { domainToASCII } from 'node:url';
import emailValidator from './index.js';

const DEFINITIVE_NEGATIVE = new Set(['ENODATA', 'ENOTFOUND']);

const isNullMx = ({ exchange }) => exchange === '' || exchange === '.';

const resolverFor = ({ servers, timeout, tries }) => {
	if (!servers?.length && timeout === undefined && tries === undefined) return dns;

	const resolver = new dns.Resolver({ timeout: timeout ?? -1, tries: tries ?? 4 });
	if (servers?.length) resolver.setServers(servers);
	return resolver;
};

// RFC 5321 section 5.1: a domain without MX records is still deliverable when it has an address record.
const hasAddress = async (resolver, domain) => {
	const results = await Promise.allSettled([resolver.resolve4(domain), resolver.resolve6(domain)]);
	if (results.some(r => r.status === 'fulfilled' && r.value.length > 0)) return true;

	const unknown = results.find(r => r.status === 'rejected' && !DEFINITIVE_NEGATIVE.has(r.reason?.code));
	if (unknown) throw unknown.reason;

	return false;
};

const acceptsMail = async (resolver, domain) => {
	let records;
	try {
		records = await resolver.resolveMx(domain);
	} catch (err) {
		if (err?.code === 'ENODATA') return hasAddress(resolver, domain);
		if (err?.code === 'ENOTFOUND') return false;
		throw err;
	}

	if (!records.length) return hasAddress(resolver, domain);

	// RFC 7505 null MX: the domain explicitly states it accepts no mail, so there is no address fallback either.
	return records.some(record => !isNullMx(record));
};

const verifyMx = async (input, options = {}) => {
	if (!input || typeof input !== 'string') return false;

	if (options.validateSyntax && !emailValidator(input)) return false;

	const domain = domainToASCII(input.slice(input.lastIndexOf('@') + 1).trim());
	if (!domain) return false;

	try {
		return await acceptsMail(resolverFor(options), domain);
	} catch {
		return options.failOpen === true;
	}
};

export default verifyMx;
export { verifyMx as 'module.exports' };

const { version } = require('../package.json');
const MAIN_REGEX = /^[-!#$%&'*+\\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

function isValidLocalPart(localPart) {
	if (localPart.startsWith('.') || localPart.endsWith('.')) return false;

	let prevChar = null;
	for (const char of localPart) {
		if (char === '.' && prevChar === '.') return false;
		prevChar = char;
	}

	return true;
}

function isValidDomain(domain) {
	const domainParts = domain.split('.');
	for (const part of domainParts) {
		if (part.length === 0 || part.length > 63 || part.startsWith('-') || part.endsWith('-')) return false;
	}

	return true;
}

module.exports = {
	test: email => {
		if (!email || email.includes('*')) return false;

		const [localPart, domain] = email.split('@');
		if (!localPart || !domain || localPart.length > 64 || domain.length > 255) return false;

		if (!isValidLocalPart(localPart) || !isValidDomain(domain)) return false;

		return MAIN_REGEX.test(email);
	},
	version
};
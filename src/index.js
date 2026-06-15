const VERSION = '2.1.0';
const REGEX = /^[-!#$%&'+\\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'+\\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

const isValidDomain = domain => {
	const domainParts = domain.split('.');
	for (const part of domainParts) {
		if (part.length === 0 || part.length > 63 || part.startsWith('-') || part.endsWith('-')) return false;
	}

	return true;
};

const emailValidator = email => {
	if (typeof email !== 'string' || email.length > 254) return false;

	const [localPart, domain] = email.split('@');
	if (!localPart || !domain || localPart.length > 64) return false;

	if (!isValidDomain(domain)) return false;

	return REGEX.test(email);
};

emailValidator.version = VERSION;
module.exports = emailValidator;